import { Fragment, useEffect, useState } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ShoppingCartIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const userNavigation = [
  { name: 'Inicio', href: '/' },
  { name: 'Catálogo', href: '/catalogo' },
  { name: 'Contacto', href: '/contacto' },
];

const adminNavigation = [
    { name: 'Dashboard', href: '/admin/dashboard' },
    { name: 'Productos', href: '/admin/productos' },
    { name: 'Pedidos', href: '/admin/pedidos' },
    { name: 'Usuarios', href: '/admin/usuarios' },
    { name: 'Ventas', href: '/admin/ventas' },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      try {
        const decoded: any = jwtDecode(token);
        setUserRole(decoded.role);
      } catch {
        setUserRole(null);
      }
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
    }
  }, [location]);

  useEffect(() => {
    // Detectar preferencia del usuario o del sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
    document.documentElement.classList.toggle('dark', prefersDark);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserRole(null);
    navigate('/');
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      document.documentElement.classList.toggle('dark', !prev);
      return !prev;
    });
  };

  const navigation = userRole === 'admin' ? adminNavigation : userNavigation;

  return (
    <Disclosure as="nav" className="sticky top-0 z-50 bg-white dark:bg-gradient-to-br dark:from-[#181c2a] dark:via-[#23263a] dark:to-[#1a1d2b] shadow transition-colors">
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
                      alt="Joyeria Logo"
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
                {userRole !== 'admin' && (
                    <Link
                    to="/carrito"
                    className="rounded-full bg-transparent p-1 text-marrGold hover:text-marrGold focus:outline-none focus:ring-2 focus:ring-marrGold focus:ring-offset-2 transition-colors"
                    >
                    <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
                    </Link>
                )}
                <button
                  onClick={toggleDarkMode}
                  className="rounded-full p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-marrGold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  title={darkMode ? 'Modo claro' : 'Modo oscuro'}
                >
                  {darkMode ? (
                    <SunIcon className="h-6 w-6" />
                  ) : (
                    <MoonIcon className="h-6 w-6" />
                  )}
                </button>
                {!isAuthenticated ? (
                  <button
                    onClick={() => navigate('/iniciar-sesion')}
                    className="ml-4 px-4 py-2 bg-[#bfa14a] text-white rounded-md hover:bg-[#a88c32] transition-colors duration-200 shadow"
                  >
                    Iniciar sesión
                  </button>
                ) : (
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                        <span className="sr-only">Abrir menú de usuario</span>
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
                        
                        {userRole === 'admin' ? (
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
                                    <Link to="/perfil" className={classNames(active ? 'bg-gray-100 dark:bg-gray-700' : '', 'block px-4 py-2 text-sm text-gray-700 dark:text-gray-200')}>
                                    Tu Perfil
                                    </Link>
                                )}
                                </Menu.Item>
                                <Menu.Item>
                                {({ active }) => (
                                    <Link to="/mis-pedidos" className={classNames(active ? 'bg-gray-100 dark:bg-gray-700' : '', 'block px-4 py-2 text-sm text-gray-700 dark:text-gray-200')}>
                                    Mis Pedidos
                                    </Link>
                                )}
                                </Menu.Item>
                            </>
                        )}
                        
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={classNames(
                                active ? 'bg-gray-100 dark:bg-gray-700' : '',
                                'block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200'
                              )}
                            >
                              Cerrar Sesión
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                )}
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                  <span className="sr-only">Abrir menú principal</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
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
                    onClick={() => navigate('/iniciar-sesion')}
                    className="w-full px-4 py-2 bg-marrGold text-white rounded-md hover:bg-marrGold/80 transition-colors duration-200 shadow"
                  >
                    Iniciar sesión
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
                    <div className="text-base font-medium text-marrGold">Usuario</div>
                  </div>
                </div>
              )}
              {isAuthenticated && (
                <div className="mt-3 space-y-1">

                {userRole === 'admin' ? (
                    <Disclosure.Button as={Link} to="/admin/dashboard" className="block px-4 py-2 text-base font-medium text-marrGold hover:bg-marrGold/10 hover:text-marrGold">
                        Dashboard
                    </Disclosure.Button>
                ): (
                    <>
                        <Disclosure.Button as={Link} to="/perfil" className="block px-4 py-2 text-base font-medium text-marrGold hover:bg-marrGold/10 hover:text-marrGold">
                            Tu Perfil
                        </Disclosure.Button>
                        <Disclosure.Button as={Link} to="/mis-pedidos" className="block px-4 py-2 text-base font-medium text-marrGold hover:bg-marrGold/10 hover:text-marrGold">
                            Mis Pedidos
                        </Disclosure.Button>
                    </>
                )}


                  <Disclosure.Button
                    as="button"
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-base font-medium text-marrGold hover:bg-marrGold/10 hover:text-marrGold"
                  >
                    Cerrar Sesión
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