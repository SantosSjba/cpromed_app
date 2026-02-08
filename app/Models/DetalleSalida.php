<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetalleSalida extends Model
{
    protected $table = 'detalle_salidas';

    protected $primaryKey = 'id_detalle_salida';

    public $timestamps = false;

    protected $fillable = [
        'id_salida',
        'id_lote',
        'tipo_unidad',
        'cantidad',
        'observaciones',
    ];

    public function salida(): BelongsTo
    {
        return $this->belongsTo(Salida::class, 'id_salida');
    }

    public function lote(): BelongsTo
    {
        return $this->belongsTo(Lote::class, 'id_lote');
    }
}
