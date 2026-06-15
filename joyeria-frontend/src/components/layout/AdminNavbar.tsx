import { useEffect, useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useDarkMode from '../../hooks/useDarkMode';
import { isAdmin } from '../../utils/jwtRole';
import { useAuth } from '../../context/AuthContext';
import UserMenu from './UserMenu';
import UserAvatar from '../common/UserAvatar';

const adminNavigationAll = [
  { name: 'Dashboard', href: '/admin/dashboard' },
  { name: 'Products', href: '/admin/products' },
  { name: 'Orders', href: '/admin/orders' },
  { name: 'Users', href: '/admin/users' },
  { name: 'Sales', href: '/admin/sales' },
  { name: 'Settings', href: '/admin/settings' },
  { name: 'View store', href: '/' },
] as const;

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export default function AdminNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, role, logout } = useAuth();
  const [darkMode, setDarkMode] = useDarkMode();
  const [navItems, setNavItems] = useState<readonly { name: string; href: string }[]>(adminNavigationAll);

  useEffect(() => {
    setNavItems(
      isAdmin(role)
        ? adminNavigationAll
        : adminNavigationAll.filter((i) => i.href !== '/admin/users')
    );
  }, [role, location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Disclosure as="nav" className="navbar-shell">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="ml-4 flex flex-shrink-0 items-center">
                  <Link to="/admin/dashboard">
                    <img className="h-12 w-auto" src="/Logo-MARR.png" alt="Joyeria MARR" />
                  </Link>
                </div>
                <div className="hidden lg:ml-6 lg:flex lg:space-x-6">
                  {navItems.map((item) => (
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
                <button
                  type="button"
                  onClick={() => setDarkMode(!darkMode)}
                  className="icon-btn bg-porcelain dark:bg-night-800"
                  title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {darkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
                </button>
                {isAuthenticated && <UserMenu role={role} onLogout={handleLogout} />}
              </div>
              <div className="flex items-center gap-1 sm:hidden">
                <button type="button" onClick={() => setDarkMode(!darkMode)} className="icon-btn">
                  {darkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
                </button>
                <Disclosure.Button className="icon-btn focus:ring-2 focus:ring-inset focus:ring-gold-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="overflow-hidden transition-all duration-200 ease-out lg:hidden">
            <div className="animate-mobile-menu-in space-y-1 border-t border-gold-500/15 bg-ivory/80 pb-3 pt-2 dark:bg-night-800/80">
              {navItems.map((item) => (
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
            {isAuthenticated && (
              <div className="border-t border-gold-500/15 pb-3 pt-4 dark:border-gold-500/20">
                <div className="flex items-center gap-3 px-4">
                  <UserAvatar className="h-10 w-10" />
                  <span className="text-base font-medium text-marrGold">Administrator</span>
                </div>
                <div className="mt-3">
                  <Disclosure.Button
                    as="button"
                    type="button"
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-base font-medium text-marrGold hover:bg-marrGold/10"
                  >
                    Log out
                  </Disclosure.Button>
                </div>
              </div>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
