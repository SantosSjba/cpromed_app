<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medicamentos', function (Blueprint $table) {
            $table->increments('id_medicamento');
            $table->string('codigo_digemid', 50)->unique()->nullable();
            $table->string('codigo_interno', 50)->unique();
            $table->string('nombre_generico', 200);
            $table->string('nombre_comercial', 200)->nullable();
            $table->unsignedInteger('id_categoria')->nullable();
            $table->unsignedInteger('id_laboratorio')->nullable();
            $table->string('principio_activo', 300)->nullable();
            $table->string('concentracion', 100)->nullable();
            $table->enum('forma_farmaceutica', [
                'Tableta', 'Cápsula', 'Jarabe', 'Suspensión', 'Inyectable',
                'Crema', 'Ungüento', 'Gotas', 'Óvulo', 'Supositorio', 'Parche',
                'Inhalador', 'Otro',
            ]);
            $table->enum('via_administracion', [
                'Oral', 'Tópica', 'Parenteral', 'Inhalatoria', 'Rectal', 'Vaginal',
                'Oftálmica', 'Ótica', 'Nasal', 'Sublingual', 'Otro',
            ])->nullable();
            $table->boolean('requiere_receta')->default(false);
            $table->boolean('controlado')->default(false);
            $table->string('temperatura_almacenamiento', 50)->nullable();
            $table->boolean('activo')->default(true);
            $table->text('notas')->nullable();
            $table->timestamp('fecha_creacion')->useCurrent();
            $table->timestamp('fecha_actualizacion')->useCurrent()->useCurrentOnUpdate();
            $table->foreign('id_categoria')->references('id_categoria')->on('categorias')->nullOnDelete();
            $table->foreign('id_laboratorio')->references('id_laboratorio')->on('laboratorios')->nullOnDelete();
            $table->index('nombre_generico');
            $table->index('codigo_interno');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medicamentos');
    }
};
