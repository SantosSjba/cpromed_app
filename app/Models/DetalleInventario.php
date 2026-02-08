<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetalleInventario extends Model
{
    protected $table = 'detalle_inventarios';

    protected $primaryKey = 'id_detalle_inventario';

    public $timestamps = false;

    protected $fillable = [
        'id_inventario',
        'id_lote',
        'cantidad_sistema',
        'cantidad_fisica',
        'diferencia',
        'observaciones',
    ];

    public function inventario(): BelongsTo
    {
        return $this->belongsTo(Inventario::class, 'id_inventario');
    }

    public function lote(): BelongsTo
    {
        return $this->belongsTo(Lote::class, 'id_lote');
    }
}
