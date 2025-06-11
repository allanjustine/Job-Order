<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\JobRequest;

class CustomerRequestController extends Controller
{
    public function store(Request $request){
        $validation = Validator::make($request->all(), [
            'customer_id' => 'required',
            'customer_request' => 'required',
            'cost' => 'required', 
        ]);

        $customer_request = JobRequest::create([
            'customer_id' => $request->customer_id,
            'customer_request' => $request->customer_request,
            'cost' => $request->cost
        ]);

        return response()->json([

            'message' => 'Customer request created successfully',
            'data' => $customer_request

        ]);

    }
}
