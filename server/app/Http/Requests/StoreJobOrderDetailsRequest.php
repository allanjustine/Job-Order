<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

class StoreJobOrderDetailsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check() && Auth::user()?->isAdmin();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'category'    => ['required', 'string', 'max:255', 'min:2'],
            'amount'      => ['required', 'numeric'],
            'type'        => [Rule::in(['job_request', 'parts_replacement'])],
            'part_brand'  => ['nullable', Rule::requiredIf(fn() => $this->type === 'parts_replacement' || Str::startsWith(Str::lower($this->category), 'coupon')), 'string', 'max:255', 'min:2'],
            'part_number' => ['nullable', Rule::requiredIf(fn() => $this->type === 'parts_replacement'), 'string', 'max:255'],
            'quantity'    => ['nullable', Rule::requiredIf(fn() => $this->type === 'parts_replacement'), 'numeric']
        ];
    }
}
