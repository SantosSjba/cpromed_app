import AppLayout from '@/layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';

interface SeccionRef {
    id_seccion: number;
    codigo: string;
    nombre: string;
}

interface Ubicacion {
    id_ubicacion: number;
    id_seccion: number;
    codigo: string;
    fila: string | null;
    columna: string | null;
    nivel: string | null;
    capacidad_maxima: number | null;
    activo: boolean;
}

export default function UbicacionesEdit({
    ubicacion,
    secciones,
}: {
    ubicacion: Ubicacion;
    secciones: SeccionRef[];
}) {
    const { data, setData, put, processing, errors } = useForm({
        id_seccion: String(ubicacion.id_seccion),
        codigo: ubicacion.codigo,
        fila: ubicacion.fila || '',
        columna: ubicacion.columna || '',
        nivel: ubicacion.nivel || '',
        capacidad_maxima: ubicacion.capacidad_maxima ?? '',
        activo: ubicacion.activo,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/ubicaciones/${ubicacion.id_ubicacion}`, {
            transform: (d) => ({
                ...d,
                id_seccion: Number(d.id_seccion),
                capacidad_maxima: d.capacidad_maxima === '' ? null : Number(d.capacidad_maxima),
            }),
        });
    };

    return (
        <AppLayout title="Editar ubicación">
            <Head title="Editar ubicación" />
            <div className="mx-auto max-w-md">
                <form onSubmit={submit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div>
                        <label htmlFor="id_seccion" className="mb-1 block text-sm font-medium text-slate-700">
                            Sección *
                        </label>
                        <select
                            id="id_seccion"
                            value={data.id_seccion}
                            onChange={(e) => setData('id_seccion', e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        >
                            {secciones.map((s) => (
                                <option key={s.id_seccion} value={String(s.id_seccion)}>
                                    {s.codigo} - {s.nombre}
                                </option>
                            ))}
                        </select>
                        {errors.id_seccion && (
                            <p className="mt-1 text-sm text-red-600">{errors.id_seccion}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="codigo" className="mb-1 block text-sm font-medium text-slate-700">
                            Código *
                        </label>
                        <input
                            id="codigo"
                            type="text"
                            value={data.codigo}
                            onChange={(e) => setData('codigo', e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        />
                        {errors.codigo && <p className="mt-1 text-sm text-red-600">{errors.codigo}</p>}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <div>
                            <label htmlFor="fila" className="mb-1 block text-sm font-medium text-slate-700">
                                Fila
                            </label>
                            <input
                                id="fila"
                                type="text"
                                value={data.fila}
                                onChange={(e) => setData('fila', e.target.value)}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="columna" className="mb-1 block text-sm font-medium text-slate-700">
                                Columna
                            </label>
                            <input
                                id="columna"
                                type="text"
                                value={data.columna}
                                onChange={(e) => setData('columna', e.target.value)}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="nivel" className="mb-1 block text-sm font-medium text-slate-700">
                                Nivel
                            </label>
                            <input
                                id="nivel"
                                type="text"
                                value={data.nivel}
                                onChange={(e) => setData('nivel', e.target.value)}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="capacidad_maxima" className="mb-1 block text-sm font-medium text-slate-700">
                            Capacidad máxima
                        </label>
                        <input
                            id="capacidad_maxima"
                            type="number"
                            min={0}
                            value={data.capacidad_maxima === '' ? '' : data.capacidad_maxima}
                            onChange={(e) =>
                                setData(
                                    'capacidad_maxima',
                                    e.target.value === '' ? '' : Number(e.target.value)
                                )
                            }
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            id="activo"
                            type="checkbox"
                            checked={data.activo}
                            onChange={(e) => setData('activo', e.target.checked)}
                            className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                        />
                        <label htmlFor="activo" className="text-sm text-slate-700">
                            Activo
                        </label>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50"
                        >
                            Actualizar
                        </button>
                        <Link
                            href="/ubicaciones"
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
