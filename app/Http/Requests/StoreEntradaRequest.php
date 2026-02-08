<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEntradaRequest extends FormRequest
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
        $tiposDocumento = ['Factura', 'Boleta', 'Guía de Remisión', 'Nota de Crédito', 'Otro'];

        return [
            'numero_documento' => ['required', 'string', 'max:50', 'unique:entradas,numero_documento'],
            'tipo_documento' => ['required', Rule::in($tiposDocumento)],
            'id_proveedor' => ['nullable', 'exists:proveedores,id_proveedor'],
            'fecha_entrada' => ['required', 'date'],
            'fecha_documento' => ['nullable', 'date'],
            'observaciones' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.id_presentacion' => ['required', 'exists:presentaciones,id_presentacion'],
            'items.*.numero_lote' => ['required', 'string', 'max:50'],
            'items.*.fecha_fabricacion' => ['nullable', 'date'],
            'items.*.fecha_vencimiento' => ['required', 'date'],
            'items.*.cantidad' => ['required', 'integer', 'min:1'],
            'items.*.precio_unitario' => ['nullable', 'numeric', 'min:0'],
            'items.*.id_ubicacion' => ['nullable', 'exists:ubicaciones,id_ubicacion'],
            'items.*.registro_sanitario' => ['nullable', 'string', 'max:100'],
        ];
    }
}
