import AppLayout from '@/layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';

interface Paciente {
    id_paciente: number;
    dni: string | null;
    nombres: string;
    apellidos: string;
    fecha_nacimiento: string | null;
    sexo: string | null;
    telefono: string | null;
    direccion: string | null;
    email: string | null;
    activo: boolean;
}

export default function PacientesEdit({ paciente }: { paciente: Paciente }) {
    const { data, setData, put, processing, errors } = useForm({
        dni: paciente.dni || '',
        nombres: paciente.nombres,
        apellidos: paciente.apellidos,
        fecha_nacimiento: paciente.fecha_nacimiento ? paciente.fecha_nacimiento.toString().slice(0, 10) : '',
        sexo: paciente.sexo || 'M',
        telefono: paciente.telefono || '',
        direccion: paciente.direccion || '',
        email: paciente.email || '',
        activo: paciente.activo,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/pacientes/${paciente.id_paciente}`, {
            transform: (d) => ({ ...d, fecha_nacimiento: d.fecha_nacimiento || null, dni: d.dni || null }),
        });
    };

    return (
        <AppLayout title="Editar paciente">
            <Head title="Editar paciente" />
            <div className="mx-auto max-w-md">
                <form onSubmit={submit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">DNI (8 dígitos)</label>
                        <input type="text" maxLength={8} value={data.dni} onChange={(e) => setData('dni', e.target.value.replace(/\D/g, ''))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        {errors.dni && <p className="mt-1 text-sm text-red-600">{errors.dni}</p>}
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
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Fecha nacimiento</label>
                            <input type="date" value={data.fecha_nacimiento} onChange={(e) => setData('fecha_nacimiento', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Sexo</label>
                            <select value={data.sexo} onChange={(e) => setData('sexo', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Teléfono</label>
                        <input type="text" value={data.telefono} onChange={(e) => setData('telefono', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Dirección</label>
                        <textarea rows={2} value={data.direccion} onChange={(e) => setData('direccion', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                        <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={data.activo} onChange={(e) => setData('activo', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-sky-600" />
                        <span className="text-sm text-slate-700">Activo</span>
                    </label>
                    <div className="flex gap-2 pt-2">
                        <button type="submit" disabled={processing} className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50">Actualizar</button>
                        <Link href="/pacientes" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancelar</Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
