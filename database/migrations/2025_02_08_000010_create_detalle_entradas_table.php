<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('detalle_entradas', function (Blueprint $table) {
            $table->increments('id_detalle_entrada');
            $table->unsignedInteger('id_entrada');
            $table->unsignedInteger('id_lote');
            $table->unsignedInteger('cantidad');
            $table->decimal('precio_unitario', 10, 2)->nullable();
            $table->decimal('subtotal', 10, 2)->nullable();
            $table->timestamp('fecha_creacion')->useCurrent();
            $table->foreign('id_entrada')->references('id_entrada')->on('entradas')->cascadeOnDelete();
            $table->foreign('id_lote')->references('id_lote')->on('lotes')->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('detalle_entradas');
    }
};
