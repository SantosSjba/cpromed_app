<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProveedorRequest extends FormRequest
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
        $proveedor = $this->route('proveedor');

        return [
            'ruc' => ['required', 'string', 'size:11', Rule::unique('proveedores', 'ruc')->ignore($proveedor->id_proveedor, 'id_proveedor'), 'regex:/^[0-9]{11}$/'],
            'razon_social' => ['required', 'string', 'max:200'],
            'nombre_comercial' => ['nullable', 'string', 'max:200'],
            'direccion' => ['nullable', 'string'],
            'telefono' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email', 'max:100'],
            'contacto_nombre' => ['nullable', 'string', 'max:100'],
            'activo' => ['boolean'],
        ];
    }
}
