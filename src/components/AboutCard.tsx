import { useRef, useEffect } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

type AboutCardProps = {
  character: string;
  onClick?: () => void;
};

export default function AboutCard({ character, onClick }: AboutCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const splitRef = useRef<SplitText | null>(null);

  useEffect(() => {
    const card = cardRef.current;
    const overlay = overlayRef.current;
    const textEl = textRef.current;
    const textContainer = textContainerRef.current;
    if (!card || !overlay || !textEl || !textContainer) return;

    // Create SplitText instance on the overlay heading
    splitRef.current = new SplitText(textEl, {
      type: "chars",
    });

    const chars = splitRef.current.chars;

    // Set initial states
    gsap.set(overlay, {
      scaleY: 0,
      transformOrigin: "bottom center",
    });
    gsap.set(chars, {
      opacity: 0,
      y: 40,
      rotateX: -90,
    });
    gsap.set(textContainer, {
      scaleX: 0,
    });

    // Build the hover timeline (paused)
    const tl = gsap.timeline({ paused: true });

    tl.to(overlay, {
      scaleY: 1,
      duration: 0.5,
      ease: "power3.inOut",
    }).to(
      textContainer,
      {
        scaleX: 1,
        duration: 0.5,
        ease: "power3.inOut",
      }
    ).to(
      chars,
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.6,
        stagger: 0.04,
        ease: "back.out(1.7)",
      },
      "-=0.15"
    );

    tlRef.current = tl;

    // Mouse event handlers
    const handleMouseEnter = () => {
      tlRef.current?.play();
    };

    const handleMouseLeave = () => {
      tlRef.current?.reverse();
    };

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
      tl.kill();
      splitRef.current?.revert();
    };
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className="hidden md:flex border border-gray-100 items-center justify-center relative overflow-hidden cursor-pointer"
    >
      {/* Original character */}
      <h1 className="text-8xl font-museo text-center">{character}</h1>

      {/* Hover overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{ backgroundColor: "#CCFF00", willChange: "transform" }}
      >
        <div ref = {textContainerRef} className="w-fit bg-black px-4 py-2 shadow-lg hover:bg-red">
          <h2
            ref={textRef}
            className="text-2xl font-museo text-white tracking-widest uppercase"
            style={{ perspective: "500px" }}
          >
            About Us
          </h2>
        </div>
      </div>
    </div>
  );
}