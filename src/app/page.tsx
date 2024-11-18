import FundSummary from "@/components/FinFundSummary";
import MainMenu from "@/components/MainMenu";
import ApartmentFinancialBreakdown from "@/components/FinApartmentFinancialBreakdown";

export default function Home() {
  return (
    <>
      <MainMenu />
      <FundSummary />
      <ApartmentFinancialBreakdown />
    </>
  );
}
