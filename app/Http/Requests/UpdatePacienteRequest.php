<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePacienteRequest extends FormRequest
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
        $paciente = $this->route('paciente');

        return [
            'dni' => ['nullable', 'string', 'size:8', Rule::unique('pacientes', 'dni')->ignore($paciente->id_paciente, 'id_paciente'), 'regex:/^[0-9]{8}$/'],
            'nombres' => ['required', 'string', 'max:150'],
            'apellidos' => ['required', 'string', 'max:150'],
            'fecha_nacimiento' => ['nullable', 'date'],
            'sexo' => ['nullable', Rule::in(['M', 'F', 'Otro'])],
            'telefono' => ['nullable', 'string', 'max:20'],
            'direccion' => ['nullable', 'string'],
            'email' => ['nullable', 'email', 'max:100'],
            'activo' => ['boolean'],
        ];
    }
}
