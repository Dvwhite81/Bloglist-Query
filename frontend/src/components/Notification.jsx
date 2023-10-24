import { useNotifications } from '../NotificationContext'

const Notification = () => {
  const { notification } = useNotifications()
  if (notification === null) {
    return null
  }
  return (
    <div id="myModal">
      <div className={notification.class}>{notification.message}</div>
    </div>
  )
}

export default Notification
