import AppLayout from '@/layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface MedicamentoRef { id_medicamento: number; nombre_generico: string; codigo_interno: string; }
interface PresentacionRef { id_presentacion: number; tipo_presentacion: string; medicamento?: MedicamentoRef; }
interface UbicacionRef { id_ubicacion: number; codigo: string; }
interface Lote {
    id_lote: number;
    numero_lote: string;
    fecha_vencimiento: string;
    cantidad_inicial: number;
    cantidad_actual: number;
    activo: boolean;
    presentacion?: PresentacionRef;
    ubicacion?: UbicacionRef | null;
}
interface Paginated { data: Lote[]; links: { url: string | null; label: string; active: boolean }[]; }

export default function LotesIndex({ lotes, filters }: { lotes: Paginated; filters: { buscar?: string; vencidos?: string; por_vencer?: string } }) {
    const { get, setData, data } = useForm({
        buscar: filters.buscar || '',
        vencidos: filters.vencidos || '',
        por_vencer: filters.por_vencer || '',
    });

    const submitSearch = (e: FormEvent) => {
        e.preventDefault();
        get('/lotes', {
            buscar: data.buscar || undefined,
            vencidos: data.vencidos || undefined,
            por_vencer: data.por_vencer || undefined,
        }, { preserveState: true });
    };

    const isVencido = (fecha: string) => new Date(fecha) < new Date();

    return (
        <AppLayout title="Lotes">
            <Head title="Lotes" />
            <div className="space-y-4">
                <form onSubmit={submitSearch} className="flex flex-wrap items-center gap-2">
                    <input type="search" placeholder="Lote o medicamento..." value={data.buscar} onChange={(e) => setData('buscar', e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                    <label className="flex items-center gap-1">
                        <input type="checkbox" checked={data.vencidos === '1'} onChange={(e) => setData('vencidos', e.target.checked ? '1' : '')} className="h-4 w-4 rounded border-slate-300" />
                        <span className="text-sm">Vencidos</span>
                    </label>
                    <label className="flex items-center gap-1">
                        <input type="checkbox" checked={data.por_vencer === '1'} onChange={(e) => setData('por_vencer', e.target.checked ? '1' : '')} className="h-4 w-4 rounded border-slate-300" />
                        <span className="text-sm">Por vencer (90 d)</span>
                    </label>
                    <button type="submit" className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">Buscar</button>
                </form>
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Medicamento</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Presentación</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Nº Lote</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Vencimiento</th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-slate-500">Stock</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Ubicación</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {lotes.data.length === 0 ? (
                                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">No hay lotes.</td></tr>
                            ) : (
                                lotes.data.map((l) => (
                                    <tr key={l.id_lote} className={isVencido(l.fecha_vencimiento) ? 'bg-red-50' : 'hover:bg-slate-50'}>
                                        <td className="px-4 py-3 text-sm font-medium text-slate-900">{l.presentacion?.medicamento?.nombre_generico ?? '—'}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{l.presentacion?.tipo_presentacion ?? '—'}</td>
                                        <td className="px-4 py-3 text-sm text-slate-900">{l.numero_lote}</td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={isVencido(l.fecha_vencimiento) ? 'font-medium text-red-700' : 'text-slate-600'}>{l.fecha_vencimiento}</span>
                                            {isVencido(l.fecha_vencimiento) && <span className="ml-1 rounded bg-red-200 px-1.5 py-0.5 text-xs text-red-800">Vencido</span>}
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm font-medium">{l.cantidad_actual}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{l.ubicacion?.codigo ?? '—'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    {lotes.links && lotes.links.length > 3 && (
                        <div className="flex flex-wrap justify-center gap-1 border-t border-slate-200 bg-slate-50 px-4 py-2">
                            {lotes.links.map((link, i) => (
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
