<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\JobOrder;
use App\Models\TargetIncome;
use App\Models\User;

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

        $targetIncome = TargetIncome::query()
            ->with('user:id,code,name')
            ->when(
                fn($query)
                =>
                $query->where('target_income', 'like', "%$search%")
                    ->orWhereRelation('user', 'name', 'like', "%$search%")
            )
            ->where(
                fn($targetIncome)
                =>
                $targetIncome->whereMonth('month_of', now()->month)
                    ->whereYear('month_of', now()->year)
            )
            ->orderBy($column, $sort['direction'])
            ->paginate($per_page, ['id', 'target_income', 'month_of', 'user_id', 'created_at']);

        $targetIncome->getCollection()->transform(function ($target) {
            $customerIds = Customer::query()
                ->where('user_id', $target->user_id)
                ->pluck('id');

            $jobOrderIncome = JobOrder::query()
                ->whereIn('customer_id', $customerIds)
                ->withSum([
                    'jobOrderDetails'
                    =>
                    fn($jobOrderDetail)
                    =>
                    $jobOrderDetail->whereMonth('created_at', now()->month)
                        ->whereYear('created_at', now()->year)
                ], 'amount')
                ->get()
                ->sum('job_order_details_sum_amount');

            return [
                'id'            => $target->id,
                'user'          => [
                    'id'        => $target->user_id,
                    'name'      => $target->user->name,
                    'code'      => $target->user->code,
                ],
                'target_income' => $target->target_income,
                'shop_income'   => $jobOrderIncome,
                'created_at'    => $target->created_at
            ];
        });

        return $targetIncome;
    }

    public function store($request)
    {
        return TargetIncome::query()
            ->create([
                "target_income" => $request->target_income,
                "user_id"       => $request->user_id,
                'month_of'      => now()
            ]);
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
}
