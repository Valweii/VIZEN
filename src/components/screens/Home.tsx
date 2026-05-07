import { useRef, useCallback, useEffect, useState } from "react";
import gsap from "gsap";
import AboutCard from "../AboutCard";
import AboutSection from "../AboutSection";
import LumosCard from "../projects/Lumos Production/lumosCard";
import LumosSection from "../projects/Lumos Production/lumosSection";
import Logo from "../../assets/logo.svg?react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const lumosRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const isAboutOpenRef = useRef(false);
  const isLumosOpenRef = useRef(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [lumosOpen, setLumosOpen] = useState(false);
  const [lumosHasPlayed, setLumosHasPlayed] = useState(false);

  useEffect(() => {
    return () => {
      tlRef.current?.kill();
    };
  }, []);

  const handleAboutClick = useCallback(() => {
    if (isAboutOpenRef.current) return;
    isAboutOpenRef.current = true;
    setAboutOpen(true);

    const grid = gridRef.current;
    const about = aboutRef.current;
    if (!grid || !about) return;

    const isMobile = window.innerWidth < 768;
    const shiftAmount = isMobile ? window.innerWidth : window.innerWidth * 0.4;

    const tl = gsap.timeline();
    tlRef.current = tl;

    tl.to(grid, {
      x: -shiftAmount,
      duration: 0.8,
      ease: "power3.inOut",
    }).fromTo(
      about,
      { x: shiftAmount },
      {
        x: 0,
        duration: 0.8,
        ease: "power3.inOut",
      },
      0 // start at the same time
    );
  }, []);

  const handleAboutClose = useCallback(() => {
    if (!isAboutOpenRef.current) return;
    isAboutOpenRef.current = false;

    const grid = gridRef.current;
    const about = aboutRef.current;
    if (!grid || !about) return;

    const isMobile = window.innerWidth < 768;
    const shiftAmount = isMobile ? window.innerWidth : window.innerWidth * 0.4;

    const tl = gsap.timeline();
    tlRef.current = tl;

    tl.to(grid, {
      x: 0,
      duration: 0.8,
      ease: "power3.inOut",
    }).to(
      about,
      {
        x: shiftAmount,
        duration: 0.8,
        ease: "power3.inOut",
      },
      0
    ).eventCallback("onComplete", () => {
      setAboutOpen(false);
    });
  }, []);

  const handleLumosClick = useCallback(() => {
    if (isLumosOpenRef.current) return;
    isLumosOpenRef.current = true;
    setLumosOpen(true);

    const grid = gridRef.current;
    const lumos = lumosRef.current;
    if (!grid || !lumos) return;

    // Shift down by 66.6vh (LumosSection height)
    const shiftAmountY = window.innerHeight * 0.666;

    const tl = gsap.timeline();
    tlRef.current = tl;

    tl.to(grid, {
      y: shiftAmountY,
      duration: 0.8,
      ease: "power3.inOut",
    }).fromTo(
      lumos,
      { y: -shiftAmountY },
      {
        y: 0,
        duration: 0.8,
        ease: "power3.inOut",
      },
      0
    );
  }, []);

  const handleLumosClose = useCallback(() => {
    if (!isLumosOpenRef.current) return;
    isLumosOpenRef.current = false;

    const grid = gridRef.current;
    const lumos = lumosRef.current;
    if (!grid || !lumos) return;

    const shiftAmountY = window.innerHeight * 0.666;

    const tl = gsap.timeline();
    tlRef.current = tl;

    tl.to(grid, {
      y: 0,
      duration: 0.8,
      ease: "power3.inOut",
    }).to(
      lumos,
      {
        y: -shiftAmountY,
        duration: 0.8,
        ease: "power3.inOut",
      },
      0
    ).eventCallback("onComplete", () => {
      setLumosOpen(false);
    });
  }, []);

  const [aboutHasPlayed, setAboutHasPlayed] = useState(false);

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-screen overflow-hidden"
    >
      {/* Mobile Header */}
      <div className="md:hidden absolute top-0 left-0 w-full flex justify-between items-center z-40 bg-white border-b border-gray-100">
        <Logo className="w-10 h-10 ml-6 object-contain text-black" />
        <button onClick={handleAboutClick} className="h-full p-8 bg-[#CCFF00]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text">
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="M10 9H8" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
          </svg>
        </button>
      </div>

      {/* Main 5-column, 3-row grid (desktop) | 1-column single grid (mobile) */}
      <div ref={gridRef} className="grid-cols-2 md:grid-cols-5 md:grid-rows-3 grid h-full w-full pt-20 md:pt-0">
        <AboutCard character="V" onClick={handleAboutClick} />
        <div className="border border-gray-100"></div>
        <AboutCard character="I" onClick={handleAboutClick} />
        <LumosCard onClick={handleLumosClick} isActive={lumosOpen} onClose={handleLumosClose} />
        <div className="border border-gray-100"></div>

        <div className="border border-gray-100"></div>
        <div className="border border-gray-100"></div>
        <div className="border border-gray-100"></div>
        <div className="border border-gray-100"></div>
        <div className="border border-gray-100"></div>

        <div className="border border-gray-100"></div>
        <div className="border border-gray-100"></div>
        <AboutCard character="Z" onClick={handleAboutClick} />
        <AboutCard character="E" onClick={handleAboutClick} />
        <AboutCard character="N" onClick={handleAboutClick} />
      </div>

      {/* About section — positioned to the right of the grid, slides in */}
      <div
        ref={aboutRef}
        className="absolute top-0 right-0 h-full w-full md:w-[40vw] z-60 bg-white"
        style={{
          transform: `translateX(${window.innerWidth < 768 ? window.innerWidth : window.innerWidth * 0.4}px)`,
        }}
      >
        {aboutOpen && (
          <AboutSection
            onClose={handleAboutClose}
            skipAnimation={aboutHasPlayed}
            onAnimationComplete={() => setAboutHasPlayed(true)}
          />
        )}
      </div>

      {/* Lumos section — positioned above the grid, slides down */}
      <div
        ref={lumosRef}
        className="absolute top-0 left-0 w-full z-50 bg-white"
        style={{
          height: "66.6vh",
          transform: `translateY(-66.6vh)`,
        }}
      >
        {lumosOpen && (
          <LumosSection
            onClose={handleLumosClose}
            skipAnimation={lumosHasPlayed}
            onAnimationComplete={() => setLumosHasPlayed(true)}
          />
        )}
      </div>
    </div>
  );
}