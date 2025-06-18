export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  stock: number;
  imagenUrl?: string | null;
  fechaCreacion: string;
  disponible: boolean;
  material: string;
  peso: number;
  imagen: string;
  fechaActualizacion: string;
} 