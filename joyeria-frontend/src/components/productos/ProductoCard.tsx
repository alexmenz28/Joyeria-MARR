import { Link } from 'react-router-dom';

interface ProductoCardProps {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl?: string;
  categoria?: string;
}

export default function ProductoCard({
  id,
  nombre,
  descripcion,
  precio,
  imagenUrl,
  categoria,
}: ProductoCardProps) {
  return (
    <div className="group relative">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
        <img
          src={imagenUrl}
          alt={nombre}
          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <Link to={`/producto/${id}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {nombre}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-gray-500">{categoria}</p>
        </div>
        <p className="text-sm font-medium text-gray-900">${precio}</p>
      </div>
    </div>
  );
} 