'use client'

import { useState } from "react";

interface AccordionProps {
    title: string;
    data: { id: string; name: string; path: string }[]; // Flexible for any kind of list
}

export const Accordion = ({ title, data }: AccordionProps) => {
    const [isOpen, setIsOpen] = useState(true); // Initially open

    const toggleAccordion = () => setIsOpen(!isOpen);

    return (
        <div className="w-full max-w-lg mx-auto-lg mb-4 m-auto">
            {/* Accordion Header */}
            <div
                onClick={toggleAccordion}
                className="flex justify-between items-center p-4 cursor-pointer text-[#4B714C] font-bold border-t-2 border-gray-100 border-b-2 w-full"
            >
                <span className="text-3xl">{title}</span>
                <span>{isOpen ? "▲" : "▼"}</span>
            </div>

            {/* Accordion Content */}
            {isOpen && (
                <div className="p-3">
                    <ul className="space-y-2">
                        {data.map((item) => (
                            <li key={item.id}>
                                <a
                                    href={item.path}
                                    className="text-[#8DB68E] text-2xl font-medium hover:underline"
                                >
                                    {item.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
