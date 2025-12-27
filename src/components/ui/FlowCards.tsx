import { PiGuitar, PiRankingDuotone } from "react-icons/pi";
import { MdModelTraining } from "react-icons/md";
import { GoRocket } from "react-icons/go";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";

const cards = [
  {
    title: "Upload",
    subtitle: "Upload your music video or audio in seconds.",
    icon: <PiGuitar />,
  },
  {
    title: "Analyze",
    subtitle: "AI analyzes chords, rhythm, pitch, and timing.",
    icon: <MdModelTraining />,
  },
  {
    title: "Score",
    subtitle: "Get a clear performance score with insights.",
    icon: <PiRankingDuotone />,
  },
  {
    title: "Improve",
    subtitle: "Fix mistakes, re-record, and track progress.",
    icon: <GoRocket />,
  },
];

export default function FlowCards() {
  return (
    <section className="w-full mx-auto py-20">
      <div className="flex gap-4 h-full">
        {cards.map((card, i) => (
          <div
            key={i}
            className="
              group relative flex-1 
              bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-6
              transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
              hover:flex-[1.6] border border-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.6)]
            "
          >
            <div className="flex flex-col justify-center items-center h-full group">
              <DottedGlowBackground
                className="pointer-events-none mask-radial-to-90% mask-radial-at-center opacity-20 dark:opacity-100 group-hover:opacity-0"
                opacity={0.5}
                gap={10}
                radius={1.6}
                colorLightVar="--color-neutral-500"
                glowColorLightVar="--color-neutral-600"
                colorDarkVar="--color-neutral-500"
                glowColorDarkVar="--color-sky-800"
                backgroundOpacity={0}
                speedMin={0.8}
                speedMax={1.6}
                speedScale={0.5}
              />
              <div className="text-4xl mb-4 text-white group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.35)]">{card.icon}</div>

              <h3 className="text-lg font-semibold tracking-wide text-white">
                {card.title}
              </h3>

              <p
                className="
                  mt-2 text-md text-zinc-400
                  opacity-0 translate-y-2
                  group-hover:opacity-100 group-hover:translate-y-0
                  transition-all duration-300
                "
              >
                {card.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
