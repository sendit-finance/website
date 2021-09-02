import { useState } from 'react'
import { Switch } from '@headlessui/react'
import classnames from 'classnames'

export default function Toggle({
  onChange = () => {},
  checked = false,
  className = ''
}) {
  const [enabled, setEnabled] = useState(checked)

  function _onChange(...args) {
    setEnabled(...args)
    onChange(...args)
  }

  return (
    <Switch
      checked={enabled}
      onChange={_onChange}
      className={classnames(
        className,
        'flex-shrink-0 group relative rounded-full inline-flex items-center justify-center h-5 w-10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-300'
      )}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute w-full h-full rounded-md"
      />
      <span
        aria-hidden="true"
        className={classnames(
          enabled ? 'bg-green-300' : 'bg-gray-200',
          'pointer-events-none absolute h-4 w-9 mx-auto rounded-full transition-colors ease-in-out duration-200'
        )}
      />
      <span
        aria-hidden="true"
        className={classnames(
          enabled ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none absolute left-0 inline-block h-5 w-5 border border-gray-200 rounded-full bg-white shadow transform ring-0 transition-transform ease-in-out duration-200'
        )}
      />
    </Switch>
  )
}
