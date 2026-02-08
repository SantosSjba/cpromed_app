import AppLayout from '@/layouts/AppLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface Paciente {
    id_paciente: number;
    dni: string | null;
    nombres: string;
    apellidos: string;
    fecha_nacimiento: string | null;
    telefono: string | null;
    activo: boolean;
}
interface Paginated { data: Paciente[]; links: { url: string | null; label: string; active: boolean }[]; }

export default function PacientesIndex({ pacientes, filters }: { pacientes: Paginated; filters: { buscar?: string } }) {
    const { get, setData, data } = useForm({ buscar: filters.buscar || '' });

    const submitSearch = (e: FormEvent) => {
        e.preventDefault();
        get('/pacientes', { buscar: data.buscar || undefined }, { preserveState: true });
    };

    return (
        <AppLayout title="Pacientes">
            <Head title="Pacientes" />
            <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <form onSubmit={submitSearch} className="flex gap-2">
                        <input type="search" placeholder="Buscar por DNI o nombre..." value={data.buscar} onChange={(e) => setData('buscar', e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        <button type="submit" className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">Buscar</button>
                    </form>
                    <Link href="/pacientes/create" className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700">Nuevo paciente</Link>
                </div>
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">DNI</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Nombres</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Apellidos</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Teléfono</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Estado</th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-slate-500">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {pacientes.data.length === 0 ? (
                                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">No hay pacientes.</td></tr>
                            ) : (
                                pacientes.data.map((p) => (
                                    <tr key={p.id_paciente} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-sm font-medium text-slate-900">{p.dni || '—'}</td>
                                        <td className="px-4 py-3 text-sm text-slate-900">{p.nombres}</td>
                                        <td className="px-4 py-3 text-sm text-slate-900">{p.apellidos}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{p.telefono || '—'}</td>
                                        <td className="px-4 py-3">
                                            <span className={p.activo ? 'rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800' : 'rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600'}>{p.activo ? 'Activo' : 'Inactivo'}</span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link href={`/pacientes/${p.id_paciente}/edit`} className="text-sky-600 hover:underline mr-2">Editar</Link>
                                            <button type="button" onClick={() => confirm('¿Eliminar este paciente?') && router.delete(`/pacientes/${p.id_paciente}`)} className="text-red-600 hover:underline">Eliminar</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    {pacientes.links && pacientes.links.length > 3 && (
                        <div className="flex flex-wrap justify-center gap-1 border-t border-slate-200 bg-slate-50 px-4 py-2">
                            {pacientes.links.map((link, i) => (
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
