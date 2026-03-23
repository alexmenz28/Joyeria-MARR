import { Link } from 'react-router-dom';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { useCart } from '../../context/CartContext';

/**
 * Global feedback when items are added from the catalog or product page:
 * shows which product, how many were added this tap, and totals in cart.
 */
export default function CartToast() {
  const { cartToast } = useCart();

  if (!cartToast) return null;

  const img =
    cartToast.imageUrl && cartToast.imageUrl.length > 0 ? cartToast.imageUrl : '/logo192.png';

  return (
    <div
      className="fixed bottom-4 left-4 right-4 z-[200] flex justify-center sm:left-auto sm:right-6 sm:justify-end pointer-events-none"
      aria-live="polite"
    >
      <div
        key={cartToast.toastId}
        className="pointer-events-auto flex w-full max-w-md animate-cart-toast-pop rounded-2xl border border-gold-200/80 bg-white/95 p-4 shadow-2xl backdrop-blur-md dark:border-gold-500/30 dark:bg-night-800/95"
        role="status"
      >
        <div className="flex w-full gap-3">
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-gold-100 bg-porcelain dark:border-gold-500/20 dark:bg-night-900">
            <img src={img} alt="" className="h-full w-full object-contain p-1" />
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            {cartToast.kind === 'added' ? (
              <>
                <div className="flex items-start gap-2">
                  <CheckCircleIcon className="h-5 w-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Added to cart</p>
                    <p className="mt-0.5 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{cartToast.name}</p>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-marrGold tabular-nums">+{cartToast.quantityAdded}</span>
                  {cartToast.quantityAdded !== 1 ? ' units' : ' unit'} this time ·{' '}
                  <span className="tabular-nums">{cartToast.quantityInCart}</span> of this item in cart
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                  Cart: <span className="tabular-nums font-medium text-gray-700 dark:text-gray-300">{cartToast.cartTotalPieces}</span>{' '}
                  pieces · <span className="tabular-nums">{cartToast.cartLineCount}</span>{' '}
                  {cartToast.cartLineCount === 1 ? 'product' : 'products'}
                </p>
              </>
            ) : (
              <>
                <div className="flex items-start gap-2">
                  <ExclamationCircleIcon className="h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Stock limit</p>
                    <p className="mt-0.5 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{cartToast.name}</p>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  You already have the maximum available (
                  <span className="tabular-nums font-medium">{cartToast.quantityInCart}</span> in cart).
                </p>
              </>
            )}
            <Link
              to="/cart"
              className="mt-3 inline-flex text-sm font-semibold text-gold-600 hover:text-gold-700 dark:text-gold-400 dark:hover:text-gold-300"
            >
              View cart →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
