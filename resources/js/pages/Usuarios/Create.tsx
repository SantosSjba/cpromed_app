import AppLayout from '@/layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const ROLES = ['Administrador', 'Farmacéutico', 'Auxiliar', 'Solo Lectura'];

export default function UsuariosCreate() {
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        password: '',
        password_confirmation: '',
        nombres: '',
        apellidos: '',
        email: '',
        rol: 'Auxiliar',
        activo: true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/usuarios');
    };

    return (
        <AppLayout title="Nuevo usuario">
            <Head title="Nuevo usuario" />
            <div className="mx-auto max-w-md">
                <form onSubmit={submit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Usuario (login) *</label>
                        <input type="text" value={data.username} onChange={(e) => setData('username', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Contraseña *</label>
                        <input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Confirmar contraseña *</label>
                        <input type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Nombres *</label>
                        <input type="text" value={data.nombres} onChange={(e) => setData('nombres', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        {errors.nombres && <p className="mt-1 text-sm text-red-600">{errors.nombres}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Apellidos *</label>
                        <input type="text" value={data.apellidos} onChange={(e) => setData('apellidos', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        {errors.apellidos && <p className="mt-1 text-sm text-red-600">{errors.apellidos}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                        <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Rol *</label>
                        <select value={data.rol} onChange={(e) => setData('rol', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={data.activo} onChange={(e) => setData('activo', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-sky-600" />
                        <span className="text-sm text-slate-700">Activo</span>
                    </label>
                    <div className="flex gap-2 pt-2">
                        <button type="submit" disabled={processing} className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50">Guardar</button>
                        <Link href="/usuarios" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancelar</Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
