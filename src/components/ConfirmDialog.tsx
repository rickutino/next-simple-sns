import { Dispatch, SetStateAction } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Theme,
  IconButton
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { GiExitDoor } from 'react-icons/gi';

interface DialogData {
  isOpen: boolean;
  title: string;
  onConfirm?(): void;
}

interface DialogProps {
  confirmDialog: DialogData;
  setConfirmDialog: Dispatch<SetStateAction<DialogData>>;
}

const useStyles = makeStyles((theme: Theme) => ({
  dialog: {
    padding: theme.spacing(3),
    position: 'absolute',
    top: theme.spacing(10)
  },
  dialogTitle: {
    textAlign: 'center'
  },
  dialogContent: {
    textAlign: 'center'
  },
  dialogAction: {
    justifyContent: 'center'
  },
  titleIcon: {
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.secondary.main,
    '&:hover': {
      backgroundColor: theme.palette.secondary.light,
      cursor: 'default'
    },
    '& .MuiButtonBase-root': {
      fontSize: '8rem'
    }
  }
}));

export default function ConfirmDialog({
  confirmDialog,
  setConfirmDialog
}: DialogProps) {
  const classes = useStyles();
  const handleClose = () => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    });
  };

  return (
    <Dialog
      open={confirmDialog.isOpen}
      className={classes.dialog}
      onClick={handleClose}
    >
      <DialogTitle className={classes.dialogTitle}>
        <IconButton disableRipple className={classes.titleIcon}>
          <GiExitDoor className="MuiButtonBase-root" />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Typography variant="h6">{confirmDialog.title}</Typography>
      </DialogContent>
      <DialogActions className={classes.dialogAction}>
        <Button
          variant="outlined"
          color="info"
          onClick={confirmDialog.onConfirm}
        >
          Yes
        </Button>
        <Button variant="outlined" color="error" onClick={handleClose}>
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
}
