import AppLayout from '@/layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface UsuarioRef {
    id_usuario: number;
    username: string;
    nombres: string;
    apellidos: string;
    email: string | null;
    rol: string;
    activo: boolean;
}
interface Paginated { data: UsuarioRef[]; links: { url: string | null; label: string; active: boolean }[]; }

const ROLES = ['Administrador', 'Farmacéutico', 'Auxiliar', 'Solo Lectura'];

export default function UsuariosIndex({ usuarios, filters }: { usuarios: Paginated; filters: { buscar?: string; rol?: string } }) {
    const { get, setData, data } = useForm({
        buscar: filters.buscar || '',
        rol: filters.rol || '',
    });

    const submitSearch = (e: FormEvent) => {
        e.preventDefault();
        get('/usuarios', { buscar: data.buscar || undefined, rol: data.rol || undefined }, { preserveState: true });
    };

    return (
        <AppLayout title="Usuarios">
            <Head title="Usuarios" />
            <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <form onSubmit={submitSearch} className="flex flex-wrap items-center gap-2">
                        <input type="search" placeholder="Usuario, nombre o email..." value={data.buscar} onChange={(e) => setData('buscar', e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        <select value={data.rol} onChange={(e) => setData('rol', e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
                            <option value="">Todos los roles</option>
                            {ROLES.map((r) => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                        <button type="submit" className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">Buscar</button>
                    </form>
                    <Link href="/usuarios/create" className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700">Nuevo usuario</Link>
                </div>
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Usuario</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Nombres</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Apellidos</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Email</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Rol</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Estado</th>
                                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-slate-500">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {usuarios.data.length === 0 ? (
                                <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">No hay usuarios.</td></tr>
                            ) : (
                                usuarios.data.map((u) => (
                                    <tr key={u.id_usuario} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-sm font-medium text-slate-900">{u.username}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{u.nombres}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{u.apellidos}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{u.email ?? '—'}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{u.rol}</td>
                                        <td className="px-4 py-3">
                                            <span className={u.activo ? 'rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800' : 'rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600'}>{u.activo ? 'Activo' : 'Inactivo'}</span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link href={`/usuarios/${u.id_usuario}/edit`} className="text-sky-600 hover:underline">Editar</Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    {usuarios.links && usuarios.links.length > 3 && (
                        <div className="flex flex-wrap justify-center gap-1 border-t border-slate-200 bg-slate-50 px-4 py-2">
                            {usuarios.links.map((link, i) => (
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
