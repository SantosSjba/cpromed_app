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
            CREATE VIEW v_stock_actual AS
            SELECT
                m.id_medicamento,
                m.codigo_interno,
                m.nombre_generico,
                m.nombre_comercial,
                p.tipo_presentacion,
                l.numero_lote,
                l.fecha_vencimiento,
                l.cantidad_actual,
                u.codigo AS ubicacion,
                s.codigo AS seccion,
                DATEDIFF(l.fecha_vencimiento, CURDATE()) AS dias_vencimiento
            FROM medicamentos m
            JOIN presentaciones p ON m.id_medicamento = p.id_medicamento
            JOIN lotes l ON p.id_presentacion = l.id_presentacion
            LEFT JOIN ubicaciones u ON l.id_ubicacion = u.id_ubicacion
            LEFT JOIN secciones s ON u.id_seccion = s.id_seccion
            WHERE l.activo = 1 AND m.activo = 1
        ');

        DB::unprepared('
            CREATE VIEW v_proximos_vencer AS
            SELECT
                m.nombre_generico,
                m.nombre_comercial,
                l.numero_lote,
                l.fecha_vencimiento,
                l.cantidad_actual,
                u.codigo AS ubicacion,
                DATEDIFF(l.fecha_vencimiento, CURDATE()) AS dias_restantes
            FROM medicamentos m
            JOIN presentaciones p ON m.id_medicamento = p.id_medicamento
            JOIN lotes l ON p.id_presentacion = l.id_presentacion
            LEFT JOIN ubicaciones u ON l.id_ubicacion = u.id_ubicacion
            WHERE l.activo = 1
              AND l.fecha_vencimiento BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 90 DAY)
            ORDER BY l.fecha_vencimiento ASC
        ');
    }

    public function down(): void
    {
        if (config('database.default') !== 'mysql') {
            return;
        }

        DB::unprepared('DROP VIEW IF EXISTS v_proximos_vencer');
        DB::unprepared('DROP VIEW IF EXISTS v_stock_actual');
    }
};
