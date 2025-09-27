import { HeroHeader } from "@/components/custom/header";
import { Highlighter } from "@/components/magicui/highlighter";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { TextEffect } from "@/components/ui/text-effect";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomeView() {
  return (
    <>
      <HeroHeader />
      <main className="relative min-h-screen overflow-hidden">
        <section className="relative z-10">
          <div className="relative pt-24 md:pt-36">
            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      delayChildren: 1,
                    },
                  },
                },
                item: {
                  hidden: {
                    opacity: 0,
                    y: 20,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: "spring" as const,
                      bounce: 0.3,
                      duration: 2,
                    },
                  },
                },
              }}
              className="absolute inset-0 -z-20"
            >
              <div></div>
            </AnimatedGroup>
            <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,hsl(var(--background))_75%)]"></div>
            <div className="mx-auto max-w-7xl px-6 relative z-20">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                <AnimatedGroup
                  variants={{
                    item: {
                      hidden: {
                        opacity: 0,
                        y: 20,
                      },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          type: "spring" as const,
                          bounce: 0.3,
                          duration: 2,
                        },
                      },
                    },
                  }}
                >
                  <Link
                    href="#link"
                    className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950 max-sm:pl-3 max-sm:gap-x-2"
                  >
                    <span className="text-foreground text-sm">
                      Support for Anthropic Models coming
                    </span>
                    <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

                    <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                      <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </AnimatedGroup>
                <h1 className="mt-8 tracking-tight max-sm:text-4xl font-bold text-6xl md:text-7xl lg:mt-12 xl:text-[5.25rem]">
                  Build Modern Websites In{" "}
                  <Highlighter color="#FF1616" multiline>
                    Minutes
                  </Highlighter>{" "}
                  , Not{" "}
                  <Highlighter action="crossed-off" color="#FF1616">
                    Days
                  </Highlighter>
                </h1>
                <TextEffect
                  per="line"
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  delay={0.5}
                  as="p"
                  className="mx-auto mt-8 max-w-2xl text-balance text-muted-foreground text-lg"
                >
                  Highly customizable components for building modern websites and
                  applications that look and feel the way you mean it.
                </TextEffect>

                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.75,
                        },
                      },
                    },
                    item: {
                      hidden: {
                        opacity: 0,
                        filter: "blur(12px)",
                        y: 12,
                      },
                      visible: {
                        opacity: 1,
                        filter: "blur(0px)",
                        y: 0,
                        transition: {
                          type: "spring" as const,
                          bounce: 0.3,
                          duration: 1.5,
                        },
                      },
                    },
                  }}
                  className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row"
                >
                  <div
                    key={1}
                    className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5"
                  >
                    <RainbowButton className="py-5 px-9" asChild variant={"outline"}>
                      <Link href="/projects">
                        <span className="text-nowrap">Start Building</span>
                      </Link>
                    </RainbowButton>
                  </div>
                </AnimatedGroup>
              </div>
            </div>

            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.75,
                    },
                  },
                },
                item: {
                  hidden: {
                    opacity: 0,
                    filter: "blur(12px)",
                    y: 12,
                  },
                  visible: {
                    opacity: 1,
                    filter: "blur(0px)",
                    y: 0,
                    transition: {
                      type: "spring" as const,
                      bounce: 0.3,
                      duration: 1.5,
                    },
                  },
                },
              }}
            >
              <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20 z-20">
                <div
                  aria-hidden
                  className="bg-gradient-to-b to-background from-transparent from-85% absolute inset-0 z-10"
                />
                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
                  <Image
                    className="bg-background aspect-15/8 relative hidden rounded-2xl dark:block"
                    src="/elements-dark.png"
                    alt="app screen"
                    width="2700"
                    height="1440"
                  />
                  {/*<Image
                    className="z-2 border-border/25 aspect-15/8 relative rounded-2xl border dark:hidden"
                    src="/elements-light.png"
                    alt="app screen"
                    width="2700"
                    height="1440"
                  />*/}
                </div>
              </div>
            </AnimatedGroup>
          </div>
        </section>
      </main>
    </>
  );
}
