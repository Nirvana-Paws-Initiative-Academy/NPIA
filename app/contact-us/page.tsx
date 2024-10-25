import Image from "next/image";
import React from "react";
import comingSoon from "@/public/coming-soon.png";
const page = () => {
  return (
    <section className="h-screen flex flex-col items-center justify-center gap-[4vw] relative">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-[#4B714C] text-4xl">Coming Soon</h1>
        <p className="text-[#8DB68E] text-xl text-center">
          "Uh-oh! Looks like a paw got in the way! This page seems to be lost,
          but don't worry—just like every puppy, we'll guide you back home!"
        </p>
      </div>
      {/* <div className="footer_form m-auto">
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
      </div> */}

      <div>
        <Image src={comingSoon} alt="" className="w-[30vw]" />
      </div>
    </section>
  );
};

export default page;
