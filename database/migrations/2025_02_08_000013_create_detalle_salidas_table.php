<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('detalle_salidas', function (Blueprint $table) {
            $table->increments('id_detalle_salida');
            $table->unsignedInteger('id_salida');
            $table->unsignedInteger('id_lote');
            $table->enum('tipo_unidad', [
                'Caja', 'Blister', 'Tableta', 'Frasco', 'Ampolla', 'Unidad', 'Otro',
            ]);
            $table->unsignedInteger('cantidad');
            $table->text('observaciones')->nullable();
            $table->timestamp('fecha_creacion')->useCurrent();
            $table->foreign('id_salida')->references('id_salida')->on('salidas')->cascadeOnDelete();
            $table->foreign('id_lote')->references('id_lote')->on('lotes')->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('detalle_salidas');
    }
};
