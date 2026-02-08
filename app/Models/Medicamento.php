<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Medicamento extends Model
{
    protected $table = 'medicamentos';

    protected $primaryKey = 'id_medicamento';

    public $timestamps = false;

    protected $fillable = [
        'codigo_digemid',
        'codigo_interno',
        'nombre_generico',
        'nombre_comercial',
        'id_categoria',
        'id_laboratorio',
        'principio_activo',
        'concentracion',
        'forma_farmaceutica',
        'via_administracion',
        'requiere_receta',
        'controlado',
        'temperatura_almacenamiento',
        'activo',
        'notas',
    ];

    protected function casts(): array
    {
        return [
            'requiere_receta' => 'boolean',
            'controlado' => 'boolean',
            'activo' => 'boolean',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'id_medicamento';
    }

    public function categoria(): BelongsTo
    {
        return $this->belongsTo(Categoria::class, 'id_categoria');
    }

    public function laboratorio(): BelongsTo
    {
        return $this->belongsTo(Laboratorio::class, 'id_laboratorio');
    }

    public function presentaciones(): HasMany
    {
        return $this->hasMany(Presentacion::class, 'id_medicamento');
    }
}
