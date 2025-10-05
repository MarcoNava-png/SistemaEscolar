// src/features/admisiones/types/Catalogs.ts
export interface CatalogOption {
  id: number;
  nombre: string;
}

export interface SelectOption {
  value: number;
  label: string;
}

export interface CodigoPostalOption {
  id: number;     // codigoPostalId
  codigo: string; // "37000"
  asentamiento?: string;
  municipio?: string;
  estado?: string;
}

// (opcionales)
export interface GeneroOption extends CatalogOption {}
export interface CampusOption extends CatalogOption {}
export interface PlanEstudiosOption extends CatalogOption { nivel?: number }
export interface AspiranteStatusOption extends CatalogOption {}
export interface MedioContactoOption extends CatalogOption {}
export interface HorarioOption extends CatalogOption {}
