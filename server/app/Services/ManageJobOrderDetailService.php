<?php

namespace App\Services;

use App\Models\JobOrder;
use Illuminate\Support\Facades\Auth;

class ManageJobOrderDetailService
{
    public function store($request)
    {
        $job_order = JobOrder::query()->findOrFail($request->job_order_id);

        $job_order_detail = $job_order->jobOrderDetails()->create([
            'category'    => $request->category,
            'amount'      => $request->amount,
            'type'        => $request->type,
            'part_brand'  => $request->part_brand ?: 'n/a',
            'part_number' => $request->part_number ?: 'n/a',
            'quantity'    => $request->quantity ?: 1
        ]);

        activity()
            ->causedBy(Auth::user())
            ->performedOn($job_order)
            ->log("Added new job order detail {$job_order_detail->category} to job order with transaction code of \"{$job_order->transaction_code}\".");

        return $job_order;
    }

    public function delete($jobOrderDetail)
    {
        activity()
            ->causedBy(Auth::user())
            ->performedOn($jobOrderDetail)
            ->log("Deleted job order detail {$jobOrderDetail->category}.");

        $jobOrderDetail->delete();

        return $jobOrderDetail;
    }
}
