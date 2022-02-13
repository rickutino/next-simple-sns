import { Alert, Snackbar } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

interface Notification {
  isOpen: boolean,
  message: string,
  type: 'success' | 'info' | 'warning' | 'error'
}

interface NotificationProps {
  notify: Notification,
  setNotify: Dispatch<SetStateAction<Notification>>,
}

export default function Notification({notify, setNotify}: NotificationProps) {
  const handleClose = (event: React.SyntheticEvent, reason?) => {
    // アラートのそのにクリックしても閉じない方法。
    // if (reason === 'clickaway') {
    //   return;
    // }

    setNotify({
      ...notify,
      isOpen: false
    })
  }
  return (
    <Snackbar
      open={notify.isOpen}
      autoHideDuration={3000}
      anchorOrigin={{vertical: "top", horizontal: "right"}}
      onClose={handleClose}
    >
      <Alert
        variant="filled"
        severity={notify.type}
        onClose={handleClose}
      >
        {notify.message}
      </Alert>
    </Snackbar>
  )
}
