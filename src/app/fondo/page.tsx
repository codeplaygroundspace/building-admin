import MainMenu from "@/components/MainMenu";
import InfoDebt from "@/components/FinDebt";
import CreditsDebitsBreakdown from "@/components/FinCreditsDebitsBreakdown";
import FundSummary from "@/components/FinFundSummary";

export default function Savings() {
  return (
    <>
      <MainMenu />
      <FundSummary />
      <InfoDebt />
      <CreditsDebitsBreakdown />
    </>
  );
}
