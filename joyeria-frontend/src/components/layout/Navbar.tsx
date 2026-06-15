import { useEffect, useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ShoppingCartIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useDarkMode from '../../hooks/useDarkMode';
import { isAdmin, isAdminOrEmployee } from '../../utils/jwtRole';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import UserMenu from './UserMenu';
import UserAvatar from '../common/UserAvatar';

const userNavigation = [
  { name: 'Home', href: '/' },
  { name: 'Catalog', href: '/catalog' },
  { name: 'Custom order', href: '/custom-order' },
  { name: 'Contact', href: '/contact' },
];

const adminNavigation = [
  { name: 'Dashboard', href: '/admin/dashboard' },
  { name: 'Products', href: '/admin/products' },
  { name: 'Orders', href: '/admin/orders' },
  { name: 'Users', href: '/admin/users' },
  { name: 'Sales', href: '/admin/sales' },
];

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount, cartToast } = useCart();
  const { isAuthenticated, role: userRole, logout } = useAuth();
  const [cartBadgePulse, setCartBadgePulse] = useState(0);
  const [darkMode, setDarkMode] = useDarkMode();

  useEffect(() => {
    if (cartToast?.kind === 'added') setCartBadgePulse((k) => k + 1);
  }, [cartToast]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const adminNavForUser = isAdmin(userRole)
    ? adminNavigation
    : adminNavigation.filter((item) => item.href !== '/admin/users');
  const navigation = isAdminOrEmployee(userRole) ? adminNavForUser : userNavigation;

  return (
    <Disclosure as="nav" className="navbar-shell">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="ml-4 flex flex-shrink-0 items-center">
                  <Link to={isAdminOrEmployee(userRole) ? '/admin/dashboard' : '/'}>
                    <img className="h-12 w-auto" src="/Logo-MARR.png" alt="Joyeria MARR" />
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        'nav-link',
                        location.pathname === item.href ? 'nav-link-active' : 'nav-link-idle'
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center sm:gap-3">
                {!isAdminOrEmployee(userRole) && (
                  <Link
                    to="/cart"
                    className="icon-btn relative"
                    aria-label={`Shopping cart${itemCount > 0 ? `, ${itemCount} items` : ''}`}
                  >
                    <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
                    {itemCount > 0 && (
                      <span
                        key={cartBadgePulse}
                        className={cn(
                          'absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-gold-600 px-1 text-[11px] font-bold leading-none text-white',
                          cartBadgePulse > 0 && 'animate-cart-badge-pulse'
                        )}
                      >
                        {itemCount > 99 ? '99+' : itemCount}
                      </span>
                    )}
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => setDarkMode(!darkMode)}
                  className="icon-btn bg-porcelain dark:bg-night-800"
                  title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {darkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
                </button>
                {!isAuthenticated ? (
                  <button type="button" onClick={() => navigate('/login')} className="btn-marr !rounded-full !py-2">
                    Log in
                  </button>
                ) : (
                  <UserMenu role={userRole} onLogout={handleLogout} />
                )}
              </div>
              <div className="flex items-center gap-1 sm:hidden">
                {!isAdminOrEmployee(userRole) && (
                  <Link to="/cart" className="icon-btn relative" aria-label="Cart">
                    <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
                    {itemCount > 0 && (
                      <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-600 px-0.5 text-[10px] font-bold text-white">
                        {itemCount > 9 ? '9+' : itemCount}
                      </span>
                    )}
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => setDarkMode(!darkMode)}
                  className="icon-btn"
                  title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {darkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
                </button>
                <Disclosure.Button className="icon-btn focus:ring-2 focus:ring-inset focus:ring-gold-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="overflow-hidden transition-all duration-200 ease-out sm:hidden">
            <div className="animate-mobile-menu-in space-y-1 border-t border-gold-500/15 bg-ivory/80 pb-3 pt-2 dark:bg-night-800/80">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className={cn(
                    'block py-2 pl-3 pr-4 text-base font-medium transition-colors duration-200',
                    location.pathname === item.href
                      ? 'border-l-4 border-marrGold bg-marrGold/15 text-marrGold'
                      : 'border-l-4 border-transparent text-marrGold/70 hover:text-marrGold'
                  )}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className="border-t border-gold-500/15 pb-3 pt-4 dark:border-gold-500/20">
              {!isAuthenticated ? (
                <div className="px-4">
                  <button type="button" onClick={() => navigate('/login')} className="btn-marr w-full">
                    Log in
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 px-4">
                  <UserAvatar className="h-10 w-10" />
                  <span className="text-base font-medium text-marrGold">Account</span>
                </div>
              )}
              {isAuthenticated && (
                <div className="mt-3 space-y-1">
                  {isAdminOrEmployee(userRole ?? undefined) ? (
                    <Disclosure.Button
                      as={Link}
                      to="/admin/dashboard"
                      className="block px-4 py-2 text-base font-medium text-marrGold hover:bg-marrGold/10"
                    >
                      Dashboard
                    </Disclosure.Button>
                  ) : (
                    <>
                      <Disclosure.Button as={Link} to="/profile" className="block px-4 py-2 text-base font-medium text-marrGold hover:bg-marrGold/10">
                        Your profile
                      </Disclosure.Button>
                      <Disclosure.Button as={Link} to="/orders" className="block px-4 py-2 text-base font-medium text-marrGold hover:bg-marrGold/10">
                        My orders
                      </Disclosure.Button>
                    </>
                  )}
                  <Disclosure.Button
                    as="button"
                    type="button"
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-base font-medium text-marrGold hover:bg-marrGold/10"
                  >
                    Log out
                  </Disclosure.Button>
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
