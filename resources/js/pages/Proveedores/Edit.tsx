import AppLayout from '@/layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';

interface Proveedor {
    id_proveedor: number;
    ruc: string;
    razon_social: string;
    nombre_comercial: string | null;
    direccion: string | null;
    telefono: string | null;
    email: string | null;
    contacto_nombre: string | null;
    activo: boolean;
}

export default function ProveedoresEdit({ proveedor }: { proveedor: Proveedor }) {
    const { data, setData, put, processing, errors } = useForm({
        ruc: proveedor.ruc,
        razon_social: proveedor.razon_social,
        nombre_comercial: proveedor.nombre_comercial || '',
        direccion: proveedor.direccion || '',
        telefono: proveedor.telefono || '',
        email: proveedor.email || '',
        contacto_nombre: proveedor.contacto_nombre || '',
        activo: proveedor.activo,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/proveedores/${proveedor.id_proveedor}`);
    };

    return (
        <AppLayout title="Editar proveedor">
            <Head title="Editar proveedor" />
            <div className="mx-auto max-w-md">
                <form onSubmit={submit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">RUC (11 dígitos) *</label>
                        <input type="text" maxLength={11} value={data.ruc} onChange={(e) => setData('ruc', e.target.value.replace(/\D/g, ''))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        {errors.ruc && <p className="mt-1 text-sm text-red-600">{errors.ruc}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Razón social *</label>
                        <input type="text" value={data.razon_social} onChange={(e) => setData('razon_social', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        {errors.razon_social && <p className="mt-1 text-sm text-red-600">{errors.razon_social}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Nombre comercial</label>
                        <input type="text" value={data.nombre_comercial} onChange={(e) => setData('nombre_comercial', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Dirección</label>
                        <textarea rows={2} value={data.direccion} onChange={(e) => setData('direccion', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Teléfono</label>
                            <input type="text" value={data.telefono} onChange={(e) => setData('telefono', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                            <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                        </div>
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Contacto (nombre)</label>
                        <input type="text" value={data.contacto_nombre} onChange={(e) => setData('contacto_nombre', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                    </div>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={data.activo} onChange={(e) => setData('activo', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-sky-600" />
                        <span className="text-sm text-slate-700">Activo</span>
                    </label>
                    <div className="flex gap-2 pt-2">
                        <button type="submit" disabled={processing} className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50">Actualizar</button>
                        <Link href="/proveedores" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancelar</Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
