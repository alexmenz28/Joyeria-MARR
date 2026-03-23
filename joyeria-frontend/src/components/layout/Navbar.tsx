import { Fragment, useEffect, useState } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ShoppingCartIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import useDarkMode from '../../hooks/useDarkMode';
import { getJwtRole, isAdmin, isAdminOrEmployee } from '../../utils/jwtRole';
import { useCart } from '../../context/CartContext';

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

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount, cartToast } = useCart();
  const [cartBadgePulse, setCartBadgePulse] = useState(0);

  useEffect(() => {
    if (cartToast?.kind === 'added') setCartBadgePulse((k) => k + 1);
  }, [cartToast]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useDarkMode();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      try {
        const decoded = jwtDecode<Record<string, unknown>>(token);
        setUserRole(getJwtRole(decoded) ?? null);
      } catch {
        setUserRole(null);
      }
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserRole(null);
    navigate('/');
  };

  const adminNavForUser = isAdmin(userRole ?? undefined)
    ? adminNavigation
    : adminNavigation.filter((item) => item.href !== '/admin/users');
  const navigation = isAdminOrEmployee(userRole ?? undefined) ? adminNavForUser : userNavigation;

  return (
    <Disclosure
      as="nav"
      className="sticky top-0 z-50 bg-ivory/95 dark:bg-gradient-to-br dark:from-night-900 dark:via-night-800 dark:to-night-900 backdrop-blur border-b border-gold-500/20 shadow-sm transition-colors"
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center ml-4">
                  <Link to="/">
                    <img
                      className="h-12 w-auto"
                      src="/Logo-MARR.png"
                      alt="Joyeria MARR"
                    />
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={classNames(
                        location.pathname === item.href
                          ? 'border-b-2 border-marrGold text-marrGold'
                          : 'border-b-2 border-transparent text-marrGold/70 hover:border-marrGold hover:text-marrGold',
                        'inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200'
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center gap-4">
                {!isAdminOrEmployee(userRole ?? undefined) && (
                  <Link
                    to="/cart"
                    className="relative rounded-full bg-transparent p-1 text-marrGold hover:text-marrGold focus:outline-none focus:ring-2 focus:ring-marrGold focus:ring-offset-2 transition-colors"
                    aria-label={`Shopping cart${itemCount > 0 ? `, ${itemCount} items` : ''}`}
                  >
                    <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
                    {itemCount > 0 && (
                      <span
                        key={cartBadgePulse}
                        className={`absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-gold-600 px-1 text-[11px] font-bold leading-none text-white ${cartBadgePulse > 0 ? 'animate-cart-badge-pulse' : ''}`}
                      >
                        {itemCount > 99 ? '99+' : itemCount}
                      </span>
                    )}
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => setDarkMode(!darkMode)}
                  className="rounded-full p-2 bg-porcelain dark:bg-night-800 text-gray-700 dark:text-marrGold hover:bg-gold-50 dark:hover:bg-night-700 transition-colors duration-200"
                  title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {darkMode ? (
                    <SunIcon className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MoonIcon className="h-6 w-6" aria-hidden="true" />
                  )}
                </button>
                {!isAuthenticated ? (
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="ml-4 px-4 py-2 bg-gold-500 text-white rounded-full hover:bg-gold-600 transition-colors duration-200 shadow-md"
                  >
                    Log in
                  </button>
                ) : (
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt=""
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:text-white">
                        {isAdminOrEmployee(userRole ?? undefined) ? (
                          <Menu.Item>
                            {({ active }) => (
                              <Link to="/admin/dashboard" className={classNames(active ? 'bg-gray-100 dark:bg-gray-700' : '', 'block px-4 py-2 text-sm text-gray-700 dark:text-gray-200')}>
                                Dashboard
                              </Link>
                            )}
                          </Menu.Item>
                        ) : (
                          <>
                            <Menu.Item>
                              {({ active }) => (
                                <Link to="/profile" className={classNames(active ? 'bg-gray-100 dark:bg-gray-700' : '', 'block px-4 py-2 text-sm text-gray-700 dark:text-gray-200')}>
                                  Your profile
                                </Link>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <Link to="/orders" className={classNames(active ? 'bg-gray-100 dark:bg-gray-700' : '', 'block px-4 py-2 text-sm text-gray-700 dark:text-gray-200')}>
                                  My orders
                                </Link>
                              )}
                            </Menu.Item>
                          </>
                        )}
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              type="button"
                              onClick={handleLogout}
                              className={classNames(
                                active ? 'bg-gray-100 dark:bg-gray-700' : '',
                                'block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200'
                              )}
                            >
                              Log out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                )}
              </div>
              <div className="flex items-center gap-1 sm:hidden">
                {!isAdminOrEmployee(userRole ?? undefined) && (
                  <Link
                    to="/cart"
                    className="relative rounded-full p-2 text-marrGold/80 hover:text-marrGold hover:bg-gold-50 dark:hover:bg-night-700 transition-colors duration-200"
                    aria-label="Cart"
                  >
                    <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
                    {itemCount > 0 && (
                      <span
                        key={cartBadgePulse}
                        className={`absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-600 px-0.5 text-[10px] font-bold text-white ${cartBadgePulse > 0 ? 'animate-cart-badge-pulse' : ''}`}
                      >
                        {itemCount > 9 ? '9+' : itemCount}
                      </span>
                    )}
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => setDarkMode(!darkMode)}
                  className="rounded-full p-2 text-marrGold/80 hover:text-marrGold hover:bg-gold-50 dark:hover:bg-night-700 transition-colors duration-200"
                  title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {darkMode ? (
                    <SunIcon className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MoonIcon className="h-6 w-6" aria-hidden="true" />
                  )}
                </button>
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-marrGold/80 hover:bg-gold-50 dark:hover:bg-night-700 hover:text-marrGold focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gold-500 transition-colors duration-200">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden overflow-hidden transition-all duration-200 ease-out">
            <div className="animate-mobile-menu-in space-y-1 pb-3 pt-2 bg-ivory/50 dark:bg-night-800/50">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className={classNames(
                    location.pathname === item.href
                      ? 'bg-marrGold/20 border-l-4 border-marrGold text-marrGold'
                      : 'border-transparent text-marrGold/70 hover:text-marrGold',
                    'block py-2 pl-3 pr-4 text-base font-medium transition-colors duration-200'
                  )}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className="border-t border-gray-200 pb-3 pt-4">
              {!isAuthenticated ? (
                <div className="flex items-center px-4">
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="w-full px-4 py-2 bg-marrGold text-white rounded-md hover:bg-marrGold/80 transition-colors duration-200 shadow"
                  >
                    Log in
                  </button>
                </div>
              ) : (
                <div className="flex items-center px-4">
                  <img
                    className="h-10 w-10 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                  <div className="ml-3">
                    <div className="text-base font-medium text-marrGold">Account</div>
                  </div>
                </div>
              )}
              {isAuthenticated && (
                <div className="mt-3 space-y-1">
                  {isAdminOrEmployee(userRole ?? undefined) ? (
                    <Disclosure.Button as={Link} to="/admin/dashboard" className="block px-4 py-2 text-base font-medium text-marrGold hover:bg-marrGold/10 hover:text-marrGold">
                      Dashboard
                    </Disclosure.Button>
                  ) : (
                    <>
                      <Disclosure.Button as={Link} to="/profile" className="block px-4 py-2 text-base font-medium text-marrGold hover:bg-marrGold/10 hover:text-marrGold">
                        Your profile
                      </Disclosure.Button>
                      <Disclosure.Button as={Link} to="/orders" className="block px-4 py-2 text-base font-medium text-marrGold hover:bg-marrGold/10 hover:text-marrGold">
                        My orders
                      </Disclosure.Button>
                    </>
                  )}
                  <Disclosure.Button
                    as="button"
                    type="button"
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-base font-medium text-marrGold hover:bg-marrGold/10 hover:text-marrGold"
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
