import AppLayout from '@/layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';

interface ProveedorRef { id_proveedor: number; razon_social: string; ruc: string; }
interface MedicamentoRef { id_medicamento: number; nombre_generico: string; codigo_interno: string; }
interface PresentacionRef { id_presentacion: number; tipo_presentacion: string; medicamento?: MedicamentoRef; }
interface UbicacionRef { id_ubicacion: number; codigo: string; }
interface LoteRef {
    id_lote: number;
    numero_lote: string;
    fecha_vencimiento: string;
    cantidad_actual: number;
    presentacion?: PresentacionRef;
    ubicacion?: UbicacionRef | null;
}
interface DetalleRef {
    id_detalle_entrada: number;
    cantidad: number;
    precio_unitario: string | null;
    subtotal: string | null;
    lote?: LoteRef;
}
interface Entrada {
    id_entrada: number;
    numero_documento: string;
    tipo_documento: string;
    fecha_entrada: string;
    fecha_documento: string | null;
    total: string | null;
    observaciones: string | null;
    proveedor?: ProveedorRef | null;
    detalle_entradas?: DetalleRef[];
}

export default function EntradasShow({ entrada }: { entrada: Entrada }) {
    return (
        <AppLayout title={`Entrada ${entrada.numero_documento}`}>
            <Head title={`Entrada ${entrada.numero_documento}`} />
            <div className="space-y-6">
                <div className="flex justify-between">
                    <Link href="/entradas" className="text-sky-600 hover:underline">← Volver a entradas</Link>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold text-slate-800">Datos del documento</h2>
                    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div><dt className="text-sm text-slate-500">Nº Documento</dt><dd className="font-medium">{entrada.numero_documento}</dd></div>
                        <div><dt className="text-sm text-slate-500">Tipo</dt><dd className="font-medium">{entrada.tipo_documento}</dd></div>
                        <div><dt className="text-sm text-slate-500">Fecha entrada</dt><dd className="font-medium">{entrada.fecha_entrada}</dd></div>
                        <div><dt className="text-sm text-slate-500">Fecha documento</dt><dd className="font-medium">{entrada.fecha_documento ?? '—'}</dd></div>
                        <div><dt className="text-sm text-slate-500">Proveedor</dt><dd className="font-medium">{entrada.proveedor?.razon_social ?? '—'}</dd></div>
                        <div><dt className="text-sm text-slate-500">Total</dt><dd className="font-medium">{entrada.total ?? '—'}</dd></div>
                        {entrada.observaciones && (
                            <div className="sm:col-span-2"><dt className="text-sm text-slate-500">Observaciones</dt><dd className="font-medium">{entrada.observaciones}</dd></div>
                        )}
                    </dl>
                </div>
                {entrada.detalle_entradas && entrada.detalle_entradas.length > 0 && (
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-slate-800">Detalle</h2>
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Medicamento</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Presentación</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Lote</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Vencimiento</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-slate-500">Cantidad</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-slate-500">P. unit.</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-slate-500">Subtotal</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Ubicación</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {entrada.detalle_entradas.map((d) => (
                                    <tr key={d.id_detalle_entrada}>
                                        <td className="px-4 py-2 text-sm">{d.lote?.presentacion?.medicamento?.nombre_generico ?? '—'}</td>
                                        <td className="px-4 py-2 text-sm">{d.lote?.presentacion?.tipo_presentacion ?? '—'}</td>
                                        <td className="px-4 py-2 text-sm">{d.lote?.numero_lote ?? '—'}</td>
                                        <td className="px-4 py-2 text-sm">{d.lote?.fecha_vencimiento ?? '—'}</td>
                                        <td className="px-4 py-2 text-right text-sm">{d.cantidad}</td>
                                        <td className="px-4 py-2 text-right text-sm">{d.precio_unitario ?? '—'}</td>
                                        <td className="px-4 py-2 text-right text-sm">{d.subtotal ?? '—'}</td>
                                        <td className="px-4 py-2 text-sm">{d.lote?.ubicacion?.codigo ?? '—'}</td>
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
