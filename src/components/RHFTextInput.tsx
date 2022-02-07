import { Controller, useFormContext } from "react-hook-form";
import StyledInput from "./StyledInput";
interface ITextInput {
  name: string;
  type: "text" | "password";
  label: string;
  fullWidth: boolean;
  defaultValue: string;
  size: string;
  otherProp?: any;
}

export const RHFTextInput: React.FC<ITextInput> = ({ name, type, label }) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <StyledInput
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
