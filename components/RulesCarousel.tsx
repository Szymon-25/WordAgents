"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const rulesSlides = [
  {
    icon: "🎯",
    title: "Game Objective",
    description: "Two teams compete to identify their agents on a 5×5 grid of words. The first team to find all their agents wins!",
    color: "from-blue-500 to-indigo-600"
  },
  {
    icon: "🎭",
    title: "Spymaster Role",
    description: "The Spymaster sees all card colors and gives one-word clues followed by a number to help teammates identify their agents.",
    color: "from-purple-500 to-pink-600"
  },
  {
    icon: "🕵️",
    title: "Guesser Role",
    description: "Guessers see neutral cards and must identify their team's agents based on the Spymaster's clues. Choose wisely!",
    color: "from-green-500 to-teal-600"
  },
  {
    icon: "🎨",
    title: "Card Types",
    description: "Blue & Red agents (9 each), Neutral bystanders (7), and 1 Assassin. Avoid the assassin at all costs - it's an instant loss!",
    color: "from-orange-500 to-red-600"
  },
  {
    icon: "🔗",
    title: "Playing Together",
    description: "Share the 4-character game code with your team. Everyone with the same code sees the same board. Perfect for remote play!",
    color: "from-cyan-500 to-blue-600"
  },
];

export default function RulesCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="w-full">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {rulesSlides.map((slide, index) => (
            <CarouselItem key={index}>
              <Card className="border-2 shadow-lg">
                <CardContent className="flex flex-col items-center justify-center p-6 min-h-[240px]">
                  <div className={cn(
                    "text-6xl mb-4 p-4 rounded-full bg-gradient-to-br",
                    slide.color,
                    "bg-opacity-10"
                  )}>
                    {slide.icon}
                  </div>
                  <h3 className={cn(
                    "text-2xl font-bold mb-3 bg-gradient-to-r bg-clip-text text-transparent",
                    slide.color
                  )}>
                    {slide.title}
                  </h3>
                  <p className="text-center text-gray-700 leading-relaxed">
                    {slide.description}
                  </p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4 sm:-left-12" />
        <CarouselNext className="-right-4 sm:-right-12" />
      </Carousel>
      <div className="mt-4 flex items-center justify-center gap-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "h-2.5 w-2.5 rounded-full transition-all duration-300",
              current === index + 1
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 w-8"
                : "bg-gray-300 hover:bg-gray-400"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
