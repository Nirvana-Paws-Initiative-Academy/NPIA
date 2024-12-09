"use client";

import logoImg from "@/public/NPIA_name.png";
import Image from "next/image";
import Navlinks from "./Navlinks";
import Button from "@/components/UI/Button";
import { Icon } from "@/components/UI/Icons";
import MobileNavlink from "./MobileNavlink";
import { useState } from "react";

const ROUTES = [
  {
    id: "1",
    name: "Home",
    path: "/",
  },
  {
    id: "2",
    name: "About us",
    path: "/about",
  },
  {
    id: "3",
    name: "Our Programs",
    path: "/our-programs",
  },

  {
    id: "5",
    name: "Track Donation",
    path: "/contact-us",
  },
  {
    id: "4",
    name: "Support & Connect",
    path: "/contact-us",
  },
];

const MOBILE_ROUTES = [
  {
    id: "1",
    name: "Home",
    path: "/",
    icon: <Icon name="mobile_navbar_home" />,
  },
  {
    id: "2",
    name: "About us",
    path: "/about",
    icon: <Icon name="mobile_about_us" />,
  },
  {
    id: "3",
    name: "Our Programs",
    path: "/our-programs",
    icon: <Icon name="mobile_our_programs" />,
  },
  {
    id: "5",
    name: "Track Donation",
    path: "/contact-us",
    icon: <Icon name="mobile_track" />,
  },
  {
    id: "4",
    name: "Support & Connect",
    path: "/contact-us",
    icon: <Icon name="mobile_contact" />,
  },

  {
    id: "6",
    name: "Terms",
    path: "/contact-us",
    icon: <Icon name="mobile_terms" />,
  },
  {
    id: "7",
    name: "Privacy",
    path: "/contact-us",
    icon: <Icon name="mobile_privacy" />,
  },
  {
    id: "8",
    name: "Cookies",
    path: "/contact-us",
    icon: <Icon name="mobile_cookies" />,
  },
];

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenuOpen = () => {
    return setIsMenuOpen((prev) => !prev);
  };

  const randomId = "445464";
  return (
    <nav className="flex justify-between items-center py-4 sm:py-2 bg-[#fafffd]">
      <div className="logo">
        <Image
          src={logoImg}
          alt="Nirvana Logo"
          className="w-[15vw] sm:w-[8vw] object-contain h-auto"
        />
      </div>
      <div>
        {isMenuOpen ? (
          <p className="block sm:hidden" onClick={toggleMenuOpen}>
            <Icon name="navbar_close" />
          </p>
        ) : (
          <p className="block sm:hidden" onClick={toggleMenuOpen}>
            <Icon name="navbar-menu" />
          </p>
        )}
      </div>
      <ul className="sm:flex items-center gap-[2vw] hidden ">
        {ROUTES.map((route) => (
          <li key={route.id}>
            <Navlinks path={route.path} id={route.id}>
              {route.name}
            </Navlinks>
          </li>
        ))}
        <li>
          <Button
            size="large"
            variant="primary"
            id={randomId}
            className="text-[clamp(.5rem,1.4vw,3rem)]"
          >
            Donate Now
          </Button>
        </li>
      </ul>

      {/* Mobile navbar */}
      {isMenuOpen && (
        <ul className="sm:hidden items-start justify-start absolute left-0 top-12 bg-[#E2FFE4] h-screen p-5 w-full gap-[4vw] flex flex-col  ">
          {MOBILE_ROUTES.map((route) => (
            <li key={route.id}>
              <MobileNavlink
                path={route.path}
                id={route.id}
                toggle={toggleMenuOpen}
              >
                {route.icon} {route.name}
              </MobileNavlink>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};
