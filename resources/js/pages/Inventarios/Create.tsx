import AppLayout from '@/layouts/AppLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface MedicamentoRef { id_medicamento: number; nombre_generico: string; codigo_interno?: string; }
interface PresentacionRef { id_presentacion: number; tipo_presentacion: string; medicamento?: MedicamentoRef; }
interface UbicacionRef { id_ubicacion: number; codigo: string; }
interface LoteRef {
    id_lote: number;
    numero_lote: string;
    cantidad_actual: number;
    fecha_vencimiento: string;
    presentacion?: PresentacionRef;
    ubicacion?: UbicacionRef | null;
}

const TIPOS = ['Total', 'Parcial', 'Cíclico'];

interface ItemRow {
    id_lote: number;
    cantidad_fisica: string;
    observaciones: string;
}

function loteLabel(l: LoteRef): string {
    const med = l.presentacion?.medicamento?.nombre_generico ?? '?';
    const pres = l.presentacion?.tipo_presentacion ?? '';
    const ubi = l.ubicacion?.codigo ?? '';
    return `${med} ${pres} - Lote ${l.numero_lote} (Sist: ${l.cantidad_actual}) ${ubi}`.trim();
}

export default function InventariosCreate({ lotes }: { lotes: LoteRef[] }) {
    const [header, setHeader] = useState({
        fecha_inventario: new Date().toISOString().slice(0, 10),
        tipo: 'Parcial' as string,
        observaciones: '',
        usuario_responsable: '',
    });
    const [selected, setSelected] = useState<Record<number, ItemRow>>({});
    const [processing, setProcessing] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);
    const page = usePage();
    const errors = (page.props.errors as Record<string, string> | undefined) || {};

    const toggleLote = (lote: LoteRef) => {
        setSelected((prev) => {
            const next = { ...prev };
            if (next[lote.id_lote]) {
                delete next[lote.id_lote];
                return next;
            }
            next[lote.id_lote] = {
                id_lote: lote.id_lote,
                cantidad_fisica: String(lote.cantidad_actual),
                observaciones: '',
            };
            return next;
        });
    };

    const updateItem = (idLote: number, field: keyof ItemRow, value: string) => {
        setSelected((prev) => {
            const item = prev[idLote];
            if (!item) return prev;
            return { ...prev, [idLote]: { ...item, [field]: value } };
        });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);
        const items = Object.values(selected);
        if (items.length === 0) {
            setLocalError('Seleccione al menos un lote para el inventario.');
            return;
        }
        const payload = items.map((i) => ({
            id_lote: i.id_lote,
            cantidad_fisica: i.cantidad_fisica === '' ? null : parseInt(i.cantidad_fisica, 10),
            observaciones: i.observaciones || null,
        }));
        setProcessing(true);
        router.post('/inventarios', {
            fecha_inventario: header.fecha_inventario,
            tipo: header.tipo,
            observaciones: header.observaciones || null,
            usuario_responsable: header.usuario_responsable || null,
            items: payload,
        }, { onFinish: () => setProcessing(false) });
    };

    return (
        <AppLayout title="Nuevo inventario físico">
            <Head title="Nuevo inventario" />
            <div className="space-y-6">
                <Link href="/inventarios" className="text-sky-600 hover:underline">← Volver a inventarios</Link>
                {localError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                        {localError}
                    </div>
                )}
                <form onSubmit={submit} className="space-y-6">
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-slate-800">Cabecera</h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Fecha inventario</label>
                                <input
                                    type="date"
                                    value={header.fecha_inventario}
                                    onChange={(e) => setHeader((h) => ({ ...h, fecha_inventario: e.target.value }))}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                />
                                {errors.fecha_inventario && <p className="mt-1 text-sm text-red-600">{errors.fecha_inventario}</p>}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Tipo</label>
                                <select
                                    value={header.tipo}
                                    onChange={(e) => setHeader((h) => ({ ...h, tipo: e.target.value }))}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                >
                                    {TIPOS.map((t) => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">Responsable</label>
                                <input
                                    type="text"
                                    value={header.usuario_responsable}
                                    onChange={(e) => setHeader((h) => ({ ...h, usuario_responsable: e.target.value }))}
                                    placeholder="Nombre del responsable"
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-slate-700">Observaciones</label>
                                <textarea
                                    value={header.observaciones}
                                    onChange={(e) => setHeader((h) => ({ ...h, observaciones: e.target.value }))}
                                    rows={2}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-slate-800">Lotes a inventariar</h2>
                        <p className="mb-4 text-sm text-slate-600">Seleccione los lotes e ingrese la cantidad física contada (opcional).</p>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Incluir</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Medicamento / Lote</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-slate-500">Sistema</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Cant. física</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Obs.</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {lotes.map((lote) => (
                                        <tr key={lote.id_lote} className="hover:bg-slate-50">
                                            <td className="px-4 py-2">
                                                <input
                                                    type="checkbox"
                                                    checked={!!selected[lote.id_lote]}
                                                    onChange={() => toggleLote(lote)}
                                                    className="h-4 w-4 rounded border-slate-300"
                                                />
                                            </td>
                                            <td className="px-4 py-2 text-sm">{loteLabel(lote)}</td>
                                            <td className="px-4 py-2 text-right text-sm font-medium">{lote.cantidad_actual}</td>
                                            <td className="px-4 py-2">
                                                {selected[lote.id_lote] && (
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        value={selected[lote.id_lote].cantidad_fisica}
                                                        onChange={(e) => updateItem(lote.id_lote, 'cantidad_fisica', e.target.value)}
                                                        className="w-24 rounded border border-slate-300 px-2 py-1 text-sm"
                                                    />
                                                )}
                                            </td>
                                            <td className="px-4 py-2">
                                                {selected[lote.id_lote] && (
                                                    <input
                                                        type="text"
                                                        value={selected[lote.id_lote].observaciones}
                                                        onChange={(e) => updateItem(lote.id_lote, 'observaciones', e.target.value)}
                                                        placeholder="Obs."
                                                        className="w-32 rounded border border-slate-300 px-2 py-1 text-sm"
                                                    />
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {lotes.length === 0 && (
                            <p className="py-4 text-center text-slate-500">No hay lotes con stock para inventariar.</p>
                        )}
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing || Object.keys(selected).length === 0}
                            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50"
                        >
                            {processing ? 'Guardando...' : 'Registrar inventario'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
