import { Fragment } from 'react'
import { Transition } from '@headlessui/react'
import { XIcon, ExternalLinkIcon } from '@heroicons/react/solid'
import { connect } from 'redux-zero/react'
import notificationActions from '@/actions/notification'
import { ButtonHighlight } from '@/component/form/Button'
const mapToProps = ({ notifications }) => ({ notifications })

export default connect(
  mapToProps,
  notificationActions
)(({ notifications, hideNotification }) => {
  return (
    <>
      <div
        aria-live="assertive"
        className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-20"
      >
        <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
          {notifications.map((notification, idx) => {
            return (
              <Transition
                key={`notification-${idx}`}
                show={true}
                as={Fragment}
                enter="transform ease-out duration-300 transition"
                enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                enterTo="translate-y-0 opacity-100 sm:translate-x-0"
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="border-green-400 border-2 border-solid bg-gray-900 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <notification.icon
                          className="h-6 w-6 text-green-400"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-medium text-gray-100 overflow-ellipsis overflow-hidden">
                          {notification.title}
                        </p>
                        <p className="mt-1 text-sm text-gray-100">
                          {notification.message}
                        </p>
                        {notification.linkHref && (
                          <p className="mt-1 text-sm text-gray-100 underline">
                            <a target="_blank" href={notification.linkHref}>
                              {notification.linkText || notification.linkHref}
                              {!/sendit\.finance|localhost/i.test(notification.linkHref) && (
                                <ExternalLinkIcon className="w-4 h-4 inline-block ml-1"/>
                              )}
                            </a>
                          </p>
                        )}
                        {notification?.action?.message && (
                          <ButtonHighlight
                            className="mt-2 text-opacity-90 text-white transition-colors duration-250 inline-flex justify-center px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-300 bg-green-300 hover:bg-green-400 hover:text-gray-900 text-gray-900"
                            onClick={notification?.action?.onClick}
                          >
                            {notification.action.message}
                          </ButtonHighlight>
                        )}
                      </div>
                      <div className="ml-4 flex-shrink-0 flex">
                        <button
                          className="rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          onClick={() => {
                            hideNotification(notification.id)
                          }}
                        >
                          <span className="sr-only">Close</span>
                          <XIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition>
            )
          })}
        </div>
      </div>
    </>
  )
})
