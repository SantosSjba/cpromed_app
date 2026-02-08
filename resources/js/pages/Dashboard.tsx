import AppLayout from '@/layouts/AppLayout';

export default function Dashboard() {
    return (
        <AppLayout title="Inicio">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-2 text-xl font-semibold text-slate-800">Bienvenido a CPROMED</h2>
                <p className="text-slate-600">
                    Sistema de Control de Stock de Medicamentos. Use el menú para gestionar
                    categorías, laboratorios, secciones y ubicaciones.
                </p>
            </div>
        </AppLayout>
    );
}
