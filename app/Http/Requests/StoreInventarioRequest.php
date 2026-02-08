<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreInventarioRequest extends FormRequest
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
        $tipos = ['Total', 'Parcial', 'Cíclico'];

        return [
            'fecha_inventario' => ['required', 'date'],
            'tipo' => ['required', Rule::in($tipos)],
            'observaciones' => ['nullable', 'string', 'max:500'],
            'usuario_responsable' => ['nullable', 'string', 'max:100'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.id_lote' => ['required', 'exists:lotes,id_lote'],
            'items.*.cantidad_fisica' => ['nullable', 'integer', 'min:0'],
            'items.*.observaciones' => ['nullable', 'string', 'max:255'],
        ];
    }
}
