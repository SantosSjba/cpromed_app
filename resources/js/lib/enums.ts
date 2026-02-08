export const FORMA_FARMACEUTICA = [
    'Tableta', 'Cápsula', 'Jarabe', 'Suspensión', 'Inyectable',
    'Crema', 'Ungüento', 'Gotas', 'Óvulo', 'Supositorio', 'Parche',
    'Inhalador', 'Otro',
] as const;

export const VIA_ADMINISTRACION = [
    'Oral', 'Tópica', 'Parenteral', 'Inhalatoria', 'Rectal', 'Vaginal',
    'Oftálmica', 'Ótica', 'Nasal', 'Sublingual', 'Otro',
] as const;

export const TIPO_PRESENTACION = [
    'Tableta/Cápsula', 'Blister', 'Frasco', 'Caja', 'Paquete',
    'Ampolla', 'Vial', 'Tubo', 'Sachet', 'Otro',
] as const;
