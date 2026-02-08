import AppLayout from '@/layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface ProveedorRef { id_proveedor: number; razon_social: string; ruc: string; }
interface Entrada {
    id_entrada: number;
    numero_documento: string;
    tipo_documento: string;
    fecha_entrada: string;
    total: string | null;
    proveedor?: ProveedorRef | null;
}
interface Paginated { data: Entrada[]; links: { url: string | null; label: string; active: boolean }[]; }

export default function EntradasIndex({ entradas, filters }: { entradas: Paginated; filters: { buscar?: string; desde?: string; hasta?: string } }) {
    const { get, setData, data } = useForm({
        buscar: filters.buscar || '',
        desde: filters.desde || '',
        hasta: filters.hasta || '',
    });

    const submitSearch = (e: FormEvent) => {
        e.preventDefault();
        get('/entradas', {
            buscar: data.buscar || undefined,
            desde: data.desde || undefined,
            hasta: data.hasta || undefined,
        }, { preserveState: true });
    };

    return (
        <AppLayout title="Entradas (compras)">
            <Head title="Entradas" />
            <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <form onSubmit={submitSearch} className="flex flex-wrap items-center gap-2">
                        <input type="search" placeholder="Documento o proveedor..." value={data.buscar} onChange={(e) => setData('buscar', e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        <input type="date" value={data.desde} onChange={(e) => setData('desde', e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        <input type="date" value={data.hasta} onChange={(e) => setData('hasta', e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        <button type="submit" className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">Buscar</button>
                    </form>
                    <Link href="/entradas/create" className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700">Nueva entrada</Link>
                </div>
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Nº Documento</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Tipo</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Fecha</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Proveedor</th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-slate-500">Total</th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-slate-500">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {entradas.data.length === 0 ? (
                                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">No hay entradas.</td></tr>
                            ) : (
                                entradas.data.map((e) => (
                                    <tr key={e.id_entrada} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-sm font-medium text-slate-900">{e.numero_documento}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{e.tipo_documento}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{e.fecha_entrada}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{e.proveedor?.razon_social ?? '—'}</td>
                                        <td className="px-4 py-3 text-right text-sm font-medium text-slate-900">{e.total ?? '—'}</td>
                                        <td className="px-4 py-3 text-right">
                                            <Link href={`/entradas/${e.id_entrada}`} className="text-sky-600 hover:underline">Ver detalle</Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    {entradas.links && entradas.links.length > 3 && (
                        <div className="flex flex-wrap justify-center gap-1 border-t border-slate-200 bg-slate-50 px-4 py-2">
                            {entradas.links.map((link, i) => (
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
