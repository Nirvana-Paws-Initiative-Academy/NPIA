"use client";

import React, { ReactNode, useEffect, useRef, useState } from "react";

interface SmoothScrollSectionsProps {
  children: ReactNode;
  scrollDuration?: number;
  scrollThreshold?: number;
}

const SmoothScrollSections = ({
  children,
  scrollDuration = 1000,
  scrollThreshold = 50,
}: SmoothScrollSectionsProps): JSX.Element => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTime = useRef<number>(0);
  const lastTouchY = useRef<number>(0);

  const scrollToSection = (index: number) => {
    const container = containerRef.current;
    if (!container) return;

    const sections = Array.from(container.getElementsByClassName("section"));
    if (index < 0 || index >= sections.length) return;

    setIsScrolling(true);
    setCurrentSection(index);
    lastScrollTime.current = Date.now();

    setTimeout(() => {
      setIsScrolling(false);
    }, scrollDuration);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (isScrolling) return;

      const now = Date.now();
      if (now - lastScrollTime.current < scrollDuration) return;

      const isScrollingDown = e.deltaY > 0;

      if (Math.abs(e.deltaY) < scrollThreshold) return;

      const sections = Array.from(container.getElementsByClassName("section"));
      const newSection = isScrollingDown
        ? Math.min(currentSection + 1, sections.length - 1)
        : Math.max(currentSection - 1, 0);

      if (newSection !== currentSection) {
        scrollToSection(newSection);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      lastTouchY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isScrolling) {
        e.preventDefault();
        return;
      }

      const touchY = e.touches[0].clientY;
      const deltaY = lastTouchY.current - touchY;

      if (Math.abs(deltaY) > scrollThreshold) {
        e.preventDefault();

        const now = Date.now();
        if (now - lastScrollTime.current < scrollDuration) return;

        const sections = Array.from(
          container.getElementsByClassName("section")
        );
        const newSection =
          deltaY > 0
            ? Math.min(currentSection + 1, sections.length - 1)
            : Math.max(currentSection - 1, 0);

        if (newSection !== currentSection) {
          scrollToSection(newSection);
          lastTouchY.current = touchY;
        }
      }
    };

    // Prevent default scrolling
    document.body.style.overflow = "hidden";

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });

    return () => {
      document.body.style.overflow = "";
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, [
    currentSection,
    isScrolling,
    scrollDuration,
    scrollThreshold,
    scrollToSection,
  ]);

  // Wrap each child in a section div
  const wrappedChildren = React.Children.map(children, (child) => (
    <div className="section sm:h-screen w-full">{child}</div>
  ));

  return (
    <div ref={containerRef} className="overflow-hidden">
      <div
        className="transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateY(-${currentSection * 100}vh)`,
        }}
      >
        {wrappedChildren}
      </div>
    </div>
  );
};

export default SmoothScrollSections;
