<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSalidaRequest extends FormRequest
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
        $tiposSalida = ['Dispensación', 'Transferencia', 'Baja', 'Merma', 'Vencido', 'Otro'];
        $tiposUnidad = ['Caja', 'Blister', 'Tableta', 'Frasco', 'Ampolla', 'Unidad', 'Otro'];

        return [
            'id_paciente' => ['nullable', 'exists:pacientes,id_paciente'],
            'paciente_nombre' => ['nullable', 'string', 'max:200'],
            'tipo_salida' => ['required', Rule::in($tiposSalida)],
            'fecha_salida' => ['required', 'date'],
            'observaciones' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.id_lote' => ['required', 'exists:lotes,id_lote'],
            'items.*.tipo_unidad' => ['required', Rule::in($tiposUnidad)],
            'items.*.cantidad' => ['required', 'integer', 'min:1'],
        ];
    }
}
