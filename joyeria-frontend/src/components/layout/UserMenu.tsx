import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Link } from 'react-router-dom';
import UserAvatar from '../common/UserAvatar';
import { isAdminOrEmployee } from '../../utils/jwtRole';

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

type UserMenuProps = {
  role: string | undefined;
  onLogout: () => void;
};

export default function UserMenu({ role, onLogout }: UserMenuProps) {
  const staff = isAdminOrEmployee(role);

  return (
    <Menu as="div" className="relative ml-3 shrink-0">
      <Menu.Button className="flex h-9 w-9 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-ivory dark:focus:ring-offset-night-900">
        <span className="sr-only">Open user menu</span>
        <UserAvatar />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          modal={false}
          anchor="bottom end"
          className="menu-dropdown"
        >
          {staff ? (
            <Menu.Item>
              {({ focus }) => (
                <Link to="/admin/dashboard" className={cn('menu-item', focus && 'menu-item-active')}>
                  Dashboard
                </Link>
              )}
            </Menu.Item>
          ) : (
            <>
              <Menu.Item>
                {({ focus }) => (
                  <Link to="/profile" className={cn('menu-item', focus && 'menu-item-active')}>
                    Your profile
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ focus }) => (
                  <Link to="/orders" className={cn('menu-item', focus && 'menu-item-active')}>
                    My orders
                  </Link>
                )}
              </Menu.Item>
            </>
          )}
          <Menu.Item>
            {({ focus }) => (
              <button
                type="button"
                onClick={onLogout}
                className={cn('menu-item', focus && 'menu-item-active')}
              >
                Log out
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
