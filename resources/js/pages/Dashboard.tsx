import AppLayout from '@/layouts/AppLayout';

interface Kpis {
    total_medicamentos: number;
    total_lotes_stock: number;
    stock_valorizado: number;
    vencidos: number;
    por_vencer_30: number;
    por_vencer_60: number;
    por_vencer_90: number;
    stock_bajo: number;
}

export default function Dashboard({ kpis }: { kpis: Kpis }) {
    const cards = [
        { title: 'Medicamentos registrados', value: kpis.total_medicamentos, color: 'bg-slate-100 text-slate-800' },
        { title: 'Lotes con stock', value: kpis.total_lotes_stock, color: 'bg-slate-100 text-slate-800' },
        { title: 'Stock valorizado (S/.)', value: kpis.stock_valorizado.toFixed(2), color: 'bg-green-100 text-green-800' },
        { title: 'Medicamentos vencidos', value: kpis.vencidos, color: kpis.vencidos > 0 ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800' },
        { title: 'Por vencer (30 días)', value: kpis.por_vencer_30, color: kpis.por_vencer_30 > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800' },
        { title: 'Por vencer (60 días)', value: kpis.por_vencer_60, color: 'bg-slate-100 text-slate-800' },
        { title: 'Por vencer (90 días)', value: kpis.por_vencer_90, color: 'bg-slate-100 text-slate-800' },
        { title: 'Stock bajo mínimo', value: kpis.stock_bajo, color: kpis.stock_bajo > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800' },
    ];

    return (
        <AppLayout title="Inicio">
            <div className="space-y-6">
                <div>
                    <h2 className="mb-1 text-xl font-semibold text-slate-800">Bienvenido a CPROMED</h2>
                    <p className="text-sm text-slate-600">Sistema de Control de Stock de Medicamentos.</p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {cards.map((card) => (
                        <div key={card.title} className={`rounded-xl border border-slate-200 p-4 ${card.color}`}>
                            <p className="text-sm font-medium opacity-90">{card.title}</p>
                            <p className="mt-1 text-2xl font-bold">{card.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
