<?php

namespace App\Services;

use App\Enums\TicketStatus;
use App\Models\Ticket;
use App\Models\TicketBrand;
use App\Models\TicketCategory;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TicketService
{
    public function getAllTickets()
    {
        $per_page = request('perPage', 10);

        $search = request('search', '');

        $sort = request('sort', ["column" => "created_at", "direction" => "desc"]);

        $tickets = Ticket::query()
            ->with(['user:id,name,code', 'ticketCategory:id,name', 'ticketBrand:id,name', 'jobOrder:id,job_order_number'])
            ->when(!Auth::user()->isAdmin(), fn($query) => $query->where('user_id', Auth::id()))
            ->when($search, function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->whereAny([
                        'title',
                        'description',
                        'ticket_code'
                    ], 'like', "%{$search}%")
                        ->orWhereRelation('user', 'name', 'like', "%{$search}%")
                        ->orWhereRelation('editedBy', 'name', 'like', "%{$search}%")
                        ->orWhereRelation('jobOrder', 'job_order_number', 'like', "%{$search}%")
                        ->orWhereRelation('jobOrder', 'transaction_code', 'like', "%{$search}%");
                });
            })
            ->orderBy($sort['column'], $sort['direction'])
            ->paginate($per_page, [
                'id',
                'user_id',
                'edited_by',
                'job_order_id',
                'ticket_brand_id',
                'ticket_category_id',
                'title',
                'ticket_code',
                'status',
                'created_at'
            ]);

        return $tickets;
    }

    public function storeTicket($request)
    {
        abort_if(Auth::user()->hasPendingTicket($request->job_order_id), 400, "You already have a pending ticket for this job order. Please wait for it to be edited.");

        return DB::transaction(function () use ($request) {
            do {
                $ticket_code = Str::of('JO-')->append(Str::random(6))->upper();
            } while (Ticket::query()->where('ticket_code', $ticket_code)->exists());

            $ticket = Auth::user()
                ->tickets()
                ->create([
                    'title'              => $request->title,
                    'description'        => $request->description,
                    'ticket_brand_id'    => $request->ticket_brand_id,
                    'ticket_category_id' => $request->ticket_category_id,
                    'job_order_id'       => $request->job_order_id,
                    'ticket_code'        => $ticket_code
                ]);

            if ($request->has('from_tos')) {
                $ticket->changeRequests()->createMany($request->from_tos);
            }

            if ($request->hasFile('attachments')) {
                $attachments = $request->file('attachments', []);

                $attachment_to_store = [];

                foreach ($attachments as $attachment) {
                    $file_path = time() . '-' . $attachment->getClientOriginalName();

                    $attachment_to_store[] = [
                        'file_name' => $attachment->getClientOriginalName(),
                        'file_path' => $attachment->storeAs('tickets/attachments', $file_path, 'public'),
                        'file_type' => $attachment->getClientMimeType(),
                        'file_size' => $attachment->getSize(),
                    ];
                }


                $ticket->attachments()->createMany($attachment_to_store);
            }

            return $ticket;
        });
    }

    public function getTicketById(Ticket $ticket)
    {
        return $ticket->load(['user', 'editedBy', 'notes.notedBy', 'attachments', 'changeRequests', 'ticketCategory', 'ticketBrand', 'jobOrder:id,job_order_number,transaction_code']);
    }

    public function getAllTicketCategoriesAndBrands()
    {
        $categories = TicketCategory::query()
            ->orderBy('name')
            ->get();

        $brands = TicketBrand::query()
            ->orderBy('name')
            ->get();

        return [
            'categories' => $categories,
            'brands'     => $brands
        ];
    }

    public function deleteTicket($ticket)
    {
        abort_if($ticket->status !== TicketStatus::PENDING, 400, "Only pending tickets can be deleted.");

        $ticket->delete();

        activity()
            ->causedBy(Auth::user())
            ->performedOn($ticket)
            ->log("Ticket \"{$ticket->ticket_code}\" deleted.");

        return $ticket;
    }

    public function updateTicketStatus($request, $ticket, $title)
    {
        $ticket = DB::transaction(function () use ($request, $ticket, $title) {
            if ($title === 'reject') {
                $ticket->update([
                    'rejected_reason' => $request->note,
                    'status'          => TicketStatus::REJECTED
                ]);
            } else {
                $ticket->update([
                    'edited_at' => now(),
                    'edited_by' => Auth::id(),
                    'status'    => TicketStatus::EDITED
                ]);

                $ticket->notes()->create([
                    'content'  => $request->note,
                    'noted_by' => Auth::id()
                ]);
            }

            return $ticket;
        });

        $message = $title === 'reject' ? "Rejected ticket \"{$ticket->ticket_code}\" and the reason is: \"{$request->rejected_reason}\"." : "Edited ticket \"{$ticket->ticket_code}\" and the note is: \"{$request->note}\".";

        activity()
            ->causedBy(Auth::user())
            ->performedOn($ticket)
            ->log($message);

        return $ticket;
    }

    public function addNoteToTicket($request, $ticket)
    {
        $ticket->notes()->create([
            'content'  => $request->note,
            'noted_by' => Auth::id()
        ]);

        activity()
            ->causedBy(Auth::user())
            ->performedOn($ticket)
            ->log("Added a note to ticket \"{$ticket->ticket_code}\" and the note is: \"{$request->note}\".");

        return $ticket;
    }

    public function deleteNote($note)
    {
        $note->delete();

        activity()
            ->causedBy(Auth::user())
            ->performedOn($note)
            ->log("Deleted a note to ticket \"{$note->ticket->ticket_code}\" and the note is: \"{$note->content}\".");

        return $note;
    }

    public function updateTicketRejectedReason($ticket, $request)
    {
        $old_reason = $ticket->rejected_reason;

        $ticket->update([
            'rejected_reason' => $request->rejected_reason
        ]);

        $message = "Ticket with ticket code of {$ticket->ticket_code} updated rejected reason successfully from \"{$old_reason}\" to \"{$ticket->rejected_reason}\"";

        activity()
            ->causedBy(Auth::user())
            ->performedOn($ticket)
            ->log($message);

        return $message;
    }

    public function updateTicketNoteContent($note, $request)
    {
        $old_content = $note->content;

        $note->update([
            'content' => $request->content
        ]);

        $message = "Ticket note from ticket with ticket code of {$note->ticket->ticket_code} updated content successfully from \"{$old_content}\" to \"{$note->content}\"";

        activity()
            ->causedBy(Auth::user())
            ->performedOn($note)
            ->log($message);

        return $message;
    }
}
