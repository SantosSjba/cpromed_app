import AppLayout from '@/layouts/AppLayout';
import { Head } from '@inertiajs/react';

interface StockRow {
    id_medicamento: number;
    codigo_interno: string | null;
    nombre_generico: string;
    nombre_comercial: string | null;
    tipo_presentacion: string;
    numero_lote: string;
    fecha_vencimiento: string;
    cantidad_actual: number;
    ubicacion: string | null;
    seccion: string | null;
    dias_vencimiento: number;
}

interface ProximoVencerRow {
    nombre_generico: string;
    nombre_comercial: string | null;
    numero_lote: string;
    fecha_vencimiento: string;
    cantidad_actual: number;
    ubicacion: string | null;
    dias_restantes: number;
}

export default function ReportesIndex({
    stock_actual,
    proximos_vencer,
    usar_vistas,
}: {
    stock_actual: StockRow[];
    proximos_vencer: ProximoVencerRow[];
    usar_vistas: boolean;
}) {
    return (
        <AppLayout title="Reportes">
            <Head title="Reportes" />
            <div className="space-y-8">
                {!usar_vistas && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        Los reportes de stock y vencimientos están disponibles solo con MySQL.
                    </div>
                )}
                {usar_vistas && (
                    <>
                        <section>
                            <h2 className="mb-4 text-lg font-semibold text-slate-800">Stock actual</h2>
                            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Código</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Medicamento</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Presentación</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Lote</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-slate-500">Cantidad</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Ubicación</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Vencimiento</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-slate-500">Días</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {stock_actual.length === 0 ? (
                                            <tr><td colSpan={8} className="px-4 py-6 text-center text-slate-500">Sin registros.</td></tr>
                                        ) : (
                                            stock_actual.map((r, i) => (
                                                <tr key={`${r.id_medicamento}-${r.numero_lote}-${i}`} className="hover:bg-slate-50">
                                                    <td className="px-4 py-2 text-sm">{r.codigo_interno ?? '—'}</td>
                                                    <td className="px-4 py-2 text-sm font-medium">{r.nombre_generico}</td>
                                                    <td className="px-4 py-2 text-sm">{r.tipo_presentacion}</td>
                                                    <td className="px-4 py-2 text-sm">{r.numero_lote}</td>
                                                    <td className="px-4 py-2 text-right text-sm font-medium">{r.cantidad_actual}</td>
                                                    <td className="px-4 py-2 text-sm">{r.ubicacion ?? '—'}</td>
                                                    <td className="px-4 py-2 text-sm">{r.fecha_vencimiento}</td>
                                                    <td className="px-4 py-2 text-right text-sm">{r.dias_vencimiento}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                                {stock_actual.length >= 500 && (
                                    <p className="border-t border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-500">Mostrando hasta 500 registros.</p>
                                )}
                            </div>
                        </section>
                        <section>
                            <h2 className="mb-4 text-lg font-semibold text-slate-800">Próximos a vencer (90 días)</h2>
                            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Medicamento</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Lote</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-slate-500">Cantidad</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Ubicación</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Vencimiento</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-slate-500">Días restantes</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {proximos_vencer.length === 0 ? (
                                            <tr><td colSpan={6} className="px-4 py-6 text-center text-slate-500">Ningún lote por vencer en 90 días.</td></tr>
                                        ) : (
                                            proximos_vencer.map((r, i) => (
                                                <tr key={`${r.numero_lote}-${r.fecha_vencimiento}-${i}`} className="hover:bg-slate-50">
                                                    <td className="px-4 py-2 text-sm font-medium">{r.nombre_generico}</td>
                                                    <td className="px-4 py-2 text-sm">{r.numero_lote}</td>
                                                    <td className="px-4 py-2 text-right text-sm font-medium">{r.cantidad_actual}</td>
                                                    <td className="px-4 py-2 text-sm">{r.ubicacion ?? '—'}</td>
                                                    <td className="px-4 py-2 text-sm">{r.fecha_vencimiento}</td>
                                                    <td className="px-4 py-2 text-right text-sm">
                                                        <span className={r.dias_restantes <= 30 ? 'font-medium text-amber-600' : ''}>{r.dias_restantes}</span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                                {proximos_vencer.length >= 200 && (
                                    <p className="border-t border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-500">Mostrando hasta 200 registros.</p>
                                )}
                            </div>
                        </section>
                    </>
                )}
            </div>
        </AppLayout>
    );
}
