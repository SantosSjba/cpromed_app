<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePresentacionRequest extends FormRequest
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
        $presentacion = $this->route('presentacion');
        $tipos = [
            'Tableta/Cápsula', 'Blister', 'Frasco', 'Caja', 'Paquete',
            'Ampolla', 'Vial', 'Tubo', 'Sachet', 'Otro',
        ];

        return [
            'id_medicamento' => ['required', 'exists:medicamentos,id_medicamento'],
            'tipo_presentacion' => ['required', Rule::in($tipos)],
            'unidades_por_presentacion' => ['required', 'integer', 'min:1'],
            'codigo_barras' => ['nullable', 'string', 'max:100'],
            'precio_compra' => ['nullable', 'numeric', 'min:0'],
            'precio_venta' => ['nullable', 'numeric', 'min:0'],
            'id_ubicacion' => ['nullable', 'exists:ubicaciones,id_ubicacion'],
            'stock_minimo' => ['nullable', 'integer', 'min:0'],
            'stock_maximo' => ['nullable', 'integer', 'min:0'],
            'activo' => ['boolean'],
        ];
    }
}
