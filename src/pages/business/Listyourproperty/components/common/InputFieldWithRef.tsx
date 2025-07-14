import React from 'react';
import { InputField } from './InputField';

const InputFieldWithRef = React.forwardRef<HTMLInputElement, React.ComponentProps<typeof InputField>>((props, ref) => {
  return <InputField {...props} ref={ref} />;
});

InputFieldWithRef.displayName = 'InputFieldWithRef';

export default InputFieldWithRef;
