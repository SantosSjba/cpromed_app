import AppLayout from '@/layouts/AppLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface MedicamentoRef { id_medicamento: number; nombre_generico: string; codigo_interno: string; }
interface UbicacionRef { id_ubicacion: number; codigo: string; }
interface Presentacion {
    id_presentacion: number;
    tipo_presentacion: string;
    unidades_por_presentacion: number;
    precio_compra: string | null;
    precio_venta: string | null;
    stock_minimo: number;
    stock_maximo: number;
    activo: boolean;
    medicamento?: MedicamentoRef | null;
    ubicacion?: UbicacionRef | null;
}
interface Paginated { data: Presentacion[]; links: { url: string | null; label: string; active: boolean }[]; }

export default function PresentacionesIndex({
    presentaciones,
    medicamentos,
    filters,
}: {
    presentaciones: Paginated;
    medicamentos: MedicamentoRef[];
    filters: { buscar?: string; id_medicamento?: string };
}) {
    const { get, setData, data } = useForm({
        buscar: filters.buscar || '',
        id_medicamento: filters.id_medicamento || '',
    });

    const submitSearch = (e: FormEvent) => {
        e.preventDefault();
        get('/presentaciones', { buscar: data.buscar || undefined, id_medicamento: data.id_medicamento || undefined }, { preserveState: true });
    };

    return (
        <AppLayout title="Presentaciones">
            <Head title="Presentaciones" />
            <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <form onSubmit={submitSearch} className="flex flex-wrap items-center gap-2">
                        <input type="search" placeholder="Buscar medicamento..." value={data.buscar} onChange={(e) => setData('buscar', e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        <select value={data.id_medicamento} onChange={(e) => setData('id_medicamento', e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
                            <option value="">Todos los medicamentos</option>
                            {medicamentos.map((m) => (
                                <option key={m.id_medicamento} value={String(m.id_medicamento)}>{m.nombre_generico} ({m.codigo_interno})</option>
                            ))}
                        </select>
                        <button type="submit" className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">Buscar</button>
                    </form>
                    <Link href="/presentaciones/create" className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700">Nueva presentación</Link>
                </div>
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Medicamento</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Tipo</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Unidades</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">P. compra</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">P. venta</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Ubicación</th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-slate-500">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {presentaciones.data.length === 0 ? (
                                <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">No hay presentaciones.</td></tr>
                            ) : (
                                presentaciones.data.map((p) => (
                                    <tr key={p.id_presentacion} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-sm font-medium text-slate-900">{p.medicamento?.nombre_generico ?? '—'}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{p.tipo_presentacion}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{p.unidades_por_presentacion}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{p.precio_compra ?? '—'}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{p.precio_venta ?? '—'}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{p.ubicacion?.codigo ?? '—'}</td>
                                        <td className="px-4 py-3 text-right">
                                            <Link href={`/presentaciones/${p.id_presentacion}/edit`} className="text-sky-600 hover:underline mr-2">Editar</Link>
                                            <button type="button" onClick={() => confirm('¿Eliminar esta presentación?') && router.delete(`/presentaciones/${p.id_presentacion}`)} className="text-red-600 hover:underline">Eliminar</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    {presentaciones.links && presentaciones.links.length > 3 && (
                        <div className="flex flex-wrap justify-center gap-1 border-t border-slate-200 bg-slate-50 px-4 py-2">
                            {presentaciones.links.map((link, i) => (
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
