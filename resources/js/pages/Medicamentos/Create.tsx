import AppLayout from '@/layouts/AppLayout';
import { FORMA_FARMACEUTICA, VIA_ADMINISTRACION } from '@/lib/enums';
import { Head, Link, useForm } from '@inertiajs/react';

interface CategoriaRef {
    id_categoria: number;
    nombre: string;
}
interface LaboratorioRef {
    id_laboratorio: number;
    nombre: string;
}

export default function MedicamentosCreate({
    categorias,
    laboratorios,
}: {
    categorias: CategoriaRef[];
    laboratorios: LaboratorioRef[];
}) {
    const { data, setData, post, processing, errors } = useForm({
        codigo_digemid: '',
        codigo_interno: '',
        nombre_generico: '',
        nombre_comercial: '',
        id_categoria: '' as string | number,
        id_laboratorio: '' as string | number,
        principio_activo: '',
        concentracion: '',
        forma_farmaceutica: 'Tableta',
        via_administracion: 'Oral',
        requiere_receta: false,
        controlado: false,
        temperatura_almacenamiento: '',
        activo: true,
        notas: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/medicamentos', {
            transform: (d) => ({
                ...d,
                id_categoria: d.id_categoria ? Number(d.id_categoria) : null,
                id_laboratorio: d.id_laboratorio ? Number(d.id_laboratorio) : null,
            }),
        });
    };

    return (
        <AppLayout title="Nuevo medicamento">
            <Head title="Nuevo medicamento" />
            <div className="mx-auto max-w-2xl">
                <form onSubmit={submit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Código interno *</label>
                            <input type="text" value={data.codigo_interno} onChange={(e) => setData('codigo_interno', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                            {errors.codigo_interno && <p className="mt-1 text-sm text-red-600">{errors.codigo_interno}</p>}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Código DIGEMID</label>
                            <input type="text" value={data.codigo_digemid} onChange={(e) => setData('codigo_digemid', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        </div>
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Nombre genérico *</label>
                        <input type="text" value={data.nombre_generico} onChange={(e) => setData('nombre_generico', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        {errors.nombre_generico && <p className="mt-1 text-sm text-red-600">{errors.nombre_generico}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Nombre comercial</label>
                        <input type="text" value={data.nombre_comercial} onChange={(e) => setData('nombre_comercial', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Categoría</label>
                            <select value={data.id_categoria} onChange={(e) => setData('id_categoria', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                                <option value="">—</option>
                                {categorias.map((c) => (
                                    <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Laboratorio</label>
                            <select value={data.id_laboratorio} onChange={(e) => setData('id_laboratorio', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                                <option value="">—</option>
                                {laboratorios.map((l) => (
                                    <option key={l.id_laboratorio} value={l.id_laboratorio}>{l.nombre}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Principio activo</label>
                            <input type="text" value={data.principio_activo} onChange={(e) => setData('principio_activo', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Concentración</label>
                            <input type="text" value={data.concentracion} onChange={(e) => setData('concentracion', e.target.value)} placeholder="Ej: 500mg" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Forma farmacéutica *</label>
                            <select value={data.forma_farmaceutica} onChange={(e) => setData('forma_farmaceutica', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                                {FORMA_FARMACEUTICA.map((f) => (
                                    <option key={f} value={f}>{f}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Vía administración</label>
                            <select value={data.via_administracion} onChange={(e) => setData('via_administracion', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                                {VIA_ADMINISTRACION.map((v) => (
                                    <option key={v} value={v}>{v}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={data.requiere_receta} onChange={(e) => setData('requiere_receta', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-sky-600" />
                            <span className="text-sm text-slate-700">Requiere receta</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={data.controlado} onChange={(e) => setData('controlado', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-sky-600" />
                            <span className="text-sm text-slate-700">Controlado</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={data.activo} onChange={(e) => setData('activo', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-sky-600" />
                            <span className="text-sm text-slate-700">Activo</span>
                        </label>
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Temperatura almacenamiento</label>
                        <input type="text" value={data.temperatura_almacenamiento} onChange={(e) => setData('temperatura_almacenamiento', e.target.value)} placeholder="Ej: 2-8°C" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Notas</label>
                        <textarea rows={2} value={data.notas} onChange={(e) => setData('notas', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button type="submit" disabled={processing} className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50">Guardar</button>
                        <Link href="/medicamentos" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancelar</Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
