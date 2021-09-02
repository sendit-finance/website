import { CheckCircleIcon } from '@heroicons/react/outline'

const hideNotification = ({ getState, setState, id }) => {
  const notifications = getState().notifications
  setState({
    notifications: notifications.filter(
      (notification) => notification.id !== id
    )
  })
}

const actions = ({ setState, getState }) => ({
  addNotification: (
    _state,
    notification = {
      title: 'Notification',
      message: 'Please confirm',
      action: {},
      linkHref: undefined,
      linkText: undefined,
      icon: undefined,
      autoHide: false
    }
  ) => {
    notification.id = Math.random().toString(36).substr(2, 9)

    if (!notification.icon) notification.icon = CheckCircleIcon

    const notifications = getState().notifications
    setState({
      notifications: notifications.concat(notification)
    })

    if (notification.autoHide) {
      setTimeout(() => {
        hideNotification({ getState, setState, id: notification.id })
      }, 8000)
    }

    return notification.id
  },
  hideNotification(_state, id) {
    hideNotification({ getState, setState, id })
  }
})

export default actions
