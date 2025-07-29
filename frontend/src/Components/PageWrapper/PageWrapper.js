import { jsx as _jsx } from "react/jsx-runtime";
import { PageWrapperBox } from "./PageWrapper.styles";
export const PageWrapper = ({ children }) => {
    return (_jsx(PageWrapperBox, { children: children }));
};
