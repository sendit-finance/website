import { useState } from 'react'
import { usePopper } from 'react-popper'
import { connect } from 'redux-zero/react'
import classnames from 'classnames'
import { Transition, Popover } from '@headlessui/react'
import actions from '@/actions/wallet'
import * as Wallets from '@/util/wallets'
import { ButtonDefault, ButtonHighlight } from '@/component/form/Button'
import buttonStyles from '@/component/form/Button.module.css'

const visibleWallets = () =>
  Object.keys(Wallets)
    .filter((name) => {
      return !Wallets[name].isHidden
    })
    .sort((name) => {
      return !Wallets[name].isExtension ||
        (Wallets[name].isExtension && Wallets[name].isInstalled)
        ? -1
        : 1
    })
    .sort((name) => {
      return (name === 'SendIt' || name === 'Phantom') ? -1 : 1
    })

const mapToProps = ({ connected }) => ({ connected })

export default connect(
  mapToProps,
  actions
)(
  ({
    connected,
    connectWallet,
    disconnectWallet,
    className,
    loginText = 'Login',
    logoutText = 'Logout',
    isNav = false
  }) => {
    let [referenceElement, setReferenceElement] = useState()
    let [popperElement, setPopperElement] = useState()

    let { styles, attributes, update } = usePopper(
      referenceElement,
      popperElement,
      {
        placement: isNav ? 'bottom-end' : 'bottom',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [1, 6]
            }
          }
        ]
      }
    )

    const Button = isNav ? ButtonDefault : ButtonHighlight
    if (connected) {
      return (
        <Button onClick={disconnectWallet} className="ml-2">
          {logoutText}
        </Button>
      )
    }

    return (
      <div>
        <Popover>
          {({ open }) => (
            <>
              <Popover.Button
                as="button"
                ref={setReferenceElement}
                className={classnames(
                  {
                    'text-opacity-90': !open
                  },
                  isNav
                    ? buttonStyles['button-default']
                    : buttonStyles['button-highlight'],
                  className
                )}
              >
                {loginText}
              </Popover.Button>
              <div
                ref={setPopperElement}
                style={styles.popper}
                {...attributes.popper}
                className="z-20"
              >
                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                  beforeEnter={() => update()}
                >
                  <Popover.Panel static>
                    <div className="border-green-400 border-2 border-solid bg-gray-900 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                      <div className="relative grid gap-8 p-7">
                        {visibleWallets().map((name) => {
                          const uninstalled =
                            Wallets[name].isExtension &&
                            !Wallets[name].isInstalled
                          const classNames = classnames(
                            uninstalled ? 'opacity-30' : '',
                            'flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-gray-800 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50'
                          )
                          return (
                            <a
                              onClick={() => {
                                referenceElement.click()
                                connectWallet(name)
                              }}
                              href="##"
                              key={name}
                              className={classNames}
                            >
                              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-white sm:h-12 sm:w-12">
                                <img
                                  src={
                                    '/img/brands/' +
                                    (
                                      Wallets[name].imgName || name
                                    ).toLowerCase() +
                                    '.png'
                                  }
                                  aria-hidden="true"
                                />
                              </div>
                              <div className="ml-4">
                                <p className="text-sm font-medium text-gray-100 whitespace-nowrap">
                                  {Wallets[name].displayName ?? name}
                                </p>
                              </div>
                            </a>
                          )
                        })}
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition>
              </div>
            </>
          )}
        </Popover>
      </div>
    )
  }
)
