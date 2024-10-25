import Link from "next/link";

interface NavlinksProps extends React.LinkHTMLAttributes<HTMLLinkElement> {
  path: string;
  id: string;
  toggle: () => void;
}

const MobileNavlink: React.FunctionComponent<NavlinksProps> = ({
  path,
  id,
  children,
  toggle,
}) => {
  return (
    <Link
      href={path}
      id={id}
      passHref
      className="text-[#4B714C] flex items-center gap-[2vw] text-lg sm:text-xl font-[600] capitalize hover:text-[#4B714C] duration-200 transition clickable"
      onClick={toggle}
    >
      {children}
    </Link>
  );
};

export default MobileNavlink;
