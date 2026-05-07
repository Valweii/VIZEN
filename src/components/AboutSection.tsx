import { useRef, useEffect } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

type AboutSectionProps = {
  onClose: () => void;
  skipAnimation?: boolean;
  onAnimationComplete?: () => void;
};

export default function AboutSection({
  onClose,
  skipAnimation,
  onAnimationComplete,
}: AboutSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const paragraphRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const iconOverlayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const iconTlRefs = useRef<(gsap.core.Timeline | null)[]>([]);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnOverlayRef = useRef<HTMLDivElement>(null);
  const closeBtnTlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const titleEl = titleRef.current;
    if (!titleEl) return;

    const paragraphs = paragraphRefs.current.filter(Boolean);
    const icons = iconRefs.current.filter(Boolean);

    // SplitText on the heading — split into lines first, then chars
    const split = new SplitText(titleEl, { type: "lines,chars" });

    let tl: gsap.core.Timeline | null = null;

    if (skipAnimation) {
      // Just set to final state
      gsap.set(split.chars, { opacity: 1, y: 0 });
      gsap.set(paragraphs, { opacity: 1, y: 0 });
      gsap.set(icons, { opacity: 1, y: 0 });
      gsap.set(closeBtnRef.current, { opacity: 1, scale: 1 });
    } else {
      gsap.set(split.chars, { opacity: 0, y: 50 });
      gsap.set(paragraphs, { opacity: 0, y: 30 });
      gsap.set(icons, { opacity: 0, y: 20 });
      gsap.set(closeBtnRef.current, { opacity: 0, scale: 0.5 });

      tl = gsap.timeline({
        onComplete: onAnimationComplete,
      });

      // 1. Title chars stagger in
      tl.to(split.chars, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.02,
        ease: "power3.out",
      })
        // 2. Close button pops in
        .to(
          closeBtnRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: "back.out(1.7)",
          },
          "-=0.3"
        )
        // 3. Paragraphs stagger in
        .to(
          paragraphs,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.12,
            ease: "power2.out",
          },
          "-=0.15"
        )
        // 4. Bottom icons slide up
        .to(
          icons,
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.06,
            ease: "power2.out",
          },
          "-=0.2"
        );
    }

    // Set up hover timelines for each icon cell
    iconOverlayRefs.current.forEach((overlay, i) => {
      if (!overlay) return;
      gsap.set(overlay, { scaleY: 0, transformOrigin: "bottom center" });

      const iconTl = gsap.timeline({ paused: true });
      iconTl.to(overlay, {
        scaleY: 1,
        duration: 0.5,
        ease: "expo.inOut",
      });
      iconTlRefs.current[i] = iconTl;
    });

    // Set up hover timeline for close button
    const closeOverlay = closeBtnOverlayRef.current;
    if (closeOverlay) {
      gsap.set(closeOverlay, { scaleY: 0, transformOrigin: "bottom center" });
      const closeTl = gsap.timeline({ paused: true });
      closeTl.to(closeOverlay, {
        scaleY: 1,
        duration: 0.3,
        ease: "power3.inOut",
      });
      closeBtnTlRef.current = closeTl;
    }

    return () => {
      tl?.kill();
      split.revert();
      iconTlRefs.current.forEach((t) => t?.kill());
      closeBtnTlRef.current?.kill();
    };
  }, [skipAnimation, onAnimationComplete]);

  const bodyParagraphs = [
    "Hi, we're VIZEN. Born from the idea that great digital experiences start with clear vision, we craft high-end web interactions that feel as smooth as they look.",
    "At VIZEN, design and development are never separate conversations—they evolve together. Every animation, transition, and micro-interaction is intentional, built to guide attention, tell stories, and create a sense of depth that static interfaces simply can't achieve.",
    "We specialize in pushing the boundaries of modern web experiences—transforming ideas into immersive, fluid interfaces that feel alive. Whether it's subtle motion or bold interactive moments, our work is driven by precision, curiosity, and a constant pursuit of refinement.",
    "Because at VIZEN, we don't just build websites—\nwe shape how they feel.",
  ];

  // SVG icons for the bottom row (mail, document, linkedin, instagram)
  const socialIcons = [
    // Mail
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
    // Document
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>,
    // LinkedIn
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>,
    // Instagram
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>,
  ];

  return (
    <div
      ref={sectionRef}
      className="h-full w-full flex flex-col"
      style={{ backgroundColor: "#fff" }}
    >
      {/* Main content area — scrollable */}
      <div className="flex-1 overflow-y-auto px-10 py-10">
        <div className="flex justify-between align-middle">
          {/* Heading */}
          <h1
            ref={titleRef}
            className="font-museo font-bold leading-[1.05] mb-10"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              color: "#111",
              maxWidth: "90%",
            }}
          >
            A studio
            that builds {<br />}
            with vision.
          </h1>

          {/* Close button — top right */}
          <div className="flex justify-between items-start my-auto h-full">
            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="cursor-pointer flex items-center justify-center relative overflow-hidden"
              style={{
                width: "44px",
                height: "44px",
                backgroundColor: "transparent",
                color: "#111",
                fontSize: "20px",
                lineHeight: 1,
                border: "none",
              }}
              onMouseEnter={() => {
                closeBtnTlRef.current?.play();
              }}
              onMouseLeave={() => {
                closeBtnTlRef.current?.reverse();
              }}
            >
              {/* GSAP overlay — fills from bottom */}
              <div
                ref={closeBtnOverlayRef}
                className="absolute inset-0"
                style={{ backgroundColor: "#CCFF00", willChange: "transform" }}
              />
              <span className="relative z-10">✕</span>
            </button>
          </div>
        </div>

        {/* Body paragraphs */}
        <div className="flex flex-col gap-6" style={{ maxWidth: "95%" }}>
          {bodyParagraphs.map((text, i) => (
            <p
              key={i}
              ref={(el) => {
                paragraphRefs.current[i] = el;
              }}
              className="leading-relaxed"
              style={{
                fontSize: "clamp(0.875rem, 1.2vw, 1rem)",
                color: "#333",
                whiteSpace: i === bodyParagraphs.length - 1 ? "pre-line" : undefined,
                fontWeight: i === bodyParagraphs.length - 1 ? 600 : 400,
              }}
            >
              {text}
            </p>
          ))}
        </div>
      </div>

      {/* Bottom icon row */}
      <div
        className="grid grid-cols-4 border-t border-gray-200"
        style={{ height: "128px", flexShrink: 0 }}
      >
        {socialIcons.map((icon, i) => (
          <div
            key={i}
            ref={(el) => {
              iconRefs.current[i] = el;
            }}
            className="relative flex items-center justify-center cursor-pointer border-r border-gray-200 last:border-r-0 overflow-hidden"
            style={{ color: "#111" }}
            onMouseEnter={() => {
              iconTlRefs.current[i]?.play();
              // Blur sibling icon boxes
              iconRefs.current.forEach((el, j) => {
                if (j !== i && el) {
                  gsap.to(el, {
                    filter: "blur(3px)",
                    opacity: 0.4,
                    duration: 0.35,
                    ease: "power2.out",
                  });
                }
              });
            }}
            onMouseLeave={() => {
              iconTlRefs.current[i]?.reverse();
              // Unblur all siblings
              iconRefs.current.forEach((el, j) => {
                if (j !== i && el) {
                  gsap.to(el, {
                    filter: "blur(0px)",
                    opacity: 1,
                    duration: 0.35,
                    ease: "power2.out",
                  });
                }
              });
            }}
          >
            {/* GSAP overlay — fills from bottom */}
            <div
              ref={(el) => {
                iconOverlayRefs.current[i] = el;
              }}
              className="absolute inset-0"
              style={{ backgroundColor: "#CCFF00", willChange: "transform" }}
            />
            {/* Icon — above overlay */}
            <span className="relative z-10">{icon}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
