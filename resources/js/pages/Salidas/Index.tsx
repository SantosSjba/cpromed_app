import AppLayout from '@/layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface PacienteRef { id_paciente: number; dni: string | null; nombres: string; apellidos: string; }
interface Salida {
    id_salida: number;
    numero_atencion: string;
    tipo_salida: string;
    fecha_salida: string;
    paciente_nombre: string | null;
    paciente?: PacienteRef | null;
}
interface Paginated { data: Salida[]; links: { url: string | null; label: string; active: boolean }[]; }

const TIPOS_SALIDA = ['Dispensación', 'Transferencia', 'Baja', 'Merma', 'Vencido', 'Otro'];

export default function SalidasIndex({ salidas, filters }: { salidas: Paginated; filters: { buscar?: string; tipo_salida?: string; desde?: string; hasta?: string } }) {
    const { get, setData, data } = useForm({
        buscar: filters.buscar || '',
        tipo_salida: filters.tipo_salida || '',
        desde: filters.desde || '',
        hasta: filters.hasta || '',
    });

    const submitSearch = (e: FormEvent) => {
        e.preventDefault();
        get('/salidas', {
            buscar: data.buscar || undefined,
            tipo_salida: data.tipo_salida || undefined,
            desde: data.desde || undefined,
            hasta: data.hasta || undefined,
        }, { preserveState: true });
    };

    const pacienteLabel = (s: Salida) => {
        if (s.paciente) return `${s.paciente.dni ?? ''} ${s.paciente.nombres} ${s.paciente.apellidos}`.trim();
        return s.paciente_nombre ?? '—';
    };

    return (
        <AppLayout title="Salidas (dispensaciones)">
            <Head title="Salidas" />
            <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <form onSubmit={submitSearch} className="flex flex-wrap items-center gap-2">
                        <input type="search" placeholder="Nº atención o paciente..." value={data.buscar} onChange={(e) => setData('buscar', e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        <select value={data.tipo_salida} onChange={(e) => setData('tipo_salida', e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
                            <option value="">Todos los tipos</option>
                            {TIPOS_SALIDA.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                        <input type="date" value={data.desde} onChange={(e) => setData('desde', e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        <input type="date" value={data.hasta} onChange={(e) => setData('hasta', e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        <button type="submit" className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">Buscar</button>
                    </form>
                    <Link href="/salidas/create" className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700">Nueva salida</Link>
                </div>
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Nº Atención</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Fecha</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Tipo</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Paciente</th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-slate-500">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {salidas.data.length === 0 ? (
                                <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">No hay salidas.</td></tr>
                            ) : (
                                salidas.data.map((s) => (
                                    <tr key={s.id_salida} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-sm font-medium text-slate-900">{s.numero_atencion}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{s.fecha_salida}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{s.tipo_salida}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{pacienteLabel(s)}</td>
                                        <td className="px-4 py-3 text-right">
                                            <Link href={`/salidas/${s.id_salida}`} className="text-sky-600 hover:underline">Ver detalle</Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    {salidas.links && salidas.links.length > 3 && (
                        <div className="flex flex-wrap justify-center gap-1 border-t border-slate-200 bg-slate-50 px-4 py-2">
                            {salidas.links.map((link, i) => (
                                <span key={i}>
                                    {link.url ? <Link href={link.url} className={link.active ? 'rounded px-2 py-1 text-sm font-medium text-sky-700' : 'rounded px-2 py-1 text-sm text-slate-600 hover:bg-slate-200'}>{link.label.replace('&laquo;', '«').replace('&raquo;', '»')}</Link> : <span className="px-2 py-1 text-sm text-slate-400">{link.label.replace('&laquo;', '«').replace('&raquo;', '»')}</span>}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
