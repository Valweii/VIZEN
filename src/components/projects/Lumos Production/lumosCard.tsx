// import LumosIcon from "../../../assets/Lumos/lumos.svg?react";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

gsap.registerPlugin(SplitText, DrawSVGPlugin);

type LumosCardProps = {
    onClick?: () => void;
    isActive?: boolean;
    onClose?: () => void;
};

export default function LumosCard({ onClick, isActive, onClose }: LumosCardProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const titleContainerRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const yearRef = useRef<HTMLDivElement>(null);
    const splitRef = useRef<SplitText | null>(null);
    const isAnimatingRef = useRef(false);

    // Big X SVG refs
    const xSvgRef = useRef<SVGSVGElement>(null);
    const xPath1Ref = useRef<SVGPathElement>(null);
    const xPath2Ref = useRef<SVGPathElement>(null);

    const contentWrapperRef = useRef<HTMLDivElement>(null);

    // Track isActive in a ref so closured handlers can read it
    const isActiveRef = useRef(false);
    useEffect(() => { isActiveRef.current = !!isActive; }, [isActive]);

    // Normal hover animation
    useEffect(() => {
        const content = contentRef.current;
        const titleContainer = titleContainerRef.current;
        const container = containerRef.current;
        const title = titleRef.current;
        const year = yearRef.current;
        if (!content || !titleContainer || !container || !title || !year) return;

        let mm = gsap.matchMedia();

        // Create SplitText instance exactly like AboutCard
        splitRef.current = new SplitText(title, { type: "chars" });
        const chars = splitRef.current.chars;

        mm.add("(min-width: 768px)", () => {
            // Initial state: push both containers down by 25px
            gsap.set(content, { y: 25 });
            gsap.set(titleContainer, { y: 25 });
            
            // Initial state for text chars
            gsap.set(chars, {
                opacity: 0,
                y: 0,
                rotateX: -90,
            });

            // Initial state for year
            gsap.set(year, {
                opacity: 0,
                yPercent: 100,
            });

            // Desktop: hover animations (Text chars only!)
            const tl = gsap.timeline({ paused: true });
            tl.to(chars, {
                opacity: 1,
                y: -30,
                rotateX: 0,
                duration: 0.6,
                stagger: 0.04,
                ease: "back.out(1.7)",
            })
            .to(year, {
                opacity: 1,
                yPercent: 0,
                duration: 0.4,
                ease: "power3.out",
            }, "-=0.4");

            const handleMouseEnter = () => {
                // Animate Y attribute OUTSIDE the timeline
                gsap.to([content, titleContainer], {
                    y: 0,
                    duration: 0.6,
                    ease: "power4.out"
                });
                tl.play();
            };
            
            const handleMouseLeave = () => {
                // Reset Y attribute OUTSIDE the timeline
                gsap.to([content, titleContainer], {
                    y: 45,
                    duration: 0.6,
                    ease: "power4.out",
                    delay: 0.1
                });
                tl.pause();
                setTimeout(() => tl.reverse(), 200);
            };
            
            container.addEventListener("mouseenter", handleMouseEnter);
            container.addEventListener("mouseleave", handleMouseLeave);

            return () => {
                container.removeEventListener("mouseenter", handleMouseEnter);
                container.removeEventListener("mouseleave", handleMouseLeave);
            };
        });

        mm.add("(max-width: 767px)", () => {
            // Mobile: display "active" state by default
            gsap.set(content, { y: 20 });
            gsap.set(titleContainer, { y: 0 });
            gsap.set(chars, { opacity: 1, y: 0, rotateX: 0 });
            gsap.set(year, { opacity: 1, yPercent: 0 });
        });

        return () => {
            mm.revert();
            splitRef.current?.revert();
        };
    }, []);

    // Active state: transition logo/title/year out -> big X draws in
    useEffect(() => {
        const wrapperEl = contentWrapperRef.current;
        const xSvg = xSvgRef.current;
        const xP1 = xPath1Ref.current;
        const xP2 = xPath2Ref.current;
        if (!wrapperEl || !xSvg || !xP1 || !xP2) return;

        if (isActive) {
            const tl = gsap.timeline({
                onStart: () => { isAnimatingRef.current = true; },
                onComplete: () => { isAnimatingRef.current = false; }
            });

            // Step 1: Fade out all content via the wrapper
            tl.to(wrapperEl, {
                opacity: 0,
                scale: 0.5,
                duration: 0.3,
                ease: "power2.in",
            })
            // Step 2: Show X SVG and scale it up
            .to(xSvg, {
                opacity: 1,
                scale: 1,
                duration: 0.35,
                ease: "back.out(1.7)",
            })
            // Step 3: Draw the X paths with stagger
            .to([xP1, xP2], {
                drawSVG: "100%",
                duration: 0.5,
                stagger: 0.12,
                ease: "power3.out",
            }, "-=0.2");
        } else {
            // Reverse: undraw X and show logo again
            const tl = gsap.timeline({
                onStart: () => { isAnimatingRef.current = true; },
                onComplete: () => { isAnimatingRef.current = false; }
            });

            tl.to([xP1, xP2], {
                drawSVG: "0%",
                duration: 0.2,
                ease: "power2.in",
            })
            .to(xSvg, {
                opacity: 0,
                scale: 0.3,
                duration: 0.15,
                ease: "power2.in",
            })
            .to(wrapperEl, {
                opacity: 1,
                scale: 1,
                duration: 0.25,
                ease: "power3.out",
            });
        }
    }, [isActive]);

    const handleCardClick = () => {
        if (isAnimatingRef.current) return;
        if (isActive && onClose) {
            onClose();
        } else if (!isActive && onClick) {
            onClick();
        }
    };

    return (
        <div
            ref={containerRef}
            onClick={handleCardClick}
            className="border border-gray-100 flex items-center justify-center relative overflow-hidden cursor-pointer"
        >
            {/* Wrapper that scales and transitions out on Active state cleanly */}
            <div ref={contentWrapperRef} className="absolute inset-0 w-full h-full pointer-events-none origin-center">
                {/* Image wrapper with its own translate Y logic */}
                <div ref={contentRef} className="pointer-events-none w-full h-full">
                    {/* Image shifted UP exactly by 25px so that Y:25 translates it perfectly to the center natively */}
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center -translate-y-[10%]">
                        <img src="/src/assets/Lumos/lumos.svg" alt="Lumos" className="md:w-32 md:h-32 w-16 h-16 text-black" />
                    </div>
                </div>

                {/* Title wrapper with its own independent translate Y logic */}
                <div ref={titleContainerRef} className="absolute inset-0 pointer-events-none w-full h-full">
                    {/* Bottom Center: Title sits 12px from bottom. Under Y:25 it goes to -13px and hides partly off card bounds */}
                    <div className="absolute bottom-[12px] left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                        <div className="relative px-1 py-1">
                            <div 
                                ref={titleRef} 
                                className="text-xl md:text-2xl font-light font-crimson italic"
                                style={{ perspective: "500px" }}
                            >
                                Lumos
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Right: Year — Animated Text Block */}
                <div className="absolute md:top-4 md:right-4 top-4 right-4 overflow-hidden z-20 pointer-events-none">
                    <div 
                        ref={yearRef} 
                        className="text-[10px] tracking-[0.2em] text-black"
                    >
                        2026
                    </div>
                </div>
            </div>

            {/* Big X SVG — spans full card, hidden by default, drawn in when active */}
            <svg
                ref={xSvgRef}
                className="absolute inset-0 w-8/10 h-8/10 pointer-events-none z-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                style={{ opacity: 0, transform: "scale(0.3)" }}
            >
                <path ref={xPath1Ref} d="M10 10 L90 90" vectorEffect="non-scaling-stroke" />
                <path ref={xPath2Ref} d="M90 10 L10 90" vectorEffect="non-scaling-stroke" />
            </svg>
        </div>
    );
}