/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef } from "react";
import MaskedInput from "react-text-mask";

export const TextMaskCustom = forwardRef<HTMLInputElement, any>((props, ref) => (
  <MaskedInput
    {...props}
    ref={ref as any}
    mask={['(', /[0-9]/, /[0-9]/, ')', ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]}
    placeholderChar="_"
  />
));
