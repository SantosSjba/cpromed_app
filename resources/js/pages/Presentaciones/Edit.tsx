import AppLayout from '@/layouts/AppLayout';
import { TIPO_PRESENTACION } from '@/lib/enums';
import { Head, Link, useForm } from '@inertiajs/react';

interface MedicamentoRef { id_medicamento: number; nombre_generico: string; codigo_interno: string; }
interface UbicacionRef { id_ubicacion: number; codigo: string; }
interface Presentacion {
    id_presentacion: number;
    id_medicamento: number;
    tipo_presentacion: string;
    unidades_por_presentacion: number;
    codigo_barras: string | null;
    precio_compra: string | null;
    precio_venta: string | null;
    id_ubicacion: number | null;
    stock_minimo: number;
    stock_maximo: number;
    activo: boolean;
}

export default function PresentacionesEdit({
    presentacion,
    medicamentos,
    ubicaciones,
}: {
    presentacion: Presentacion;
    medicamentos: MedicamentoRef[];
    ubicaciones: UbicacionRef[];
}) {
    const { data, setData, put, processing, errors } = useForm({
        id_medicamento: String(presentacion.id_medicamento),
        tipo_presentacion: presentacion.tipo_presentacion,
        unidades_por_presentacion: presentacion.unidades_por_presentacion,
        codigo_barras: presentacion.codigo_barras || '',
        precio_compra: presentacion.precio_compra ?? '',
        precio_venta: presentacion.precio_venta ?? '',
        id_ubicacion: presentacion.id_ubicacion ?? '',
        stock_minimo: presentacion.stock_minimo,
        stock_maximo: presentacion.stock_maximo,
        activo: presentacion.activo,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/presentaciones/${presentacion.id_presentacion}`, {
            transform: (d) => ({
                ...d,
                id_medicamento: Number(d.id_medicamento),
                precio_compra: d.precio_compra === '' ? null : Number(d.precio_compra),
                precio_venta: d.precio_venta === '' ? null : Number(d.precio_venta),
                id_ubicacion: d.id_ubicacion ? Number(d.id_ubicacion) : null,
            }),
        });
    };

    return (
        <AppLayout title="Editar presentación">
            <Head title="Editar presentación" />
            <div className="mx-auto max-w-md">
                <form onSubmit={submit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Medicamento *</label>
                        <select value={data.id_medicamento} onChange={(e) => setData('id_medicamento', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" required>
                            {medicamentos.map((m) => (
                                <option key={m.id_medicamento} value={m.id_medicamento}>{m.nombre_generico} ({m.codigo_interno})</option>
                            ))}
                        </select>
                        {errors.id_medicamento && <p className="mt-1 text-sm text-red-600">{errors.id_medicamento}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Tipo presentación *</label>
                        <select value={data.tipo_presentacion} onChange={(e) => setData('tipo_presentacion', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                            {TIPO_PRESENTACION.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Unidades por presentación *</label>
                        <input type="number" min={1} value={data.unidades_por_presentacion} onChange={(e) => setData('unidades_por_presentacion', Number(e.target.value))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        {errors.unidades_por_presentacion && <p className="mt-1 text-sm text-red-600">{errors.unidades_por_presentacion}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Código de barras</label>
                        <input type="text" value={data.codigo_barras} onChange={(e) => setData('codigo_barras', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Precio compra</label>
                            <input type="number" step="0.01" min={0} value={data.precio_compra} onChange={(e) => setData('precio_compra', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Precio venta</label>
                            <input type="number" step="0.01" min={0} value={data.precio_venta} onChange={(e) => setData('precio_venta', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        </div>
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Ubicación predeterminada</label>
                        <select value={data.id_ubicacion} onChange={(e) => setData('id_ubicacion', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                            <option value="">—</option>
                            {ubicaciones.map((u) => (
                                <option key={u.id_ubicacion} value={u.id_ubicacion}>{u.codigo}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Stock mínimo</label>
                            <input type="number" min={0} value={data.stock_minimo} onChange={(e) => setData('stock_minimo', Number(e.target.value))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Stock máximo</label>
                            <input type="number" min={0} value={data.stock_maximo} onChange={(e) => setData('stock_maximo', Number(e.target.value))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        </div>
                    </div>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={data.activo} onChange={(e) => setData('activo', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-sky-600" />
                        <span className="text-sm text-slate-700">Activo</span>
                    </label>
                    <div className="flex gap-2 pt-2">
                        <button type="submit" disabled={processing} className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50">Actualizar</button>
                        <Link href="/presentaciones" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancelar</Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
