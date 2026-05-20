import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import NavListComponent from "../hero/nav_list.component";
import FooterComponent from "../footer/footer.component";

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const { pathname } = useLocation();
  const hideFooter = pathname === "/login" || pathname === "/signup";

  return (
    <div className="flex flex-col min-h-screen">
      <NavListComponent />
      <div className="flex-grow">{children}</div>
      {!hideFooter && <FooterComponent />}
    </div>
  );
};

export default RootLayout;
