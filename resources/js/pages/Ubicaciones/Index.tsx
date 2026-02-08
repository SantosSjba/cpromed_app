import AppLayout from '@/layouts/AppLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface SeccionRef {
    id_seccion: number;
    codigo: string;
    nombre: string;
}

interface Ubicacion {
    id_ubicacion: number;
    codigo: string;
    fila: string | null;
    columna: string | null;
    nivel: string | null;
    capacidad_maxima: number | null;
    ocupado: boolean;
    activo: boolean;
    seccion: SeccionRef;
}

interface Paginated {
    data: Ubicacion[];
    links: { url: string | null; label: string; active: boolean }[];
}

export default function UbicacionesIndex({
    ubicaciones,
    secciones,
    filters,
}: {
    ubicaciones: Paginated;
    secciones: SeccionRef[];
    filters: { buscar?: string; id_seccion?: string };
}) {
    const { get, setData, data } = useForm({
        buscar: filters.buscar || '',
        id_seccion: filters.id_seccion || '',
    });

    const submitSearch = (e: FormEvent) => {
        e.preventDefault();
        get('/ubicaciones', { buscar: data.buscar, id_seccion: data.id_seccion || undefined }, { preserveState: true });
    };

    return (
        <AppLayout title="Ubicaciones">
            <Head title="Ubicaciones" />
            <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <form onSubmit={submitSearch} className="flex flex-wrap items-center gap-2">
                        <input
                            type="search"
                            placeholder="Buscar código..."
                            value={data.buscar}
                            onChange={(e) => setData('buscar', e.target.value)}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        />
                        <select
                            value={data.id_seccion}
                            onChange={(e) => setData('id_seccion', e.target.value)}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        >
                            <option value="">Todas las secciones</option>
                            {secciones.map((s) => (
                                <option key={s.id_seccion} value={String(s.id_seccion)}>
                                    {s.codigo} - {s.nombre}
                                </option>
                            ))}
                        </select>
                        <button
                            type="submit"
                            className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                        >
                            Buscar
                        </button>
                    </form>
                    <Link
                        href="/ubicaciones/create"
                        className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
                    >
                        Nueva ubicación
                    </Link>
                </div>
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">
                                    Código
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">
                                    Sección
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">
                                    Fila / Col / Nivel
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">
                                    Capacidad
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">
                                    Estado
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-slate-500">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {ubicaciones.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                                        No hay ubicaciones registradas.
                                    </td>
                                </tr>
                            ) : (
                                ubicaciones.data.map((u) => (
                                    <tr key={u.id_ubicacion} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-sm font-medium text-slate-900">
                                            {u.codigo}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-600">
                                            {u.seccion?.codigo} - {u.seccion?.nombre}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-600">
                                            {[u.fila, u.columna, u.nivel].filter(Boolean).join(' / ') || '—'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-600">
                                            {u.capacidad_maxima ?? '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={
                                                    u.activo
                                                        ? 'rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800'
                                                        : 'rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600'
                                                }
                                            >
                                                {u.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link
                                                href={`/ubicaciones/${u.id_ubicacion}/edit`}
                                                className="text-sky-600 hover:underline"
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (confirm('¿Eliminar esta ubicación?')) {
                                                        router.delete(`/ubicaciones/${u.id_ubicacion}`);
                                                    }
                                                }}
                                                className="ml-3 text-red-600 hover:underline"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    {ubicaciones.links && ubicaciones.links.length > 3 && (
                        <div className="flex flex-wrap justify-center gap-1 border-t border-slate-200 bg-slate-50 px-4 py-2">
                            {ubicaciones.links.map((link, i) => (
                                <span key={i}>
                                    {link.url ? (
                                        <Link
                                            href={link.url}
                                            className={
                                                link.active
                                                    ? 'rounded px-2 py-1 text-sm font-medium text-sky-700'
                                                    : 'rounded px-2 py-1 text-sm text-slate-600 hover:bg-slate-200'
                                            }
                                        >
                                            {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                                        </Link>
                                    ) : (
                                        <span className="px-2 py-1 text-sm text-slate-400">
                                            {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                                        </span>
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
