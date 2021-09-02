import { useRouter } from 'next/router'
import classNames from 'classnames'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import Link from 'next/link'
import {
  MenuIcon,
  XIcon,
  CogIcon,
  PresentationChartBarIcon
} from '@heroicons/react/solid'

import WalletConnect from './WalletConnect.jsx'
import HideSmallBalances from './HideSmallBalances'
import CustomWallet from './CustomWallet'
import Deposit from './Deposit'
import ConnectedWallet from './ConnectedWallet'

function isActivePath(itemHref, currentPath) {
  return itemHref.startsWith(currentPath)
}

function getHref(path) {
  let query = typeof window !== 'undefined' && window.location.search ?
    window.location.search :
     ''
  return `${path}${query}`
}

const navigation = [{
  name: 'Portfolio',
  //
  // Need trailing slash because S3 routes to paths with trailing slash.
  // Otherwise the active item won't be highlighted.
  //
  href: getHref('/portfolio'),
  current: true,
  icon: PresentationChartBarIcon
}]

export default function Nav() {
  const { pathname } = useRouter()

  return (
    <Disclosure
      as="header"
      className={classNames('bg-gray-700 flex-0 flex-initial')}
    >
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="relative h-16 flex">
              <div className="relative z-20 px-2 flex flex-1 lg:px-0">
                <div className="flex-shrink-0 flex items-center">
                  <Link href="/portfolio">
                    <a>
                      <img
                        src="/img/logo-text-horizontal.svg"
                        alt="SendIt Logo"
                        width="100"
                        height="40"
                      />
                    </a>
                  </Link>
                </div>
              </div>
              <div className="relative px-2 flex items-center justify-center sm:inset-0">
                <Deposit className="ml-3" />
                <WalletConnect isNav={true} className="ml-3" />
                <div className="ml-3 hidden lg:inline-block">
                  <ConnectedWallet className="" />
                </div>
              </div>

              <div className="relative z-20 flex items-center lg:hidden">
                <Disclosure.Button className="rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="hidden lg:relative lg:z-20 lg:ml-4 lg:flex lg:items-center">
                <Menu as="div" className="flex-shrink-0 relative ml-4">
                  {({ open }) => (
                    <>
                      <div>
                        <Menu.Button className="bg-gray-700 rounded-full flex text-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                          <span className="sr-only">Open settings menu</span>
                          <CogIcon className="h-6 w-6" aria-hidden="true" />
                        </Menu.Button>
                      </div>
                      <Transition
                        show={open}
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                      >
                        <Menu.Items className="border-green-400 border-2 border-solid grid gap-4 p-4 origin-top-right absolute right-0 mt-2 rounded-md shadow-lg bg-gray-900 ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item key="hide-small-balances">
                            <HideSmallBalances />
                          </Menu.Item>
                          <Menu.Item key="custom-wallet">
                            <CustomWallet />
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </>
                  )}
                </Menu>
              </div>
            </div>
            {navigation.length > 1 &&
              <nav
                className="hidden lg:py-2 lg:flex lg:space-x-8"
                aria-label="Global"
              >
                {navigation.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <a
                      className={classNames(
                        'transition duration-250 ease-in-out hover:bg-gray-900 hover:text-white',
                        'rounded-md py-2 px-3 inline-flex items-center text-sm font-medium',
                        {
                          'bg-gray-900 text-white': isActivePath(
                            item.href,
                            pathname
                          )
                        }
                      )}
                      aria-current="page"
                    >
                      <item.icon className="h-6 w-6 mr-2" aria-hidden="true" />
                      {item.name}
                    </a>
                  </Link>
                ))}
              </nav>
            }
          </div>
          <Disclosure.Panel as="nav" className="lg:hidden" aria-label="Global">
            <div className="pt-2 pb-3 px-2 space-y-1">
              {navigation.length > 1 &&
                navigation.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <a
                      className={classNames(
                        'hover:bg-gray-700 hover:text-white',
                        'block rounded-md py-2 px-3 text-base font-medium flex',
                        {
                          'bg-gray-700 text-white': isActivePath(
                            item.href,
                            pathname
                          )
                        }
                      )}
                      aria-current="page"
                    >
                      <item.icon className="h-6 w-6 mr-3" aria-hidden="true" />
                      {item.name}
                    </a>
                  </Link>
                ))
              }
            </div>
            <div className="border-t border-gray-700 pt-4 pb-3">
              <div className="px-4 p-4 pb-2 space-y-1 text-lg">
                Account <ConnectedWallet className="display-inline" />
              </div>
              <div className="mx-4 p-4 bg-gray-900 grid gap-4 rounded-md">
                <div className="space-y-1">
                  <HideSmallBalances />
                </div>
                <div className="space-y-1">
                  <CustomWallet />
                </div>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
