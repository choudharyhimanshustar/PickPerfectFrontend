import { Banner } from "@/components/Banner";
import FlowCards from "@/components/ui/FlowCards";
import AnalysisSection from "@/components/ui/AnalysisSection";
import InfiniteMovingCardsDemo from "@/components/ui/Review";
export default function HomePage() {
  return (
    <div className="font-sans items-center min-h-screen p-4 space-y-6">
      <Banner />
      <FlowCards />
      <AnalysisSection />
      <InfiniteMovingCardsDemo />
    </div>
  );
}
