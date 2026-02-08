<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUsuarioRequest extends FormRequest
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
        $usuario = $this->route('usuario');

        return [
            'username' => ['required', 'string', 'max:50', Rule::unique('usuarios', 'username')->ignore($usuario->id_usuario, 'id_usuario')],
            'password' => ['nullable', 'string', 'min:6', 'confirmed'],
            'nombres' => ['required', 'string', 'max:150'],
            'apellidos' => ['required', 'string', 'max:150'],
            'email' => ['nullable', 'email', 'max:100'],
            'rol' => ['required', Rule::in($roles)],
            'activo' => ['boolean'],
        ];
    }
}
