import { ShoppingCart } from "lucide-react";
import { assets } from "../assets/assets";
import { SHOP_URL } from "../common/constants";
import { SetTokenProps } from "../types/Token";

interface NavbarProps extends SetTokenProps {
  token?: string;
  children: React.ReactNode;
}
const Navbar = ({ token, setToken, children }: NavbarProps) => {
  return (
    <>
      <div className="flex items-center py-2 px-[4%] justify-between">
        <img className="w-[max(10%,80px)]" src={assets.admin_logo} alt="" />

        <div className="flex flex-row items-center gap-4 justify-end">
          <a
            href={SHOP_URL}
            className="flex flex-row items-center gap-1 text-fuchsia-500 hover:-translate-y-1 hover:underline hover:text-sky-500 transition-all duration-500"
          >
            <ShoppingCart />
            Shop
          </a>
          {token && (
            <button
              onClick={() => setToken("")}
              className="bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm"
            >
              Logout
            </button>
          )}
        </div>
      </div>
      {children}
    </>
  );
};

export default Navbar;
