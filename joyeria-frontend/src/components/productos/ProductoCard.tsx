import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  id: number;
  name: string;
  /** Optional; reserved for future detail preview */
  description?: string;
  price: number;
  imageUrl?: string;
  category?: string;
  stock?: number;
  isAvailable?: boolean;
}

export default function ProductoCard({
  id,
  name,
  price,
  imageUrl,
  category,
  stock = 0,
  isAvailable = true,
}: ProductCardProps) {
  const { addItem } = useCart();
  const canAdd = isAvailable && stock > 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canAdd) return;
    addItem({
      productId: id,
      name,
      price,
      imageUrl,
      stock,
      quantity: 1,
    });
  };

  return (
    <div className="group relative flex flex-col">
      <Link to={`/product/${id}`} className="block flex-1">
        <div className="aspect-h-1 aspect-w-1 flex w-full items-center justify-center overflow-hidden rounded-lg border border-gold-100/40 bg-white shadow-md transition-all duration-200 group-hover:-translate-y-1 group-hover:border-gold-200 group-hover:shadow-xl dark:border-gold-500/10 dark:bg-night-800 dark:shadow-lg dark:group-hover:border-gold-500/30">
          <img
            src={imageUrl && imageUrl.length > 0 ? imageUrl : '/logo192.png'}
            alt={name}
            className="max-h-48 w-auto object-contain object-center transition-transform duration-200 group-hover:scale-[1.02]"
            style={{ maxWidth: '100%', maxHeight: '100%' }}
          />
        </div>
        <div className="mt-4 flex justify-between">
          <div>
            <h3 className="text-sm text-marrGold font-semibold">{name}</h3>
            <p className="mt-1 text-sm text-muted">{category}</p>
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">${Number(price).toFixed(2)}</p>
        </div>
      </Link>
      <button
        type="button"
        onClick={handleAdd}
        disabled={!canAdd}
        className="btn-marr mt-3 w-full !py-2 text-sm disabled:cursor-not-allowed"
      >
        {canAdd ? 'Add to cart' : 'Unavailable'}
      </button>
    </div>
  );
}
