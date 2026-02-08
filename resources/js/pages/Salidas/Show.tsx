import AppLayout from '@/layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';

interface PacienteRef { id_paciente: number; dni: string | null; nombres: string; apellidos: string; }
interface MedicamentoRef { id_medicamento: number; nombre_generico: string; codigo_interno: string; }
interface PresentacionRef { id_presentacion: number; tipo_presentacion: string; medicamento?: MedicamentoRef; }
interface UbicacionRef { id_ubicacion: number; codigo: string; }
interface LoteRef {
    id_lote: number;
    numero_lote: string;
    presentacion?: PresentacionRef;
    ubicacion?: UbicacionRef | null;
}
interface DetalleRef {
    id_detalle_salida: number;
    tipo_unidad: string;
    cantidad: number;
    lote?: LoteRef;
}
interface Salida {
    id_salida: number;
    numero_atencion: string;
    tipo_salida: string;
    fecha_salida: string;
    observaciones: string | null;
    paciente?: PacienteRef | null;
    paciente_nombre: string | null;
    detalle_salidas?: DetalleRef[];
}

export default function SalidasShow({ salida }: { salida: Salida }) {
    const pacienteLabel = salida.paciente
        ? `${salida.paciente.dni ?? ''} ${salida.paciente.nombres} ${salida.paciente.apellidos}`.trim()
        : salida.paciente_nombre ?? '—';

    return (
        <AppLayout title={`Salida ${salida.numero_atencion}`}>
            <Head title={`Salida ${salida.numero_atencion}`} />
            <div className="space-y-6">
                <div className="flex justify-between">
                    <Link href="/salidas" className="text-sky-600 hover:underline">← Volver a salidas</Link>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold text-slate-800">Datos de la salida</h2>
                    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div><dt className="text-sm text-slate-500">Nº Atención</dt><dd className="font-medium">{salida.numero_atencion}</dd></div>
                        <div><dt className="text-sm text-slate-500">Fecha y hora</dt><dd className="font-medium">{salida.fecha_salida}</dd></div>
                        <div><dt className="text-sm text-slate-500">Tipo</dt><dd className="font-medium">{salida.tipo_salida}</dd></div>
                        <div><dt className="text-sm text-slate-500">Paciente</dt><dd className="font-medium">{pacienteLabel}</dd></div>
                        {salida.observaciones && (
                            <div className="sm:col-span-2"><dt className="text-sm text-slate-500">Observaciones</dt><dd className="font-medium">{salida.observaciones}</dd></div>
                        )}
                    </dl>
                </div>
                {salida.detalle_salidas && salida.detalle_salidas.length > 0 && (
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-slate-800">Detalle</h2>
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Medicamento</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Presentación / Lote</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Tipo unidad</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-slate-500">Cantidad</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {salida.detalle_salidas.map((d) => (
                                    <tr key={d.id_detalle_salida}>
                                        <td className="px-4 py-2 text-sm">{d.lote?.presentacion?.medicamento?.nombre_generico ?? '—'}</td>
                                        <td className="px-4 py-2 text-sm">{d.lote?.presentacion?.tipo_presentacion ?? '—'} / {d.lote?.numero_lote ?? '—'}</td>
                                        <td className="px-4 py-2 text-sm">{d.tipo_unidad}</td>
                                        <td className="px-4 py-2 text-right text-sm font-medium">{d.cantidad}</td>
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
