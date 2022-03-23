/* eslint-disable react/destructuring-assignment */
import { Button, styled } from '@mui/material';

const Input = styled('label')({
  display: 'none'
});

export function UploadButton(props) {
  return (
    <label htmlFor={`upload-button-${props.name}`}>
      <Input
        accept="image/*"
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
}
