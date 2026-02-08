import AppLayout from '@/layouts/AppLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface ProveedorRef { id_proveedor: number; razon_social: string; ruc: string; }
interface PresentacionRef {
    id_presentacion: number;
    id_medicamento: number;
    tipo_presentacion: string;
    unidades_por_presentacion: number;
    medicamento?: { id_medicamento: number; nombre_generico: string; codigo_interno: string };
}
interface UbicacionRef { id_ubicacion: number; codigo: string; }

const TIPOS_DOC = ['Factura', 'Boleta', 'Guía de Remisión', 'Nota de Crédito', 'Otro'];

interface ItemRow {
    id_presentacion: number;
    numero_lote: string;
    fecha_fabricacion: string;
    fecha_vencimiento: string;
    cantidad: number;
    precio_unitario: number | string;
    id_ubicacion: number | string;
    registro_sanitario: string;
}

const emptyItem = (): ItemRow => ({
    id_presentacion: 0,
    numero_lote: '',
    fecha_fabricacion: '',
    fecha_vencimiento: '',
    cantidad: 1,
    precio_unitario: '',
    id_ubicacion: '',
    registro_sanitario: '',
});

export default function EntradasCreate({
    proveedores,
    presentaciones,
    ubicaciones,
}: {
    proveedores: ProveedorRef[];
    presentaciones: PresentacionRef[];
    ubicaciones: UbicacionRef[];
}) {
    const [items, setItems] = useState<ItemRow[]>([emptyItem()]);

    const [header, setHeader] = useState({
        numero_documento: '',
        tipo_documento: 'Factura',
        id_proveedor: '' as string | number,
        fecha_entrada: new Date().toISOString().slice(0, 10),
        fecha_documento: '',
        observaciones: '',
    });
    const [processing, setProcessing] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);
    const page = usePage();
    const errors = (page.props.errors as Record<string, string> | undefined) || {};

    const addLine = () => setItems((prev) => [...prev, emptyItem()]);
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
        const validItems = items.filter((i) => i.id_presentacion && i.numero_lote && i.fecha_vencimiento && i.cantidad >= 1);
        if (validItems.length === 0) {
            setLocalError('Agregue al menos un ítem con presentación, lote, fecha de vencimiento y cantidad.');
            return;
        }
        const payload = validItems.map((i) => ({
            id_presentacion: Number(i.id_presentacion),
            numero_lote: String(i.numero_lote),
            fecha_fabricacion: i.fecha_fabricacion || null,
            fecha_vencimiento: i.fecha_vencimiento,
            cantidad: Number(i.cantidad),
            precio_unitario: i.precio_unitario === '' ? null : Number(i.precio_unitario),
            id_ubicacion: i.id_ubicacion ? Number(i.id_ubicacion) : null,
            registro_sanitario: i.registro_sanitario || null,
        }));
        setProcessing(true);
        router.post('/entradas', {
            numero_documento: header.numero_documento,
            tipo_documento: header.tipo_documento,
            id_proveedor: header.id_proveedor ? Number(header.id_proveedor) : null,
            fecha_entrada: header.fecha_entrada,
            fecha_documento: header.fecha_documento || null,
            observaciones: header.observaciones || null,
            items: payload,
        }, {
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AppLayout title="Nueva entrada">
            <Head title="Nueva entrada" />
            <div className="space-y-6">
                <form onSubmit={submit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-800">Datos del documento</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Nº Documento *</label>
                            <input type="text" value={header.numero_documento} onChange={(e) => setHeader((h) => ({ ...h, numero_documento: e.target.value }))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
                            {errors.numero_documento && <p className="mt-1 text-sm text-red-600">{errors.numero_documento}</p>}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Tipo *</label>
                            <select value={header.tipo_documento} onChange={(e) => setHeader((h) => ({ ...h, tipo_documento: e.target.value }))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                                {TIPOS_DOC.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Proveedor</label>
                            <select value={header.id_proveedor} onChange={(e) => setHeader((h) => ({ ...h, id_proveedor: e.target.value }))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                                <option value="">—</option>
                                {proveedores.map((p) => (
                                    <option key={p.id_proveedor} value={p.id_proveedor}>{p.razon_social}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Fecha entrada *</label>
                            <input type="date" value={header.fecha_entrada} onChange={(e) => setHeader((h) => ({ ...h, fecha_entrada: e.target.value }))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" required />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Fecha documento</label>
                            <input type="date" value={header.fecha_documento} onChange={(e) => setHeader((h) => ({ ...h, fecha_documento: e.target.value }))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="mb-1 block text-sm font-medium text-slate-700">Observaciones</label>
                            <input type="text" value={header.observaciones} onChange={(e) => setHeader((h) => ({ ...h, observaciones: e.target.value }))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        </div>
                    </div>
                    {localError && <p className="text-sm text-red-600">{localError}</p>}

                    <div className="border-t border-slate-200 pt-4">
                        <div className="mb-2 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-800">Detalle (ítems)</h2>
                            <button type="button" onClick={addLine} className="rounded-lg bg-slate-600 px-3 py-1.5 text-sm text-white hover:bg-slate-700">+ Agregar línea</button>
                        </div>
                        <div className="space-y-3">
                            {items.map((item, idx) => (
                                <div key={idx} className="flex flex-wrap items-end gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                                    <div className="w-full min-w-[200px] max-w-xs">
                                        <label className="mb-1 block text-xs font-medium text-slate-600">Presentación *</label>
                                        <select
                                            value={item.id_presentacion || ''}
                                            onChange={(e) => updateLine(idx, 'id_presentacion', Number(e.target.value))}
                                            className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                                            required
                                        >
                                            <option value="">Seleccione...</option>
                                            {presentaciones.map((p) => (
                                                <option key={p.id_presentacion} value={p.id_presentacion}>
                                                    {p.medicamento?.nombre_generico ?? '?'} – {p.tipo_presentacion}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-24">
                                        <label className="mb-1 block text-xs font-medium text-slate-600">Nº Lote *</label>
                                        <input type="text" value={item.numero_lote} onChange={(e) => updateLine(idx, 'numero_lote', e.target.value)} className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm" placeholder="Lote" />
                                    </div>
                                    <div className="w-32">
                                        <label className="mb-1 block text-xs font-medium text-slate-600">F. venc. *</label>
                                        <input type="date" value={item.fecha_vencimiento} onChange={(e) => updateLine(idx, 'fecha_vencimiento', e.target.value)} className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm" required />
                                    </div>
                                    <div className="w-20">
                                        <label className="mb-1 block text-xs font-medium text-slate-600">Cant. *</label>
                                        <input type="number" min={1} value={item.cantidad} onChange={(e) => updateLine(idx, 'cantidad', Number(e.target.value))} className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm" />
                                    </div>
                                    <div className="w-24">
                                        <label className="mb-1 block text-xs font-medium text-slate-600">P. unit.</label>
                                        <input type="number" step="0.01" min={0} value={item.precio_unitario} onChange={(e) => updateLine(idx, 'precio_unitario', e.target.value)} className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm" />
                                    </div>
                                    <div className="w-28">
                                        <label className="mb-1 block text-xs font-medium text-slate-600">Ubicación</label>
                                        <select value={item.id_ubicacion || ''} onChange={(e) => updateLine(idx, 'id_ubicacion', e.target.value)} className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm">
                                            <option value="">—</option>
                                            {ubicaciones.map((u) => (
                                                <option key={u.id_ubicacion} value={u.id_ubicacion}>{u.codigo}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button type="button" onClick={() => removeLine(idx)} className="rounded bg-red-100 px-2 py-1.5 text-sm text-red-700 hover:bg-red-200" title="Quitar línea">✕</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                        <button type="submit" disabled={processing} className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50">Registrar entrada</button>
                        <Link href="/entradas" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancelar</Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
