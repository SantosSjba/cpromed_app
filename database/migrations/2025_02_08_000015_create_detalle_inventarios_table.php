<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('detalle_inventarios', function (Blueprint $table) {
            $table->increments('id_detalle_inventario');
            $table->unsignedInteger('id_inventario');
            $table->unsignedInteger('id_lote');
            $table->unsignedInteger('cantidad_sistema');
            $table->unsignedInteger('cantidad_fisica')->nullable();
            $table->integer('diferencia')->nullable();
            $table->text('observaciones')->nullable();
            $table->timestamp('fecha_creacion')->useCurrent();
            $table->foreign('id_inventario')->references('id_inventario')->on('inventarios')->cascadeOnDelete();
            $table->foreign('id_lote')->references('id_lote')->on('lotes')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('detalle_inventarios');
    }
};
