import AppLayout from '@/layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface InventarioRef {
    id_inventario: number;
    fecha_inventario: string;
    tipo: string;
    estado: string;
    usuario_responsable: string | null;
    observaciones: string | null;
}
interface Paginated {
    data: InventarioRef[];
    links: { url: string | null; label: string; active: boolean }[];
}

const ESTADOS = ['En Proceso', 'Completado', 'Cancelado'];

export default function InventariosIndex({
    inventarios,
    filters,
}: {
    inventarios: Paginated;
    filters: { buscar?: string; estado?: string; desde?: string; hasta?: string };
}) {
    const { get, setData, data } = useForm({
        buscar: filters.buscar || '',
        estado: filters.estado || '',
        desde: filters.desde || '',
        hasta: filters.hasta || '',
    });

    const submitSearch = (e: FormEvent) => {
        e.preventDefault();
        get('/inventarios', {
            buscar: data.buscar || undefined,
            estado: data.estado || undefined,
            desde: data.desde || undefined,
            hasta: data.hasta || undefined,
        }, { preserveState: true });
    };

    return (
        <AppLayout title="Inventarios físicos">
            <Head title="Inventarios" />
            <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <form onSubmit={submitSearch} className="flex flex-wrap items-center gap-2">
                        <input
                            type="search"
                            placeholder="Observaciones o responsable..."
                            value={data.buscar}
                            onChange={(e) => setData('buscar', e.target.value)}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        />
                        <select
                            value={data.estado}
                            onChange={(e) => setData('estado', e.target.value)}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        >
                            <option value="">Todos los estados</option>
                            {ESTADOS.map((est) => (
                                <option key={est} value={est}>{est}</option>
                            ))}
                        </select>
                        <input type="date" value={data.desde} onChange={(e) => setData('desde', e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        <input type="date" value={data.hasta} onChange={(e) => setData('hasta', e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        <button type="submit" className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">Buscar</button>
                    </form>
                    <Link href="/inventarios/create" className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700">Nuevo inventario</Link>
                </div>
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Fecha</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Tipo</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Estado</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Responsable</th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-slate-500">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {inventarios.data.length === 0 ? (
                                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">No hay inventarios.</td></tr>
                            ) : (
                                inventarios.data.map((inv) => (
                                    <tr key={inv.id_inventario} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-sm font-medium text-slate-900">{inv.id_inventario}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{inv.fecha_inventario}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{inv.tipo}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{inv.estado}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{inv.usuario_responsable ?? '—'}</td>
                                        <td className="px-4 py-3 text-right">
                                            <Link href={`/inventarios/${inv.id_inventario}`} className="text-sky-600 hover:underline">Ver detalle</Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    {inventarios.links && inventarios.links.length > 3 && (
                        <div className="flex flex-wrap justify-center gap-1 border-t border-slate-200 bg-slate-50 px-4 py-2">
                            {inventarios.links.map((link, i) => (
                                <span key={i}>
                                    {link.url ? (
                                        <Link href={link.url} className={link.active ? 'rounded px-2 py-1 text-sm font-medium text-sky-700' : 'rounded px-2 py-1 text-sm text-slate-600 hover:bg-slate-200'}>
                                            {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                                        </Link>
                                    ) : (
                                        <span className="px-2 py-1 text-sm text-slate-400">{link.label.replace('&laquo;', '«').replace('&raquo;', '»')}</span>
                                    )}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
