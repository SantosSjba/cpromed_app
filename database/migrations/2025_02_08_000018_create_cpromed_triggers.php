<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (config('database.default') !== 'mysql') {
            return;
        }

        DB::unprepared('
            CREATE TRIGGER trg_actualizar_stock_entrada
            AFTER INSERT ON detalle_entradas
            FOR EACH ROW
            UPDATE lotes SET cantidad_actual = cantidad_actual + NEW.cantidad WHERE id_lote = NEW.id_lote
        ');

        DB::unprepared('
            CREATE TRIGGER trg_actualizar_stock_salida
            AFTER INSERT ON detalle_salidas
            FOR EACH ROW
            UPDATE lotes SET cantidad_actual = cantidad_actual - NEW.cantidad WHERE id_lote = NEW.id_lote
        ');
    }

    public function down(): void
    {
        if (config('database.default') !== 'mysql') {
            return;
        }

        DB::unprepared('DROP TRIGGER IF EXISTS trg_actualizar_stock_salida');
        DB::unprepared('DROP TRIGGER IF EXISTS trg_actualizar_stock_entrada');
    }
};
