<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Presentacion extends Model
{
    protected $table = 'presentaciones';

    protected $primaryKey = 'id_presentacion';

    public $timestamps = false;

    protected $fillable = [
        'id_medicamento',
        'tipo_presentacion',
        'unidades_por_presentacion',
        'codigo_barras',
        'precio_compra',
        'precio_venta',
        'id_ubicacion',
        'stock_minimo',
        'stock_maximo',
        'activo',
    ];

    protected function casts(): array
    {
        return [
            'precio_compra' => 'decimal:2',
            'precio_venta' => 'decimal:2',
            'activo' => 'boolean',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'id_presentacion';
    }

    public function medicamento(): BelongsTo
    {
        return $this->belongsTo(Medicamento::class, 'id_medicamento');
    }

    public function ubicacion(): BelongsTo
    {
        return $this->belongsTo(Ubicacion::class, 'id_ubicacion');
    }

    public function lotes(): HasMany
    {
        return $this->hasMany(Lote::class, 'id_presentacion');
    }
}
