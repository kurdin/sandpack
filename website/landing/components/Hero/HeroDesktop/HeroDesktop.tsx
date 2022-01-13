import type { CodeEditorRef } from "@codesandbox/sandpack-react";
import {
  ClasserProvider,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackThemeProvider,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { useTransform, useViewportScroll } from "framer-motion";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { AnimatedBox, Box, Clipboard, Resources, Text } from "../../common";

import { SandpackTitle } from "./SandpackTitle";

const CUSTOM_CLASSES_MAP = {
  "sp-stack": "custom-stack__hero",
};

export const HeroDesktop: React.FC = () => {
  const { scrollY } = useViewportScroll();
  const { sandpack } = useSandpack();

  const editorRef = useRef<CodeEditorRef>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroTop, setHeroTop] = useState(0);
  const [heroHeight, setHeroHeight] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(scrollY.get());
  const scrollHeight = useMemo(() => heroHeight / 3, [heroHeight]);
  const [animationComplete, setAnimationComplete] = useState(false);
  const isMounted = useRef(false);

  scrollY.onChange((updatedScroll) => setScrollPosition(updatedScroll));

  useEffect(() => {
    const isAnimationComplete =
      scrollPosition >= heroTop + scrollHeight * 1.2 + 2;

    setAnimationComplete(isAnimationComplete);
  }, [animationComplete, scrollHeight, scrollPosition, heroTop]);

  // Push editor into view and adjust wrapper's border radius.
  const progress = useTransform(
    scrollY,
    [heroTop, heroTop + scrollHeight],
    [0, 1]
  );

  // Subtitle's opacity.
  const opacity = useTransform(
    scrollY,
    [heroTop + scrollHeight * 0.6, heroTop + scrollHeight * 0.8],
    [1, 0]
  );

  // Push logo pieces into view.
  const progressInverse = useTransform(
    scrollY,
    [heroTop, heroTop + scrollHeight],
    [1, 0]
  );

  // Rotate logo.
  const rotate = useTransform(
    scrollY,
    [heroTop + scrollHeight * 0.9, heroTop + scrollHeight * 1.1],
    [-90, 0]
  );

  // Scale down "fake" preview elements on scroll.
  const scale = useTransform(
    scrollY,
    [heroTop, heroTop + scrollHeight],
    [1, 0.5]
  );

  // Scale down the whole container on scroll.
  const containerScale = useTransform(
    scrollY,
    [heroTop, heroTop + scrollHeight],
    [1, 0.94]
  );

  // Sandpack dynamic preview opacity.
  const sandpackPreviewOpacity = useTransform(
    scrollY,
    [heroTop + scrollHeight * 1.2 + 1, heroTop + scrollHeight * 1.2 + 2],
    [0, 1]
  );

  // Get dimensions
  useLayoutEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const onResize = (): void => {
      const updatedTop = hero.offsetTop;
      setHeroTop(updatedTop);

      const updatedHeight = hero.offsetHeight;
      setHeroHeight(updatedHeight);
    };

    onResize();

    window.addEventListener("resize", onResize);
    return (): void => window.removeEventListener("resize", onResize);
  }, [heroRef]);

  useLayoutEffect(() => {
    if (isMounted.current) return;

    isMounted.current = !!heroRef.current;
  }, [heroRef]);

  useEffect(() => {
    const editorElement = editorRef.current?.getCodemirror();
    if (!editorElement) return;

    if (animationComplete && !editorElement.hasFocus) {
      editorElement.focus();

      const newState = editorElement.state.update({
        selection: { anchor: 322 },
      });

      if (newState) {
        editorElement.update([newState]);
      }
    }
  }, [animationComplete, editorRef]);

  // on focus listener
  useEffect(() => {
    const editorElement = editorRef.current?.getCodemirror();
    if (!editorElement) return;

    const finishAnimation = (): void => {
      window.scrollTo({
        top: heroTop + scrollHeight * 1.2 + 2,
        behavior: "smooth",
      });
    };

    const element = editorElement.scrollDOM.querySelector(".cm-content");

    element?.addEventListener("focus", finishAnimation);

    return (): void => {
      element?.removeEventListener("focus", finishAnimation);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorRef.current]);

  // revert all changes on scroll up
  useEffect(() => {
    if (!animationComplete) {
      sandpack.resetAllFiles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationComplete]);

  return (
    <AnimatedBox
      ref={heroRef}
      css={{ height: "200vh" }}
      style={
        {
          "--progress": isMounted ? progress : 0,
          "--opacity": isMounted ? opacity : 1,
          "--progress-inverse": isMounted ? progressInverse : 1,
          "--rotate": isMounted ? rotate : -90,
          "--scale": isMounted ? scale : 2.08,
          "--container-scale": isMounted ? containerScale : 1,
          "--sandpack-preview-opacity": isMounted ? sandpackPreviewOpacity : 0,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any
      }
    >
      <Box
        css={{
          width: "100vw",
          height: "100vh",

          position: "sticky",
          top: 0,
          transform: "scale($container-scale)",
          opacity: isMounted.current ? 1 : 0,
          transition: "opacity 300ms linear",

          display: "flex",
          borderRadius: "calc(var(--progress) * 16px)",
          overflow: "hidden",

          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            height: "100%",
            width: "100%",
            background: "$surface",
            zIndex: -1,
          },
        }}
      >
        <Box
          css={{
            width: "50vw",
            zIndex: animationComplete ? 1 : 0,
            pointerEvents: animationComplete ? "auto" : "none",

            ".sp-wrapper": {
              display: "flex",
              position: "relative",
            },

            ".sp-tabs": {
              borderBottom: "none",
            },

            ".sp-tabs-scrollable-container": {
              alignItems: "center",
              height: "auto",
              paddingTop: "16px",
              paddingBottom: "2px",
            },

            ".sp-tab-button": {
              padding: "0 1.6em",
              transition: "color .2s ease",
              borderRadius: "9999999px",
              cursor: "pointer",
            },

            ".sp-tab-button:hover": {
              background: "none",
            },

            ".sp-tab-button[data-active=true]": {
              background: "$primary",
              color: "#131313",
              border: "none",
            },

            ".sp-preview-container": {
              background: "transparent",
            },

            ".sp-preview-actions": {
              display: "none",
            },

            ".custom-stack__hero": {
              height: "100vh",
              width: "50vw",

              position: "relative",
            },

            // Editor
            ".custom-stack__hero:first-of-type": {
              borderRight: "1px solid #1c1c1c",
              left: "-50vw",
              transform: "translateX(calc($progress * 100%))",
            },
          }}
        >
          <SandpackThemeProvider theme="sandpack-dark">
            <ClasserProvider classes={CUSTOM_CLASSES_MAP}>
              <SandpackCodeEditor ref={editorRef} />
              <Box
                css={{
                  opacity: "$sandpack-preview-opacity",
                  position: "absolute",
                  top: 0,
                  transform: "translateX(100%)",
                  transition: "opacity 300ms",

                  ".custom-stack__hero": {
                    border: "none !important",
                  },
                }}
              >
                <SandpackPreview />
              </Box>
            </ClasserProvider>
          </SandpackThemeProvider>
        </Box>

        <Box
          css={{
            fontSize: "calc((100vw / 1920 * 10) * 2.08)",
            fontFamily:
              "-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
            width: "50vw",
            padding: "1.8em 3.5em",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: animationComplete ? 0 : 1,
            opacity: isMounted ? 1 : 0,
            transition: "opacity 300ms",
          }}
        >
          <Box
            css={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "absolute",
              width: "100%",
              top: 0,
              left: 0,

              transformOrigin: "top right",
              transform: "scale($scale)",
            }}
          >
            <Clipboard />
            <Resources />
          </Box>

          <Box
            css={{
              "$$logo-height": "18em",
              "$$logo-width": "9em",
              "$$logo-margin": "-5em",

              width: "100%",
              height: "calc(1.5 * $$logo-height)",

              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              margin: "auto",

              overflow: "hidden",
              transformOrigin: "top right",
              transform: "scale($scale)",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box css={{ position: "relative" }}>
              {/* Logo */}
              <Box
                css={{
                  display: "flex",
                  flexShrink: 0,
                  alignItems: "center",
                  justifyContent: "center",

                  width: "100%",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform:
                    "translate(-50%, -50%) rotate(calc($rotate * 1deg))",

                  "&::before, &::after": {
                    boxSizing: "content-box",
                    content: "''",
                    display: "block",

                    border: "2.4em solid $darkTextPrimary",
                    width: "$$logo-width",
                    height: "$$logo-height",
                  },

                  "&::before": {
                    marginTop: "$$logo-margin",
                    marginRight: "-1.1em",
                    transform:
                      "translateY(calc(-1 * ($progress-inverse * 100vw)))",
                  },

                  "&::after": {
                    marginBottom: "$$logo-margin",
                    marginLeft: "-1.1em",
                    transform:
                      "translateY(calc(1 * ($progress-inverse * 100vw)))",
                  },
                }}
              />

              <Text
                css={{
                  fontSize: "calc(1.2em * 1)",
                  textAlign: "center",
                  opacity: "$opacity",
                }}
              >
                A component toolkit for creating
                <br /> live-running code editing experiences,
                <br />
                using the power of CodeSandbox.
              </Text>
            </Box>
          </Box>

          <Box
            css={{
              width: "100%",
              position: "absolute",
              bottom: 0,
              left: 0,
              display: "flex",
              transform: "scale($scale)",
              transformOrigin: "bottom right",
            }}
          >
            <SandpackTitle />
          </Box>
        </Box>
      </Box>
    </AnimatedBox>
  );
};
