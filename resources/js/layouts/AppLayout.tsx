import { Head, Link, usePage } from '@inertiajs/react';
import { ReactNode } from 'react';

const navItems = [
    { label: 'Inicio', href: '/', route: 'dashboard' },
    { label: 'Categorías', href: '/categorias', route: 'categorias.index' },
    { label: 'Laboratorios', href: '/laboratorios', route: 'laboratorios.index' },
    { label: 'Secciones', href: '/secciones', route: 'secciones.index' },
    { label: 'Ubicaciones', href: '/ubicaciones', route: 'ubicaciones.index' },
    { label: 'Medicamentos', href: '/medicamentos', route: 'medicamentos.index' },
    { label: 'Presentaciones', href: '/presentaciones', route: 'presentaciones.index' },
    { label: 'Proveedores', href: '/proveedores', route: 'proveedores.index' },
    { label: 'Pacientes', href: '/pacientes', route: 'pacientes.index' },
    { label: 'Entradas', href: '/entradas', route: 'entradas.index' },
    { label: 'Lotes', href: '/lotes', route: 'lotes.index' },
    { label: 'Salidas', href: '/salidas', route: 'salidas.index' },
    { label: 'Inventarios', href: '/inventarios', route: 'inventarios.index' },
    { label: 'Reportes', href: '/reportes', route: 'reportes.index' },
    { label: 'Usuarios', href: '/usuarios', route: 'usuarios.index' },
    { label: 'Configuración', href: '/configuracion', route: 'configuracion.index' },
];

export default function AppLayout({
    children,
    title,
}: {
    children: ReactNode;
    title?: string;
}) {
    const page = usePage();
    const flash = page.props.flash as { success?: string; error?: string } | undefined;

    return (
        <>
            <Head title={title} />
            <div className="min-h-screen bg-slate-50">
                <aside className="fixed inset-y-0 left-0 z-40 w-56 border-r border-slate-200 bg-white">
                    <div className="flex h-14 items-center border-b border-slate-200 px-4">
                        <Link href="/" className="font-semibold text-slate-800">
                            CPROMED
                        </Link>
                    </div>
                    <nav className="flex flex-col gap-0.5 p-2">
                        {navItems.map((item) => {
                            const isActive =
                                page.url === item.href ||
                                (item.href !== '/' && page.url.startsWith(item.href));
                            return (
                                <Link
                                    key={item.route}
                                    href={item.href}
                                    className={
                                        isActive
                                            ? 'rounded-md bg-sky-100 px-3 py-2 text-sm font-medium text-sky-800'
                                            : 'rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                    }
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>
                <main className="pl-56">
                    <header className="sticky top-0 z-30 flex h-14 items-center border-b border-slate-200 bg-white/95 px-6 backdrop-blur">
                        <h1 className="text-lg font-semibold text-slate-800">{title || 'CPROMED'}</h1>
                    </header>
                    <div className="p-6">
                        {flash?.success && (
                            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                                {flash.success}
                            </div>
                        )}
                        {flash?.error && (
                            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                                {flash.error}
                            </div>
                        )}
                        {children}
                    </div>
                </main>
            </div>
        </>
    );
}
