import Link from "next/link";

interface NavlinksProps extends React.LinkHTMLAttributes<HTMLLinkElement> {
  path: string;
  id: string;
}

const Navlinks: React.FunctionComponent<NavlinksProps> = ({
  path,
  id,
  children,
}) => {
  return (
    <Link
      href={path}
      id={id}
      passHref
      className="text-[#8DB68E] text-lg sm:text-xl font-[600] capitalize hover:text-[#4B714C] duration-200 transition"
    >
      {children}
    </Link>
  );
};

export default Navlinks;
