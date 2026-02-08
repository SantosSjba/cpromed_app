import AppLayout from '@/layouts/AppLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface PacienteRef { id_paciente: number; dni: string | null; nombres: string; apellidos: string; }
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

const TIPOS_SALIDA = ['Dispensación', 'Transferencia', 'Baja', 'Merma', 'Vencido', 'Otro'];
const TIPOS_UNIDAD = ['Caja', 'Blister', 'Tableta', 'Frasco', 'Ampolla', 'Unidad', 'Otro'];

interface ItemRow {
    id_lote: number;
    tipo_unidad: string;
    cantidad: number;
}

function loteLabel(l: LoteRef): string {
    const med = l.presentacion?.medicamento?.nombre_generico ?? '?';
    return `${med} - Lote ${l.numero_lote} (Vence ${l.fecha_vencimiento}, Stock: ${l.cantidad_actual})`;
}

export default function SalidasCreate({ pacientes, lotes }: { pacientes: PacienteRef[]; lotes: LoteRef[] }) {
    const [header, setHeader] = useState({
        id_paciente: '' as string | number,
        paciente_nombre: '',
        tipo_salida: 'Dispensación',
        fecha_salida: new Date().toISOString().slice(0, 16),
        observaciones: '',
    });
    const [items, setItems] = useState<ItemRow[]>([{ id_lote: 0, tipo_unidad: 'Tableta', cantidad: 1 }]);
    const [processing, setProcessing] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);
    const page = usePage();
    const errors = (page.props.errors as Record<string, string> | undefined) || {};

    const addLine = () => setItems((prev) => [...prev, { id_lote: 0, tipo_unidad: 'Tableta', cantidad: 1 }]);
    const removeLine = (index: number) => setItems((prev) => prev.filter((_, i) => i !== index));
    const updateLine = (index: number, field: keyof ItemRow, value: string | number) => {
        setItems((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
        });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);
        const validItems = items.filter((i) => i.id_lote && i.cantidad >= 1);
        if (validItems.length === 0) {
            setLocalError('Agregue al menos un ítem con lote y cantidad.');
            return;
        }
        const payload = validItems.map((i) => ({
            id_lote: Number(i.id_lote),
            tipo_unidad: i.tipo_unidad,
            cantidad: Number(i.cantidad),
        }));
        setProcessing(true);
        router.post('/salidas', {
            id_paciente: header.id_paciente ? Number(header.id_paciente) : null,
            paciente_nombre: header.paciente_nombre || null,
            tipo_salida: header.tipo_salida,
            fecha_salida: header.fecha_salida,
            observaciones: header.observaciones || null,
            items: payload,
        }, { onFinish: () => setProcessing(false) });
    };

    return (
        <AppLayout title="Nueva salida">
            <Head title="Nueva salida" />
            <div className="space-y-6">
                <form onSubmit={submit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-800">Datos de la salida</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Paciente (opcional)</label>
                            <select value={header.id_paciente} onChange={(e) => setHeader((h) => ({ ...h, id_paciente: e.target.value, paciente_nombre: e.target.value ? '' : h.paciente_nombre }))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                                <option value="">— Sin registrar —</option>
                                {pacientes.map((p) => (
                                    <option key={p.id_paciente} value={p.id_paciente}>{p.apellidos} {p.nombres} {p.dni ? `(${p.dni})` : ''}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Nombre libre (si no eligió paciente)</label>
                            <input type="text" value={header.paciente_nombre} onChange={(e) => setHeader((h) => ({ ...h, paciente_nombre: e.target.value }))} placeholder="Ej: Juan Pérez" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Tipo salida *</label>
                            <select value={header.tipo_salida} onChange={(e) => setHeader((h) => ({ ...h, tipo_salida: e.target.value }))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                                {TIPOS_SALIDA.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Fecha y hora *</label>
                            <input type="datetime-local" value={header.fecha_salida} onChange={(e) => setHeader((h) => ({ ...h, fecha_salida: e.target.value }))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="mb-1 block text-sm font-medium text-slate-700">Observaciones</label>
                            <input type="text" value={header.observaciones} onChange={(e) => setHeader((h) => ({ ...h, observaciones: e.target.value }))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        </div>
                    </div>
                    {localError && <p className="text-sm text-red-600">{localError}</p>}

                    <div className="border-t border-slate-200 pt-4">
                        <div className="mb-2 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-800">Detalle (medicamentos)</h2>
                            <button type="button" onClick={addLine} className="rounded-lg bg-slate-600 px-3 py-1.5 text-sm text-white hover:bg-slate-700">+ Agregar línea</button>
                        </div>
                        <div className="space-y-3">
                            {items.map((item, idx) => (
                                <div key={idx} className="flex flex-wrap items-end gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                                    <div className="min-w-[280px] flex-1">
                                        <label className="mb-1 block text-xs font-medium text-slate-600">Lote (FEFO) *</label>
                                        <select
                                            value={item.id_lote || ''}
                                            onChange={(e) => updateLine(idx, 'id_lote', Number(e.target.value))}
                                            className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                                            required
                                        >
                                            <option value="">Seleccione lote...</option>
                                            {lotes.map((l) => (
                                                <option key={l.id_lote} value={l.id_lote} disabled={l.cantidad_actual <= 0}>
                                                    {loteLabel(l)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-32">
                                        <label className="mb-1 block text-xs font-medium text-slate-600">Tipo unidad *</label>
                                        <select value={item.tipo_unidad} onChange={(e) => updateLine(idx, 'tipo_unidad', e.target.value)} className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm">
                                            {TIPOS_UNIDAD.map((t) => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-24">
                                        <label className="mb-1 block text-xs font-medium text-slate-600">Cantidad *</label>
                                        <input type="number" min={1} value={item.cantidad} onChange={(e) => updateLine(idx, 'cantidad', Number(e.target.value))} className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm" />
                                    </div>
                                    <button type="button" onClick={() => removeLine(idx)} className="rounded bg-red-100 px-2 py-1.5 text-sm text-red-700 hover:bg-red-200">✕</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                        <button type="submit" disabled={processing} className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50">Registrar salida</button>
                        <Link href="/salidas" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancelar</Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
