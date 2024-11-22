import MainMenu from "@/components/MainMenu";
import ApartmentFinancialBreakdown from "@/components/FinApartmentFinancialBreakdown";
import FinTotal from "@/components/FinTotal";

export default function Home() {
  return (
    <>
      <MainMenu />
      <FinTotal />
      <ApartmentFinancialBreakdown />
    </>
  );
}
