import { useEffect, useRef, ReactNode, useState } from "react";
import dynamic from "next/dynamic";

interface ScrollableSectionProps {
  children: ReactNode;
  id: string;
}

// Create a client-side only component
const ScrollableSectionClient = ({ children, id }: ScrollableSectionProps) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !sectionRef.current) return;

    const handleIntersection = async ([entry]: IntersectionObserverEntry[]) => {
      if (entry.isIntersecting) {
        // Get the window.history object directly
        if (window.history) {
          window.history.pushState({}, "", `#${id}`);
        }
      }
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.5,
    });

    observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [id, mounted]);

  if (!mounted) return null;

  return (
    <section
      ref={sectionRef}
      id={id}
      className="h-screen snap-start scroll-smooth"
    >
      {children}
    </section>
  );
};

// Create a dynamic component with SSR disabled
const ScrollableSection = dynamic(
  () => Promise.resolve(ScrollableSectionClient),
  { ssr: false }
);

export default ScrollableSection;
