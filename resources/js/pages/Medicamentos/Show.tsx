import AppLayout from '@/layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';

interface CategoriaRef { id_categoria: number; nombre: string; }
interface LaboratorioRef { id_laboratorio: number; nombre: string; }
interface UbicacionRef { id_ubicacion: number; codigo: string; }
interface PresentacionRef {
    id_presentacion: number;
    tipo_presentacion: string;
    unidades_por_presentacion: number;
    precio_compra: string | null;
    precio_venta: string | null;
    ubicacion?: UbicacionRef | null;
}
interface Medicamento {
    id_medicamento: number;
    codigo_digemid: string | null;
    codigo_interno: string;
    nombre_generico: string;
    nombre_comercial: string | null;
    categoria?: CategoriaRef | null;
    laboratorio?: LaboratorioRef | null;
    principio_activo: string | null;
    concentracion: string | null;
    forma_farmaceutica: string;
    via_administracion: string | null;
    requiere_receta: boolean;
    controlado: boolean;
    temperatura_almacenamiento: string | null;
    activo: boolean;
    notas: string | null;
    presentaciones?: PresentacionRef[];
}

export default function MedicamentosShow({ medicamento }: { medicamento: Medicamento }) {
    return (
        <AppLayout title={medicamento.nombre_generico}>
            <Head title={`Medicamento: ${medicamento.nombre_generico}`} />
            <div className="space-y-6">
                <div className="flex justify-between">
                    <Link href="/medicamentos" className="text-sky-600 hover:underline">← Volver a medicamentos</Link>
                    <Link href={`/medicamentos/${medicamento.id_medicamento}/edit`} className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700">Editar</Link>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold text-slate-800">Datos del medicamento</h2>
                    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div><dt className="text-sm text-slate-500">Código interno</dt><dd className="font-medium">{medicamento.codigo_interno}</dd></div>
                        <div><dt className="text-sm text-slate-500">Código DIGEMID</dt><dd className="font-medium">{medicamento.codigo_digemid || '—'}</dd></div>
                        <div><dt className="text-sm text-slate-500">Nombre genérico</dt><dd className="font-medium">{medicamento.nombre_generico}</dd></div>
                        <div><dt className="text-sm text-slate-500">Nombre comercial</dt><dd className="font-medium">{medicamento.nombre_comercial || '—'}</dd></div>
                        <div><dt className="text-sm text-slate-500">Categoría</dt><dd className="font-medium">{medicamento.categoria?.nombre ?? '—'}</dd></div>
                        <div><dt className="text-sm text-slate-500">Laboratorio</dt><dd className="font-medium">{medicamento.laboratorio?.nombre ?? '—'}</dd></div>
                        <div><dt className="text-sm text-slate-500">Principio activo</dt><dd className="font-medium">{medicamento.principio_activo || '—'}</dd></div>
                        <div><dt className="text-sm text-slate-500">Concentración</dt><dd className="font-medium">{medicamento.concentracion || '—'}</dd></div>
                        <div><dt className="text-sm text-slate-500">Forma farmacéutica</dt><dd className="font-medium">{medicamento.forma_farmaceutica}</dd></div>
                        <div><dt className="text-sm text-slate-500">Vía administración</dt><dd className="font-medium">{medicamento.via_administracion || '—'}</dd></div>
                        <div><dt className="text-sm text-slate-500">Requiere receta</dt><dd className="font-medium">{medicamento.requiere_receta ? 'Sí' : 'No'}</dd></div>
                        <div><dt className="text-sm text-slate-500">Controlado</dt><dd className="font-medium">{medicamento.controlado ? 'Sí' : 'No'}</dd></div>
                        <div><dt className="text-sm text-slate-500">Temperatura</dt><dd className="font-medium">{medicamento.temperatura_almacenamiento || '—'}</dd></div>
                        <div className="sm:col-span-2"><dt className="text-sm text-slate-500">Notas</dt><dd className="font-medium">{medicamento.notas || '—'}</dd></div>
                    </dl>
                </div>
                {medicamento.presentaciones && medicamento.presentaciones.length > 0 && (
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-slate-800">Presentaciones</h2>
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Tipo</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Unidades/presentación</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Precio compra</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Precio venta</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Ubicación</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {medicamento.presentaciones.map((p) => (
                                    <tr key={p.id_presentacion}>
                                        <td className="px-4 py-2 text-sm">{p.tipo_presentacion}</td>
                                        <td className="px-4 py-2 text-sm">{p.unidades_por_presentacion}</td>
                                        <td className="px-4 py-2 text-sm">{p.precio_compra ?? '—'}</td>
                                        <td className="px-4 py-2 text-sm">{p.precio_venta ?? '—'}</td>
                                        <td className="px-4 py-2 text-sm">{p.ubicacion?.codigo ?? '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-4">
                            <Link href={`/presentaciones?id_medicamento=${medicamento.id_medicamento}`} className="text-sky-600 hover:underline">Ver presentaciones →</Link>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
