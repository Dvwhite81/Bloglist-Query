const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }
  return (
    <div id="myModal">
      <div className={type}>{message}</div>
    </div>
  );
};

export default Notification;
