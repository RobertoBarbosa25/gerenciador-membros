import { jsx as _jsx } from "react/jsx-runtime";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef } from "react";
import MaskedInput from "react-text-mask";
export const TextMaskCustom = forwardRef((props, ref) => (_jsx(MaskedInput, { ...props, ref: ref, mask: ['(', /[0-9]/, /[0-9]/, ')', ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/], placeholderChar: "_" })));
