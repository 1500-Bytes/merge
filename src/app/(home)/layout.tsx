import { ReactNode } from "react";

type layoutProps = {
  children: ReactNode;
};

const layout = ({ children }: layoutProps) => {
  return <div className="min-h-screen">{children}</div>;
};

export default layout;
