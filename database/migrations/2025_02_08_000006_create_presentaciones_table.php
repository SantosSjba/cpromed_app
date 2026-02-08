<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('presentaciones', function (Blueprint $table) {
            $table->increments('id_presentacion');
            $table->unsignedInteger('id_medicamento');
            $table->enum('tipo_presentacion', [
                'Tableta/Cápsula', 'Blister', 'Frasco', 'Caja', 'Paquete',
                'Ampolla', 'Vial', 'Tubo', 'Sachet', 'Otro',
            ]);
            $table->unsignedInteger('unidades_por_presentacion');
            $table->string('codigo_barras', 100)->nullable();
            $table->decimal('precio_compra', 10, 2)->nullable();
            $table->decimal('precio_venta', 10, 2)->nullable();
            $table->unsignedInteger('id_ubicacion')->nullable();
            $table->unsignedInteger('stock_minimo')->default(0);
            $table->unsignedInteger('stock_maximo')->default(0);
            $table->boolean('activo')->default(true);
            $table->timestamp('fecha_creacion')->useCurrent();
            $table->foreign('id_medicamento')->references('id_medicamento')->on('medicamentos')->cascadeOnDelete();
            $table->foreign('id_ubicacion')->references('id_ubicacion')->on('ubicaciones')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('presentaciones');
    }
};
