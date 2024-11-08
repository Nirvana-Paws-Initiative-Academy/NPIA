import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/Layout/Navbar/Navbar";
import footerImg from "@/public/NPIA_name.png";
import Image from "next/image";
import { Icon } from "@/components/UI/Icons";
import Button from "@/components/UI/Button";
import Link from "next/link";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "NPIA - Every Puppy Deserves A Future | Every Second Counts",
  description:
    "NPIA is dedicated to rescuing, rehabilitating, and finding loving homes for these vulnerable animals join us in our mis",
};

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
    id: "4",
    name: "Contact Us",
    path: "/contact-us",
  },
  {
    id: "5",
    name: "Track Donation",
    path: "/contact-us",
  },
  {
    id: "6",
    name: "Terms",
    path: "/contact-us",
  },
  {
    id: "7",
    name: "Privacy",
    path: "/contact-us",
  },
  {
    id: "8",
    name: "Cookies",
    path: "/contact-us",
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="icon.ico" type="image/x-icon" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="container px-4 m-auto fixed top-0 z-50 left-0 right-0 w-full">
          <Navbar />
        </header>

        <main aria-label="Page Content" className="px-4 py-2 m-auto">
          {children}
        </main>
        <footer className="flex items-start sm:items-center flex-col border-b-[20px] border-[#4B714C] gap-8 mt-10">
          <div className="logo_img">
            <Image
              src={footerImg}
              alt="Footer logo for NPIA"
              className="w-[100px] h-auto object-contain"
            />
          </div>
          <div className="footer_content flex items-center justify-center">
            <p className="text-[#4B714C] text-4xl text-center w-3/5 ">
              "Every pet deserves a loving home. Join us in rescuing, healing,
              and giving hope to puppies who need a second chance."
            </p>
          </div>
          <div className="footer_form m-auto">
            <form className="flex items-center w-full">
              <div className="flex items-center relative gap-4">
                <div className="relative w-[30vw]">
                  <input
                    type="text"
                    id="email"
                    placeholder=" "
                    className="peer w-full border border-[#8DB68E] py-2 px-10 pl-12 rounded-lg bg-[#fdfffd] focus:border-[#4B714C] focus:outline-none transition-colors duration-300 ease-in-out text-lg font-medium"
                    required
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-12  transition-all duration-300 transform text-lg font-medium text-[#8DB68E] peer-placeholder-shown:top-2 peer-placeholder-shown:text-lg peer-placeholder-shown:text-[#8DB68E] peer-focus:-top-0.5 peer-focus:text-sm peer-focus:text-[#4B714C]"
                  >
                    Enter your email
                  </label>
                  <p className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10">
                    <Icon name="footer-icon" />
                  </p>
                </div>

                <Button size="medium" variant="primary">
                  Subscribe Now
                </Button>
              </div>
            </form>
          </div>

          <div className="footer_links">
            <ul className="flex items-center justify-around gap-8 w-full flex-col sm:flex-row">
              {ROUTES.map((route) => (
                <li key={route.id}>
                  <Link
                    href={route.path}
                    className="clickable text-[#4B714C] text-2xl font-bold"
                  >
                    {route.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-copyright mb-3">
            <p className="text-[#4b714c]">
              © 2024 Nirvana Paws Initative & Academy. All Rights Reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
