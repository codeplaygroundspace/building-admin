import InfoBox from "@/components/InfoBox";
import Header from "../components/Header";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <Header />
      <Button>Button</Button>
      <InfoBox />
    </div>
  );
}
