/* eslint-disable react/function-component-definition */
import React from 'react';

const DMTextInput: React.ForwardRefRenderFunction<HTMLInputElement> = (
  { ...rest },
  ref
) => {
  return (
    <div>
      <input type="text" ref={ref} {...rest} />
    </div>
  );
};

export default React.forwardRef(DMTextInput);
