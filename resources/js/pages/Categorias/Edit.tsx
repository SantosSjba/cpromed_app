import AppLayout from '@/layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';

interface Categoria {
    id_categoria: number;
    nombre: string;
    descripcion: string | null;
    activo: boolean;
}

export default function CategoriasEdit({ categoria }: { categoria: Categoria }) {
    const { data, setData, put, processing, errors } = useForm({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion || '',
        activo: categoria.activo,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/categorias/${categoria.id_categoria}`);
    };

    return (
        <AppLayout title="Editar categoría">
            <Head title="Editar categoría" />
            <div className="mx-auto max-w-md">
                <form onSubmit={submit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div>
                        <label htmlFor="nombre" className="mb-1 block text-sm font-medium text-slate-700">
                            Nombre *
                        </label>
                        <input
                            id="nombre"
                            type="text"
                            value={data.nombre}
                            onChange={(e) => setData('nombre', e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        />
                        {errors.nombre && (
                            <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="descripcion" className="mb-1 block text-sm font-medium text-slate-700">
                            Descripción
                        </label>
                        <textarea
                            id="descripcion"
                            rows={3}
                            value={data.descripcion}
                            onChange={(e) => setData('descripcion', e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        />
                        {errors.descripcion && (
                            <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>
                        )}
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
                            href="/categorias"
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
