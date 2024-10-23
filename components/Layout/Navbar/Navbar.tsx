import logoImg from "@/public/NPIA_name.png";
import Image from "next/image";
import genereateId from "quickidgen";
import Navlinks from "./Navlinks";
import Button from "@/components/UI/Button";

const ROUTES = [
  {
    id: genereateId(),
    name: "Home",
    path: "/",
  },
  {
    id: genereateId(),
    name: "About us",
    path: "/about",
  },
  {
    id: genereateId(),
    name: "Our Programs",
    path: "/our-programs",
  },
  {
    id: genereateId(),
    name: "Contact Us",
    path: "/contact-us",
  },
];

export const Navbar = () => {
  const randomId = genereateId();
  return (
    <nav className="flex justify-between items-center  py-2">
      <div className="logo">
        <Image
          src={logoImg}
          alt="Nirvana Logo"
          className="w-[15vw] sm:w-[8vw] object-contain h-auto"
        />
      </div>
      <ul className="flex items-center gap-[2vw]">
        {ROUTES.map((route) => (
          <li key={route.id}>
            <Navlinks path={route.path} id={route.id}>
              {route.name}
            </Navlinks>
          </li>
        ))}
        <li>
          <Button size="large" variant="primary" id={randomId}>
            Donate Now
          </Button>
        </li>
      </ul>
    </nav>
  );
};
