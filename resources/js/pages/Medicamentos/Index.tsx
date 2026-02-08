import AppLayout from '@/layouts/AppLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface CategoriaRef {
    id_categoria: number;
    nombre: string;
}
interface LaboratorioRef {
    id_laboratorio: number;
    nombre: string;
}
interface Medicamento {
    id_medicamento: number;
    codigo_interno: string;
    nombre_generico: string;
    nombre_comercial: string | null;
    forma_farmaceutica: string;
    activo: boolean;
    categoria?: CategoriaRef | null;
    laboratorio?: LaboratorioRef | null;
}

interface Paginated {
    data: Medicamento[];
    links: { url: string | null; label: string; active: boolean }[];
}

export default function MedicamentosIndex({
    medicamentos,
    categorias,
    laboratorios,
    filters,
}: {
    medicamentos: Paginated;
    categorias: CategoriaRef[];
    laboratorios: LaboratorioRef[];
    filters: { buscar?: string; id_categoria?: string; id_laboratorio?: string };
}) {
    const { get, setData, data } = useForm({
        buscar: filters.buscar || '',
        id_categoria: filters.id_categoria || '',
        id_laboratorio: filters.id_laboratorio || '',
    });

    const submitSearch = (e: FormEvent) => {
        e.preventDefault();
        get('/medicamentos', {
            buscar: data.buscar || undefined,
            id_categoria: data.id_categoria || undefined,
            id_laboratorio: data.id_laboratorio || undefined,
        }, { preserveState: true });
    };

    return (
        <AppLayout title="Medicamentos">
            <Head title="Medicamentos" />
            <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <form onSubmit={submitSearch} className="flex flex-wrap items-center gap-2">
                        <input
                            type="search"
                            placeholder="Buscar..."
                            value={data.buscar}
                            onChange={(e) => setData('buscar', e.target.value)}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        />
                        <select
                            value={data.id_categoria}
                            onChange={(e) => setData('id_categoria', e.target.value)}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        >
                            <option value="">Todas las categorías</option>
                            {categorias.map((c) => (
                                <option key={c.id_categoria} value={String(c.id_categoria)}>{c.nombre}</option>
                            ))}
                        </select>
                        <select
                            value={data.id_laboratorio}
                            onChange={(e) => setData('id_laboratorio', e.target.value)}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        >
                            <option value="">Todos los laboratorios</option>
                            {laboratorios.map((l) => (
                                <option key={l.id_laboratorio} value={String(l.id_laboratorio)}>{l.nombre}</option>
                            ))}
                        </select>
                        <button type="submit" className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
                            Buscar
                        </button>
                    </form>
                    <Link href="/medicamentos/create" className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700">
                        Nuevo medicamento
                    </Link>
                </div>
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Código</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Nombre genérico</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Nombre comercial</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Categoría</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Forma</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Estado</th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-slate-500">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {medicamentos.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-slate-500">No hay medicamentos.</td>
                                </tr>
                            ) : (
                                medicamentos.data.map((m) => (
                                    <tr key={m.id_medicamento} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-sm font-medium text-slate-900">{m.codigo_interno}</td>
                                        <td className="px-4 py-3 text-sm text-slate-900">{m.nombre_generico}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{m.nombre_comercial || '—'}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{m.categoria?.nombre ?? '—'}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{m.forma_farmaceutica}</td>
                                        <td className="px-4 py-3">
                                            <span className={m.activo ? 'rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800' : 'rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600'}>
                                                {m.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link href={`/medicamentos/${m.id_medicamento}`} className="text-slate-600 hover:underline mr-2">Ver</Link>
                                            <Link href={`/medicamentos/${m.id_medicamento}/edit`} className="text-sky-600 hover:underline mr-2">Editar</Link>
                                            <button
                                                type="button"
                                                onClick={() => confirm('¿Eliminar este medicamento?') && router.delete(`/medicamentos/${m.id_medicamento}`)}
                                                className="text-red-600 hover:underline"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    {medicamentos.links && medicamentos.links.length > 3 && (
                        <div className="flex flex-wrap justify-center gap-1 border-t border-slate-200 bg-slate-50 px-4 py-2">
                            {medicamentos.links.map((link, i) => (
                                <span key={i}>
                                    {link.url ? (
                                        <Link href={link.url} className={link.active ? 'rounded px-2 py-1 text-sm font-medium text-sky-700' : 'rounded px-2 py-1 text-sm text-slate-600 hover:bg-slate-200'}>
                                            {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                                        </Link>
                                    ) : (
                                        <span className="px-2 py-1 text-sm text-slate-400">{link.label.replace('&laquo;', '«').replace('&raquo;', '»')}</span>
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
