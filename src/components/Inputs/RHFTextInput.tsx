/* eslint-disable react/function-component-definition */
import { styled, TextField } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import theme from '../../styles/theme';

interface ITextInput {
  name: string;
  type: 'text' | 'password';
  label: string;
  fullWidth: boolean;
  defaultValue: string;
  size: string;
  InputProps?: unknown;
  otherProp?: unknown;
}

const Input = styled(TextField)({
  '& label.MuiFormLabel-root': {
    paddingLeft: '2rem',
    marginTop: '0px'
  },
  lineHeight: '0.8rem',
  background: 'white',
  borderRadius: '5px',
  border: '0',
  outline: '0',
  color: theme.palette.grey[800],
  height: '48px',
  width: '325px',
  padding: '0 auto',
  '&&:nth-child(2)': {
    marginTop: '0.5rem'
  },
  '&&:nth-child(3)': {
    marginTop: '0.5rem'
  }
});

export const RHFTextInput: React.FC<ITextInput> = ({ name, type, label }) => {
  const {
    control,
    formState: { errors }
  } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Input
          {...field}
          label={label}
          type={type}
          error={!!errors[name]}
          helperText={errors[name]?.message}
        />
      )}
    />
  );
};
