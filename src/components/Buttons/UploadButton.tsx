import {
  Button,
  Theme,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme: Theme) =>({
  input: {
    display: 'none',
  },
}));

export const UploadButton = (props) => {
  const classes = useStyles();
  return (
    <label htmlFor={`upload-button-${props.name}`}>
      <input
        accept="image/*"
        className={classes.input}
        id={`upload-button-${props.name}`}
        name={props.name}
        multiple
        type="file"
        onChange={props.onChange}
      />
      <Button variant="contained" component="span" {...props}>
        {props.children}
      </Button>
      </label>
  );
};
