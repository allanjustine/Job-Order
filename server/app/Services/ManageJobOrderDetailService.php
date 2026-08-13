<?php

namespace App\Services;

use App\Models\JobOrder;

class ManageJobOrderDetailService
{
    public function store($request)
    {
        $job_order = JobOrder::query()->findOrFail($request->job_order_id);

        $job_order->jobOrderDetails()->create([
            'category'    => $request->category,
            'amount'      => $request->amount,
            'type'        => $request->type,
            'part_brand'  => $request->part_brand ?: 'n/a',
            'part_number' => $request->part_number ?: 'n/a',
            'quantity'    => $request->quantity ?: 1
        ]);

        return $job_order;
    }

    public function delete($jobOrderDetail)
    {
        $jobOrderDetail->delete();

        return $jobOrderDetail;
    }
}
