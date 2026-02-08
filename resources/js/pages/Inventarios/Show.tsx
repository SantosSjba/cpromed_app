import AppLayout from '@/layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';

interface MedicamentoRef { id_medicamento: number; nombre_generico: string; codigo_interno?: string; }
interface PresentacionRef { id_presentacion: number; tipo_presentacion: string; medicamento?: MedicamentoRef; }
interface UbicacionRef { id_ubicacion: number; codigo: string; }
interface LoteRef {
    id_lote: number;
    numero_lote: string;
    presentacion?: PresentacionRef;
    ubicacion?: UbicacionRef | null;
}
interface DetalleRef {
    id_detalle_inventario: number;
    cantidad_sistema: number;
    cantidad_fisica: number | null;
    diferencia: number | null;
    observaciones: string | null;
    lote?: LoteRef;
}
interface InventarioRef {
    id_inventario: number;
    fecha_inventario: string;
    tipo: string;
    estado: string;
    usuario_responsable: string | null;
    observaciones: string | null;
    detalle_inventarios?: DetalleRef[];
}

export default function InventariosShow({ inventario }: { inventario: InventarioRef }) {
    return (
        <AppLayout title={`Inventario #${inventario.id_inventario}`}>
            <Head title={`Inventario #${inventario.id_inventario}`} />
            <div className="space-y-6">
                <Link href="/inventarios" className="text-sky-600 hover:underline">← Volver a inventarios</Link>
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold text-slate-800">Datos del inventario</h2>
                    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                            <dt className="text-sm text-slate-500">ID</dt>
                            <dd className="font-medium">{inventario.id_inventario}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-slate-500">Fecha</dt>
                            <dd className="font-medium">{inventario.fecha_inventario}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-slate-500">Tipo</dt>
                            <dd className="font-medium">{inventario.tipo}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-slate-500">Estado</dt>
                            <dd className="font-medium">{inventario.estado}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-slate-500">Responsable</dt>
                            <dd className="font-medium">{inventario.usuario_responsable ?? '—'}</dd>
                        </div>
                        {inventario.observaciones && (
                            <div className="sm:col-span-2">
                                <dt className="text-sm text-slate-500">Observaciones</dt>
                                <dd className="font-medium">{inventario.observaciones}</dd>
                            </div>
                        )}
                    </dl>
                </div>
                {inventario.detalle_inventarios && inventario.detalle_inventarios.length > 0 && (
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-slate-800">Detalle</h2>
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Medicamento</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Lote / Ubicación</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-slate-500">Sistema</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-slate-500">Física</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-slate-500">Diferencia</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Obs.</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {inventario.detalle_inventarios.map((d) => (
                                    <tr key={d.id_detalle_inventario}>
                                        <td className="px-4 py-2 text-sm">
                                            {d.lote?.presentacion?.medicamento?.nombre_generico ?? '—'}
                                        </td>
                                        <td className="px-4 py-2 text-sm">
                                            {d.lote?.numero_lote ?? '—'} / {d.lote?.ubicacion?.codigo ?? '—'}
                                        </td>
                                        <td className="px-4 py-2 text-right text-sm font-medium">{d.cantidad_sistema}</td>
                                        <td className="px-4 py-2 text-right text-sm">{d.cantidad_fisica ?? '—'}</td>
                                        <td className="px-4 py-2 text-right text-sm">
                                            {d.diferencia !== null ? (
                                                <span className={d.diferencia !== 0 ? 'font-medium text-amber-600' : ''}>
                                                    {d.diferencia > 0 ? '+' : ''}{d.diferencia}
                                                </span>
                                            ) : (
                                                '—'
                                            )}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-slate-600">{d.observaciones ?? '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
