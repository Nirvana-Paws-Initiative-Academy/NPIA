import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/Layout/Navbar/Navbar";
import footerImg from "@/public/NPIA_name.png";
import Image from "next/image";
import Button from "@/components/UI/Button";
import Link from "next/link";
import footer from "@/public/footer.png"
import { Accordion } from "@/components/UI/Accordion";
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
        <header className=" px-4 fixed top-0 z-50 left-0  w-screen h-16">
          <Navbar />
        </header>

        <main aria-label="Page Content" className="px-4 py-2 m-auto">
          {children}
        </main>
        <footer className="flex sm:items-center flex-col border-b-[1vw] border-[#4B714C] gap-[1.5vw] mt-[4vh] px-4 py-2 
        ">

          <div className="bg-[#4B714C] w-full sm:w-8/12 p-[1.5vw] rounded-2xl flex items-center justify-between flex-col-reverse sm:flex-row">
            <div className="text-[#FAFFFD] flex flex-col gap-4 sm:gap-[1vw] items-center sm:items-start ">
              <h2 className="text-4xl sm:text-[clamp(1rem,2vw,10rem)]">INSPIRE: The Heart of Our Work</h2>
              <p className="w-full sm:w-9/12 text-center sm:text-left text-lg leading-none sm:text-[clamp(.5rem,1.3vw,8rem)]">
                INSPIRE (Initiative for Nurturing Stray Puppies Into Responsible Environments) is at the core of everything we do. It represents our unwavering commitment to providing stray puppies with the love, care, and opportunities they need to thrive.
              </p>
              <Button size="medium" variant="secondary" className="sm:text-[clamp(.2rem,1.2vw,6rem)] clickable">
                Join Us In Making A Difference
              </Button>
            </div>

            <div>
              <Image src={footer} alt="" className="w-[300px] sm:w-[20vw]" />
            </div>
          </div>

          <div className="logo_img ">
            <Image
              src={footerImg}
              alt="Footer logo for NPIA"
              className="w-[150px] sm:w-[10vw] h-auto object-contain"
            />
          </div>
          <div className="hidden lg:flex footer_content items-center justify-center">
            <p className="text-[#4B714C] text-xl text-center w-full sm:w-3/5  sm:text-[clamp(.5rem,1.4vw,8rem)] leading-snug">
              Whether you donate, volunteer, or simply spread the word, your support is invaluable in our mission to create a brighter future for animals. Together, we can build a community where every animal is valued and protected.
            </p>
          </div>
          <div className="hidden lg:block footer_form m-auto">
            <Button size="large" variant="primary" className="sm:text-[clamp(.5rem,2vw,10rem)] clickable">
              Donate Now
            </Button>
          </div>

          <div className="hidden lg:block footer_links">
            <ul className="flex items-center justify-around gap-8 w-full flex-col sm:flex-row">
              {ROUTES.map((route) => (
                <li key={route.id}>
                  <Link
                    href={route.path}
                    className="clickable text-[#4B714C] text-2xl font-bold sm:text-[clamp(.5rem,1.4vw,10rem)]"
                  >
                    {route.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="block lg:hidden w-full m-auto">
            <Accordion title="Navigation" data={ROUTES} />
          </div>

          <div className="footer-copyright text-center">
            <p className="text-[#4b714c] text-center sm:text-[clamp(.5rem,1.2vw,8rem)]">
              © 2024 Nirvana Paws Initative & Academy. All Rights Reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
