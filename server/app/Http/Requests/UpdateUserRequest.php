<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
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
            'name'      => ['required', 'string', 'max:255'],
            'code'      => ['required', Rule::unique('users', 'code')->ignore($this->user->id), 'uppercase', 'min:2', 'max:15'],
            'email'     => ['required', 'email', Rule::unique('users', 'email')->ignore($this->user->id)],
            'branch_id' => ['required', Rule::exists('branches', 'id')]
        ];
    }

    public function messages(): array
    {
        return [
            'branch_id.required' => 'Branch is required',
            'branch_id.exists'   => 'Branch does not exist',
        ];
    }
}
