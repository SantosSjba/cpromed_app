import AppLayout from '@/layouts/AppLayout';
import { Head } from '@inertiajs/react';

export default function ConfiguracionIndex({
    app_name,
    env,
    debug,
}: {
    app_name: string;
    env: string;
    debug: boolean;
}) {
    return (
        <AppLayout title="Configuración">
            <Head title="Configuración" />
            <div className="space-y-6">
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold text-slate-800">Parámetros del sistema</h2>
                    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                            <dt className="text-sm text-slate-500">Nombre de la aplicación</dt>
                            <dd className="font-medium">{app_name}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-slate-500">Entorno</dt>
                            <dd className="font-medium">{env}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-slate-500">Modo debug</dt>
                            <dd className="font-medium">{debug ? 'Sí' : 'No'}</dd>
                        </div>
                    </dl>
                </div>
                <p className="text-sm text-slate-600">
                    Los respaldos y demás opciones avanzadas pueden configurarse desde el servidor o variables de entorno.
                </p>
            </div>
        </AppLayout>
    );
}
