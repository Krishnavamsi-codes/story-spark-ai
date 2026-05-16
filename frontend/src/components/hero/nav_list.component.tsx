import React, { useEffect, useState } from "react";
import { isLoggedIn, removeUserInfo } from "../../services/auth.service";
import { Link } from "react-router-dom";
import logo from "../../assets/logoNew.png";

interface INavListComponentProps {
  setShowNotification: (value: boolean) => void;
  newNotify: number;
}

const NavListComponent: React.FC<INavListComponentProps> = ({
  setShowNotification,
  newNotify,
}) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(isLoggedIn());

  const handelLogout = () => {
    removeUserInfo();
    setIsLogin(false);
  };

  useEffect(() => {
    setIsLogin(isLoggedIn());
  }, []);

  return (
    <div className="relative z-10 mx-auto max-w-8xl px-5 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/">
            <img src={logo} alt="logo" width={50} height={50} />
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-400 hover:text-custom transition">HOME</Link>
            <Link to="/explore" className="text-gray-400 hover:text-custom transition">EXPLORE</Link>
            <Link to="/community" className="text-gray-400 hover:text-custom transition">COMMUNITY</Link>
            {isLogin && (
              <Link to="/dashboard" className="text-gray-400 hover:text-custom transition">DASHBOARD</Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3">
            <button type="button" className="p-2 text-gray-400 hover:text-gray-500">
              <i className="fas fa-search"></i>
            </button>
            <div className="relative inline-flex">
              <button type="button" className="p-1 text-gray-400 hover:text-gray-500"
                onClick={() => setShowNotification(true)}>
                <i className="fa-solid fa-bell"></i>
              </button>
              <span className="absolute top-0.5 right-0.5 grid min-h-[18px] min-w-[18px] translate-x-2/4 -translate-y-2/4 place-items-center rounded-full bg-red-700 text-xs text-gray-400">
                {newNotify}
              </span>
            </div>
            {isLogin ? (
              <button onClick={handelLogout} className="text-gray-400 px-6 py-2 font-medium cursor-pointer">
                LOGOUT
              </button>
            ) : (
              <Link to="/login">
                <button className="text-gray-400 px-6 py-2 font-medium cursor-pointer">
                  LOGIN
                </button>
              </Link>
            )}
          </div>

          <button className="md:hidden text-gray-400 hover:text-gray-300 p-2"
            onClick={() => setMenuOpen((prev) => !prev)}>
            <i className={`fas ${menuOpen ? "fa-xmark" : "fa-bars"} text-xl`}></i>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden px-5 pb-4 flex flex-col gap-3 border-t border-white/10 mt-2">
          <Link to="/" className="text-gray-400 hover:text-white py-2">HOME</Link>
          <Link to="/explore" className="text-gray-400 hover:text-white py-2">EXPLORE</Link>
          <Link to="/community" className="text-gray-400 hover:text-white py-2">COMMUNITY</Link>
          {isLogin && (
            <Link to="/dashboard" className="text-gray-400 hover:text-white py-2">DASHBOARD</Link>
          )}
          <button type="button" className="text-left text-gray-400 py-2"
            onClick={() => setShowNotification(true)}>
            NOTIFICATIONS {newNotify > 0 && `(${newNotify})`}
          </button>
          {isLogin ? (
            <button onClick={handelLogout} className="text-left text-gray-400 py-2">
              LOGOUT
            </button>
          ) : (
            <Link to="/login" className="text-gray-400 py-2">LOGIN</Link>
          )}
        </div>
      )}
    </div>
  );
};

export default NavListComponent;