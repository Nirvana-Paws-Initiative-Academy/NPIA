import { useEffect, useRef, useState, ReactNode } from "react";
import { useRouter } from "next/router";

interface ScrollableSectionProps {
  children: ReactNode;
  id: string;
}

const ScrollableSection: React.FC<ScrollableSectionProps> = ({
  children,
  id,
}) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page on mount
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          router.replace(`#${id}`, undefined, { shallow: true });
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [id, router]);

  return (
    <section ref={sectionRef} id={id} className="h-screen snap-start">
      {children}
    </section>
  );
};

export default ScrollableSection;
