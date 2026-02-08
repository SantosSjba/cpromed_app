import AppLayout from '@/layouts/AppLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface Laboratorio {
    id_laboratorio: number;
    nombre: string;
    pais_origen: string | null;
    contacto: string | null;
    telefono: string | null;
    activo: boolean;
}

interface Paginated {
    data: Laboratorio[];
    links: { url: string | null; label: string; active: boolean }[];
}

export default function LaboratoriosIndex({
    laboratorios,
    filters,
}: {
    laboratorios: Paginated;
    filters: { buscar?: string };
}) {
    const { get, setData, data } = useForm({ buscar: filters.buscar || '' });

    const submitSearch = (e: FormEvent) => {
        e.preventDefault();
        get('/laboratorios', { buscar: data.buscar }, { preserveState: true });
    };

    return (
        <AppLayout title="Laboratorios">
            <Head title="Laboratorios" />
            <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <form onSubmit={submitSearch} className="flex gap-2">
                        <input
                            type="search"
                            placeholder="Buscar..."
                            value={data.buscar}
                            onChange={(e) => setData('buscar', e.target.value)}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        />
                        <button
                            type="submit"
                            className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                        >
                            Buscar
                        </button>
                    </form>
                    <Link
                        href="/laboratorios/create"
                        className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
                    >
                        Nuevo laboratorio
                    </Link>
                </div>
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">
                                    Nombre
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">
                                    País
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">
                                    Teléfono
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
                            {laboratorios.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                                        No hay laboratorios registrados.
                                    </td>
                                </tr>
                            ) : (
                                laboratorios.data.map((l) => (
                                    <tr key={l.id_laboratorio} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-sm font-medium text-slate-900">
                                            {l.nombre}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-600">
                                            {l.pais_origen || '—'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-600">
                                            {l.telefono || '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={
                                                    l.activo
                                                        ? 'rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800'
                                                        : 'rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600'
                                                }
                                            >
                                                {l.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link
                                                href={`/laboratorios/${l.id_laboratorio}/edit`}
                                                className="text-sky-600 hover:underline"
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (confirm('¿Eliminar este laboratorio?')) {
                                                        router.delete(`/laboratorios/${l.id_laboratorio}`);
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
                    {laboratorios.links && laboratorios.links.length > 3 && (
                        <div className="flex flex-wrap justify-center gap-1 border-t border-slate-200 bg-slate-50 px-4 py-2">
                            {laboratorios.links.map((link, i) => (
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
