<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUsuarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $roles = ['Administrador', 'Farmacéutico', 'Auxiliar', 'Solo Lectura'];

        return [
            'username' => ['required', 'string', 'max:50', 'unique:usuarios,username'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
            'nombres' => ['required', 'string', 'max:150'],
            'apellidos' => ['required', 'string', 'max:150'],
            'email' => ['nullable', 'email', 'max:100'],
            'rol' => ['required', Rule::in($roles)],
            'activo' => ['boolean'],
        ];
    }
}
