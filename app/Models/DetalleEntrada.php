<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetalleEntrada extends Model
{
    protected $table = 'detalle_entradas';

    protected $primaryKey = 'id_detalle_entrada';

    public $timestamps = false;

    protected $fillable = [
        'id_entrada',
        'id_lote',
        'cantidad',
        'precio_unitario',
        'subtotal',
    ];

    protected function casts(): array
    {
        return [
            'precio_unitario' => 'decimal:2',
            'subtotal' => 'decimal:2',
        ];
    }

    public function entrada(): BelongsTo
    {
        return $this->belongsTo(Entrada::class, 'id_entrada');
    }

    public function lote(): BelongsTo
    {
        return $this->belongsTo(Lote::class, 'id_lote');
    }
}
