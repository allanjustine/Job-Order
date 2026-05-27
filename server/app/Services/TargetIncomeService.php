<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\JobOrder;
use App\Models\TargetIncome;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class TargetIncomeService
{
    public function getTargetIncomes()
    {
        $per_page = request('perPage', 10);

        $sort = request('sort', ["column" => "target_income", "direction" => "asc"]);

        $column = match ($sort['column']) {
            'user.name' => User::query()->select('code')->whereColumn('users.id', 'targetIncomes.user_id'),
            default => $sort['column']
        };

        $search = request('search', '');

        $filter_item = request('filter_item', '');

        $targetIncome = TargetIncome::query()
            ->with('user:id,code,name')
            ->where(
                fn($targetIncome)
                =>
                $filter_item ? $targetIncome->whereMonth('month_of', $filter_item) : $targetIncome->whereMonth('month_of', now()->month)
                    ->whereYear('month_of', now()->year)
            )
            ->when(
                $search,
                fn($query)
                =>
                $query->where('target_income', 'like', "%$search%")
                    ->orWhereRelation('user', 'name', 'like', "%$search%")
            )
            ->orderBy($column, $sort['direction'])
            ->paginate($per_page, ['id', 'target_income', 'month_of', 'user_id', 'created_at']);

        $targetIncome->through(function ($target) use ($filter_item) {
            $jobOrderIncome = JobOrder::query()
                ->whereRelation('customer.user', 'id', $target->user_id)
                ->withSum([
                    'jobOrderDetailsByJobRequestType'
                    =>
                    fn($jobOrderDetail)
                    =>
                    $filter_item ? $jobOrderDetail->whereMonth('created_at', $filter_item) : $jobOrderDetail->whereMonth('created_at', now()->month)
                        ->whereYear('created_at', now()->year)
                ], 'amount')
                ->get()
                ->sum('job_order_details_by_job_request_type_sum_amount');

            return [
                'id'            => $target->id,
                'user'          => [
                    'id'        => $target->user_id,
                    'name'      => $target->user->name,
                    'code'      => $target->user->code,
                ],
                'target_income' => $target->target_income,
                'shop_income'   => $jobOrderIncome,
                'created_at'    => $target->created_at,
                'month_of'      => $target->month_of
            ];
        });

        return $targetIncome;
    }

    public function store($request)
    {
        $toInsert = [];

        foreach ($request->user_ids as $user_id) {
            $toInsert[] = [
                "target_income" => $request->target_income,
                "user_id" => $user_id,
                'month_of' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        TargetIncome::query()
            ->insert($toInsert);

        return count($toInsert);
    }

    public function update($request, $targetIncome)
    {
        return $targetIncome->update([
            "target_income" => $request->target_income
        ]);
    }

    public function delete($targetIncome)
    {
        return $targetIncome->delete();
    }

    public function syncWithLastMonth()
    {
        $targetIncome = TargetIncome::query()
            ->whereYear('month_of', now()->year);

        (clone $targetIncome)
            ->whereMonth('month_of', now()->month)
            ->delete();

        $targetIncomes = (clone $targetIncome)
            ->whereMonth('month_of', now()->subMonth()->month)
            ->get(['user_id', 'target_income']);

        if ($targetIncomes->isEmpty()) {
            abort(400, 'No target income data found for last month to sync.');
        }

        $toInsert = $targetIncomes->map(fn($ti) => [
            'user_id'       => $ti->user_id,
            'target_income' => $ti->target_income,
            'month_of'      => now(),
            'created_at'    => now(),
            'updated_at'    => now(),
        ]);

        TargetIncome::query()
            ->insert($toInsert->toArray());

        return $targetIncomes;
    }
}
