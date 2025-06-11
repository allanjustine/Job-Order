<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\PartsRequest;

class PartsRequestController extends Controller
{
    public function store(Request $request){
        $validation = Validator::make($request->all(),[
            'parts_name' => 'required',
            'part_no' => 'required',
            'quantity' => 'required',
            'price' => 'required',
        ]);

        if($validation->fails()){

            return response()->json([

                'status' => false,
                'message' => $validation->errors()
            ]);
        }

        $parts_request = PartsRequest::create([

            'parts_name' => $request->parts_name,
            'part_no' => $request->part_no,
        ]);
    }

    public function index(){
        
        $parts_request = PartsRequest::all();
        
        return response()->json([
         'status' => true,
         'data' => $parts_request
        ]);
    }
}
