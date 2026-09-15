<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class StoreTicketRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title'              => ['required', 'string', 'max:255', 'min:2'],
            'description'        => ['required', 'string', 'max:5000', 'min:2'],
            'ticket_brand_id'    => ['required', Rule::exists('ticket_brands', 'id')],
            'ticket_category_id' => ['required', Rule::exists('ticket_categories', 'id')],
            'from_tos.*.from'    => ['required', 'string', 'min:2', 'max:255'],
            'from_tos.*.to'      => ['required', 'string', 'min:2', 'max:255'],
            'attachments'        => ['sometimes', 'array'],
            'attachments.*'      => ['image', 'max:5120'],
            'job_order_id'       => ['required', Rule::exists('job_orders', 'id')],
        ];
    }
}
