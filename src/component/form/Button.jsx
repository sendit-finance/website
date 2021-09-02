import classNames from 'classnames'
import styles from '@/component/form/Button.module.css'

export function ButtonDefault({ children, className, onClick = () => {}, disabled }) {
  return (
    <button
      className={classNames(styles['button-default'], className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export function ButtonHighlight({ children, className, onClick = () => {}, disabled }) {
  return (
    <button
      className={classNames(styles['button-highlight'], className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
