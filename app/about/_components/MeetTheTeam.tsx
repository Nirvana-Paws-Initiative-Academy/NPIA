import React from "react";

const TEAM = [
  {
    id: 2,
    name: "Koushik Gaja",
    role: "President",
  },
  {
    id: 1,
    name: "Deekshitha Ale",
    role: "Vice President",
  },

  {
    id: 3,
    name: "Goverdhan Lakkadi",
    role: "Secretary",
  },
  {
    id: 4,
    name: "Nayani",
    role: "Assistant Secretary",
  },
  {
    id: 5,
    name: "Gayatri",
    role: "Treasurer",
  },
  {
    id: 6,
    name: "Mohit Kuril",
    role: "Board Members",
  },
  {
    id: 7,
    name: "Name To Be Decided",
    role: "Board Members",
  },
  {
    id: 8,
    name: "Name To Be Decided",
    role: "Board Members",
  },
];

export const MeetTheTeam = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen w-full m-auto gap-8 ">
      <div className="flex items-center justify-center flex-col gap-2">
        <h2 className="text-[#4B714C] text-4xl font-bold">Meet the Team</h2>
        <p className="text-[#8DB68E] text-xl font-medium capitalize text-center">
          enhancing dog welfare with passion, expertise, and innovative care for
          happier, healthier lives.
        </p>
      </div>
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
        {TEAM.map((member) => (
          <div
            key={member.id}
            className="bg-[#E2FFE4] h-[35vh] w-[210px] sm:w-[250px] sm:h-[35vh] flex items-center justify-center relative rounded-lg"
          >
            <div className="bg-white absolute bottom-0 p-2 w-4/5 ml-2 mr-2 mb-2 flex items-center flex-col rounded-lg">
              <h3 className="text-[#4B714C] font-bold text-xl tracking-tight">
                {member.name}
              </h3>
              <span className="text-[#4B714C] font-medium text-md">
                {member.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
