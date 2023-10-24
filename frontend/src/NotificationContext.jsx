import { useReducer, createContext, useContext } from 'react'

const NotificationContext = createContext(null)

export const notificationReducer = (state, action) => {
  switch (action.type) {
  case 'SET_NOTIFICATION':
    return {
      message: action.notification.message,
      class: action.notification.class
    }
  case 'CLEAR_NOTIFICATION':
    return null
  default:
    return state
  }
}

export const useNotifications = () => {
  const [notification, notificationDispatch] = useContext(NotificationContext)

  const setNotification = (notification) => {
    notificationDispatch({
      type: 'SET_NOTIFICATION',
      notification
    })
    setTimeout(() => {
      notificationDispatch({
        type: 'CLEAR_NOTIFICATION'
      })
    }, 5000)
  }

  return { notification, setNotification }
}

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, null)

  return (
    <NotificationContext.Provider value={ [notification, notificationDispatch] }>
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext
