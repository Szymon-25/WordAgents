"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";

const rulesSlides = [
  {
    image: "/guesser_view.png",
    title: "Game Objective",
    description: "Two teams compete to identify their agents on a 5×5 grid of words. The first team to uncover all words of their color wins!",
    color: "from-blue-500 to-indigo-600"
  },
  {
    image: "/spymaster_view.png",
    title: "Spymaster Role",
    description: "Spymasters give a one-word clue and number showing how many tiles their team should guess in this turn.",
    color: "from-purple-500 to-pink-600"
  },
  {
    image: "/opis_kartek.png",
    title: "Card Types",
    description: "Red & Blue tiles (8 or 9), Neutral bystanders (7), and Assassin (1). \nAvoid the assassin at all costs - it's an instant loss!",
    color: "from-green-500 to-teal-600"
  },
  {
    image: "/scoring_points.png",
    title: "Additional Rule",
    description: "If you uncover a neutral or opposing team's tile, your turn ends immediately, even if the Spymaster's clue number was higher.",
    color: "from-cyan-500 to-blue-600"
  },
  {
    image: "/code_share.png",
    title: "Playing Together",
    description: "Share the code. It gives everyone the same board.\nChoose to be Spymaster or Guesser.",
    color: "from-orange-500 to-red-600"
  },
];

export default function RulesCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [canPrev, setCanPrev] = React.useState(false);
  const [canNext, setCanNext] = React.useState(false);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
      setCanPrev(api.canScrollPrev());
      setCanNext(api.canScrollNext());
    };

    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  return (
    <div className="w-full">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {rulesSlides.map((slide, index) => (
            <CarouselItem key={index}>
              <Card className="border-0 shadow-none">
                  <CardContent className="flex flex-col items-center justify-center p-6 h-[500px]">
                    <div className={cn(
                      "mb-4 p-4 rounded-lg bg-gradient-to-br flex items-center justify-center w-full max-w-[400px] h-[280px]",
                      slide.color,
                      "bg-opacity-20"
                    )}>
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        width={512}
                        height={512}
                        className="w-full h-auto max-h-[250px] object-contain block rounded-lg"
                      />
                    </div>
                    <h3 className="text-2xl pt-10 font-bold mb-3 text-[#110b66]">
                    {slide.title}
                    </h3>
                  <p className="text-center text-gray-700 leading-relaxed whitespace-pre-line max-w-[500px]">
                    {slide.description}
                  </p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Prev/Next inside the carousel box with padding to edge. Hidden on ends. */}
        {canPrev && (
          <button
            onClick={() => api?.scrollPrev()}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="h-6 w-6 text-[#110b66]" />
          </button>
        )}

        {canNext && (
          <button
            onClick={() => api?.scrollNext()}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full flex items-center justify-center"
          >
            <ArrowRight className="h-6 w-6 text-[#110b66]" />
          </button>
        )}
      </Carousel>
      <div className="mt-4 flex items-center justify-center gap-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "h-2.5 w-2.5 rounded-full transition-all duration-300",
              current === index + 1
          ? "bg-[#110b66] w-3"
          : "bg-gray-300 hover:bg-gray-400"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
