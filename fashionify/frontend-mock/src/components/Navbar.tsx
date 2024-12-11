import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useState } from "react";
import { cn } from "../lib/utils";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisble] = useState(false);

  const { setShowSearch, getCartCount } = useContext(ShopContext);

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <Link to="/">
        <img className="w-36" src={assets.logo} alt="Logo" />
      </Link>
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        {/* NavLink can be styled, but it works the same as Link */}
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          {/* create a visual underline for each navigation link, which can be styled 
          to appear or disappear based on user interactions */}
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-6">
        <img
          onClick={() => setShowSearch(true)}
          className="w-5 cursor-pointer"
          src={assets.search_icon}
          alt="search icon"
        />
        <div className="group relative">
          <Link to="/login">
            <img
              className="w-5 cursor-pointer"
              src={assets.profile_icon}
              alt="profile icon"
            />
          </Link>
          <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
            <div className="flex flex-col gap-2 w-36 py-3 px-5  bg-slate-100 text-gray-500 rounded">
              <p className="cursor-pointer hover:text-black">My Profile</p>
              <p className="cursor-pointer hover:text-black">Orders</p>
              <p className="cursor-pointer hover:text-black">Logout</p>
            </div>
          </div>
        </div>
        <Link to="/cart" className="relative">
          <img className="w-5 min-w-5" src={assets.cart_icon} alt="" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </Link>
        <img
          onClick={() => setVisble(true)}
          className="w-5 cursor-pointer sm:hidden"
          src={assets.menu_icon}
          alt="menu icon"
        />
      </div>

      {/* Sidebar Menu For Small Screens */}
      <div
        className={cn(
          "absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all",
          visible ? "w-full" : "w-0"
        )}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisble(false)}
            className="flex items-center gap-4 p-3 "
          >
            <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="" />
            <p>Back</p>
          </div>
          <NavLink
            onClick={() => setVisble(false)}
            to="/"
            className="py-2 pl-6 border"
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => setVisble(false)}
            to="/collection"
            className="py-2 pl-6 border"
          >
            COLLECTION
          </NavLink>
          <NavLink
            onClick={() => setVisble(false)}
            to="/about"
            className="py-2 pl-6 border"
          >
            ABOUT
          </NavLink>
          <NavLink
            onClick={() => setVisble(false)}
            to="/contact"
            className="py-2 pl-6 border"
          >
            CONTACT
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;