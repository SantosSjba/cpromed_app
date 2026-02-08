<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Entrada extends Model
{
    protected $table = 'entradas';

    protected $primaryKey = 'id_entrada';

    public $timestamps = false;

    protected $fillable = [
        'numero_documento',
        'tipo_documento',
        'id_proveedor',
        'fecha_entrada',
        'fecha_documento',
        'total',
        'observaciones',
        'usuario_registro',
    ];

    protected function casts(): array
    {
        return [
            'fecha_entrada' => 'date',
            'fecha_documento' => 'date',
            'total' => 'decimal:2',
        ];
    }

    public function proveedor(): BelongsTo
    {
        return $this->belongsTo(Proveedor::class, 'id_proveedor');
    }

    public function detalleEntradas(): HasMany
    {
        return $this->hasMany(DetalleEntrada::class, 'id_entrada');
    }
}
