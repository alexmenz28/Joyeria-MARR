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
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-md dark:shadow-xl flex items-center justify-center border border-gray-100 dark:border-gray-600 transition-colors">
        <img
          src={imagenUrl && imagenUrl.length > 0 ? imagenUrl : '/logo192.png'}
          alt={nombre}
          className="max-h-48 w-auto object-contain object-center"
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-marrGold font-semibold">
            <Link to={`/producto/${id}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {nombre}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{categoria}</p>
        </div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">${precio}</p>
      </div>
    </div>
  );
} 