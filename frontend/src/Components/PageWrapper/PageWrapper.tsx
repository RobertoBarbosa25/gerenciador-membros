import { PropsWithChildren } from "react"
import { PageWrapperBox } from "./PageWrapper.styles"

export const PageWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <PageWrapperBox>
      {children}
    </PageWrapperBox>
  );
};
