import {Cloudinary} from "@cloudinary/url-gen";
import { quality } from "@cloudinary/url-gen/actions/delivery";
import { auto } from "@cloudinary/url-gen/qualifiers/quality";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import Logo from "../../../assets/logo.svg?react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ContentCard from "../../contentCard"

gsap.registerPlugin(DrawSVGPlugin);

type LumosSectionProps = {
  onClose: () => void;
  skipAnimation?: boolean;
  onAnimationComplete?: () => void;
};

export default function LumosSection({
  onClose,
}: LumosSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const closeBtnLogoRef = useRef<HTMLDivElement>(null);
  const xSvgRef = useRef<SVGSVGElement>(null);
  const xPath1Ref = useRef<SVGPathElement>(null);
  const xPath2Ref = useRef<SVGPathElement>(null);
  const hoverTlRef = useRef<gsap.core.Timeline | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const cld = new Cloudinary({
    cloud: {
      cloudName: 'dgmjeusxh'
    }
  });

  // Define cards once, render twice for infinite scroll
  const cards = [
    { color: "black", video: cld.video('v1778131598/Lumos_Production_Jakarta_Creative_Production_House___Video_Photo_Design_-_Google_Chrome_2026-05-07_12-23-41_vchs0h').delivery(quality(auto())) },
    { color: "white", video: cld.video('v1778131591/Lumos_Production_Jakarta_Creative_Production_House___Video_Photo_Design_-_Google_Chrome_2026-05-07_12-24-30_h8vih8').delivery(quality(auto())) },
  ];

  // Infinite scroll: clone-and-reset technique
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // After mount, the container holds 2× the cards.
    // scrollWidth of the "original" half = total scrollWidth / 2.
    const handleScroll = () => {
      const halfScroll = el.scrollWidth / 2;
      const halfVerticalScroll = el.scrollHeight / 2;
      const isDesktop = window.innerWidth > 768;

      if (isDesktop) {
        if (el.scrollLeft >= halfScroll) {
          // Scrolled past all originals → jump back to start
          el.scrollLeft -= halfScroll;
        } else if (el.scrollLeft <= 0) {
          // Scrolled before beginning → jump to end of originals
          el.scrollLeft += halfScroll;
        }
      } else {
        if (el.scrollTop >= halfVerticalScroll) {
          // Scrolled past all originals → jump back to start
          el.scrollTop -= halfVerticalScroll;
        } else if (el.scrollTop <= 0) {
          // Scrolled before beginning → jump to end of originals
          el.scrollTop += halfVerticalScroll;
        }
      }
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  // Close button hover animation: Logo shrinks -> X draws in
  useEffect(() => {
    const logoEl = closeBtnLogoRef.current;
    const xSvg = xSvgRef.current;
    const xP1 = xPath1Ref.current;
    const xP2 = xPath2Ref.current;
    if (!logoEl || !xSvg || !xP1 || !xP2) return;

    // Initial state: X icon hidden, paths undrawn
    gsap.set(xSvg, { opacity: 0, scale: 0.3 });
    gsap.set([xP1, xP2], { drawSVG: "0%" });

    const tl = gsap.timeline({ paused: true });

    // Step 1: Logo scales down and fades out
    tl.to(logoEl, {
      scale: 0.3,
      opacity: 0,
      duration: 0.25,
      ease: "power2.in",
    })
      // Step 2: X icon scales up and fades in
      .to(xSvg, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: "back.out(1.7)",
      })
      // Step 3: X paths draw in with stagger
      .to(
        [xP1, xP2],
        {
          drawSVG: "100%",
          duration: 0.35,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=0.2"
      );

    hoverTlRef.current = tl;

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="h-full w-full flex flex-col"
      style={{ backgroundColor: "#7D00A3", color: "#fff" }}
    >
      <div className="h-1/6 bg-gray-100 flex justify-between">
        <div className="w-full md:w-2/10 flex items-center justify-center">
          <button
            className="bg-white border border-gray-100 w-full h-full justify-center items-center flex relative cursor-pointer"
            onClick={onClose}
            onMouseEnter={() => hoverTlRef.current?.play()}
            onMouseLeave={() => hoverTlRef.current?.reverse()}
          >
            {/* Logo — visible by default */}
            <div ref={closeBtnLogoRef}>
              <Logo className="w-10 h-10 object-contain text-black" />
            </div>
            {/* X icon — revealed on hover via DrawSVG */}
            <svg
              ref={xSvgRef}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute text-black"
            >
              <path ref={xPath1Ref} d="M18 6 6 18" />
              <path ref={xPath2Ref} d="m6 6 12 12" />
            </svg>
          </button>
          <div className="bg-white border border-gray-100 w-full h-full justify-center items-center flex">
            <ChevronLeft className="w-10 h-10 object-contain text-black" />
          </div>
          <div className="bg-white border border-gray-100 w-full h-full justify-center items-center flex">
            <ChevronRight className="w-10 h-10 object-contain text-black" />
          </div>
        </div>
        <div className="w-full md:w-2/10 h-full flex">
          <div className="w-1/3 h-full border border-gray-100 bg-white flex items-center justify-center">
            <span className="font-museo text-black text-2xl italic">2026</span>
          </div>
          <a href="https://lumosprod.vercel.app/" target="_blank" className="w-2/3 h-full bg-[#8c45f1] flex justify-center items-center">
            <span className="font-museo text-white font-bold text-2xl tracking-widest italic">
              Launch
            </span>
          </a>
        </div>
      </div>
      <div className="w-full h-5/6 bg-gray-300 flex flex-col md:flex-row">
        <div className="w-full md:w-1/15 h-fit md:h-full bg-[#8c45f1] flex items-center justify-center">
            <span className="text-4xl md:text-6xl text-white font-crimson italic md:-rotate-90 whitespace-nowrap">
            Lumos
            </span>
        </div>
        <div
          ref={scrollRef}
          className="w-full md:w-14/15 h-full bg-gray-300 md:py-4 overflow-x-auto"
        >
            <div className="h-full w-full justify-center md:justify-start items-center whitespace-nowrap flex flex-col md:flex-row gap-6 md:translate-x-6">
              {/* Original cards */}
              {cards.map((card, i) => (
                <ContentCard key={`orig-${i}`} color={card.color} cldVideo={card.video}/>
              ))}
              {/* Cloned cards for seamless loop */}
              {cards.map((card, i) => (
                <ContentCard key={`clone-${i}`} color={card.color} cldVideo={card.video}/>
              ))}

              {cards.length < 5 && (
                <>
                  {cards.map((card, i) => (
                    <ContentCard key={`clone-${i}`} color={card.color} cldVideo={card.video}/>
                  ))}
                </>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}
