import classnames from 'classnames'

export function Th({ onClick = () => {}, className = '', children }) {
  return (
    <th
      scope="col"
      className={classnames(
        className,
        'px-4 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer'
      )}
      onClick={onClick}
    >
      {children}
    </th>
  )
}
