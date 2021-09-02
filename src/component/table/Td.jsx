import classnames from 'classnames'

export function Td({ className, children }) {
  return (
    <td
      className={classnames('px-4 md:px-6 py-4 whitespace-nowrap', className)}
    >
      {children}
    </td>
  )
}
