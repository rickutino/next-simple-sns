import { Controller, useFormContext } from "react-hook-form";
import React, { InputHTMLAttributes } from 'react';
import { TextField } from "@mui/material";
// import { Container } from './styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  placeholder: string;
}

const DMTextInput: React.ForwardRefRenderFunction<HTMLInputElement, InputProps> = ({ name, placeholder , ...rest }, ref) => {
  return (
    <div>
      <input
        type="text"
        ref={ref}
        // ref={contentInputRef}
        {...rest}/>
    </div>
  )
}

export default React.forwardRef(DMTextInput);

{/* <CardActions >
<Input content={''} placeholder={'DMでの入力を…'} >
</Input>
<Button>
  <ChatOutlinedIcon
    color="secondary"
    fontSize='large'
  />
</Button>
</CardActions> */}
