<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUbicacionRequest extends FormRequest
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
        return [
            'id_seccion' => ['required', 'exists:secciones,id_seccion'],
            'codigo' => ['required', 'string', 'max:20', 'unique:ubicaciones,codigo'],
            'fila' => ['nullable', 'string', 'max:10'],
            'columna' => ['nullable', 'string', 'max:10'],
            'nivel' => ['nullable', 'string', 'max:10'],
            'capacidad_maxima' => ['nullable', 'integer', 'min:0'],
            'activo' => ['boolean'],
        ];
    }
}
