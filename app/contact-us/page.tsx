"use client";
import Button from "@/components/UI/Button";
import { Icon } from "@/components/UI/Icons";
import { Input } from "@/components/UI/Input";
import { SelectOptions } from "@/components/UI/SelectOptions";
import React from "react";
const page = () => {
  const [show, setShow] = React.useState(true);
  const [selectOptions, setSelectOptions] = React.useState([
    {
      id: "1",
      icon: "🐾",
      title: "I'm Looking To Volunteer At N.P.I.A",
      description:
        "Connect With Us And Learn More About How You Can Make A Difference In The Lives Of Stray Puppies.",
      selected: false,
    },
    {
      id: "2",
      icon: "🎓",
      title: "I'm Looking To Be A Student Ambassador N.P.I.A",
      description:
        "Connect With Us And Learn More About How You Can Make A Difference In The Lives Of Stray Puppies.",
      selected: false,
    },
    {
      id: "3",
      icon: "🏠",
      title: "I'm Looking To Adopt A Stray Puppy From N.P.I.A",
      description:
        "Connect With Us And Learn More About How You Can Make A Difference In The Lives Of Stray Puppies.",
      selected: false,
    },
    {
      id: "4",
      icon: "❤️",
      title: "I'm Looking To Foster A Stray Puppy From N.P.I.A",
      description:
        "Connect With Us And Learn More About How You Can Make A Difference In The Lives Of Stray Puppies.",
      selected: false,
    },
  ]);

  const handleOptionChange = (id: string) => {
    setSelectOptions((options) =>
      options.map((option) =>
        option.id === id ? { ...option, selected: !option.selected } : option
      )
    );
  };

  return (
    <section className="flex h-[100vh] gap-8 relative w-full mt-16 ">
      <div className="w-[50%] h-full  flex flex-col gap-4 ">
        <div>
          <h2 className="text-[#4B714C] font-bold text-4xl capitalize">
            Chat to our team
          </h2>
          <p className="text-[#4B714C] text-xl  w-full sm:w-9/12 leading-none">
            Connect with us and learn more about how you can make a difference
            in the lives of Stray puppies.
          </p>
        </div>

        <div>
          <form action="" className="flex flex-col gap-2 w-full">
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <Input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  icon="input_user"
                  key={"firstName"}
                  label="First name"
                />

                <Input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  icon="input_user"
                  key={"lastName"}
                  label="Last name"
                />
              </div>
              <div>
                <Input
                  type="text"
                  id="occupation"
                  name="occupation"
                  required
                  icon="input_occupation"
                  key={"occupation"}
                  label="Occupation"
                />
              </div>
              <div>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  required
                  icon="input_email"
                  key={"occupation"}
                  label="Email Id"
                />
              </div>

              <div>
                <Input
                  type="number"
                  id="number"
                  name="number"
                  required
                  icon="input_phone"
                  key={"number"}
                  label="Primary phone number"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-[#4B714C] font-bold text-2xl">
                Please Select the Following reason
              </h2>
              <div>
                <SelectOptions
                  options={selectOptions}
                  onChange={handleOptionChange}
                  setShow={setShow}
                />
              </div>

              {show && (
                <>
                  <div className="relative">
                    <textarea
                      name="message"
                      id="message"
                      className="relative w-full border border-[#DAF6DA] p-2 pl-12 rounded-lg bg-[#fdfffd] focus:border-[#4B714C] focus:outline-none transition-colors duration-300 ease-in-out  font-medium text-md  "
                      rows={3}
                      cols={20}
                    ></textarea>
                    <p className="absolute left-2  top-1/2 transform -translate-y-1/2 z-10 flex flex-col items-center ">
                      <span className="bg-[#DAF6DA] p-1 rounded-lg">
                        <Icon name="input_user" />
                      </span>
                      <span className="text-[#4B714C] text-md font-bold">
                        Queries
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center justify-center w-full">
                    <Button
                      variant="primary"
                      size="large"
                      label="Submit"
                      className="w-[300px] "
                    >
                      Get In Touch
                    </Button>
                  </div>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
      <div className="bg-[#E2FFE4] w-[50%] flex items-center justify-center rounded-xl">
        Hello world
      </div>
    </section>
  );
};

export default page;
