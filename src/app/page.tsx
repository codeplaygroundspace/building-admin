import Header from "../components/Header";
import PaymentsInfo from "@/components/PaymentsInfo";
import ContactInfo from "@/components/ContactInfo";
import InfoDebt from "@/components/InfoDebt";
import FundSummary from "@/components/FundSummary";
import ExpenseBreakdown from "@/components/ExpenseBreakdown";
import CreditsDebitsBreakdown from "@/components/CreditsDebitsBreakdown";
import ApartmentFinancialBreakdown from "@/components/ApartmentFinancialBreakdown";

export default function Home() {
  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <div className="p-4 space-y-6">
        <Header />
        <ExpenseBreakdown />
        <InfoDebt />
        <CreditsDebitsBreakdown />
        <FundSummary />
        <ApartmentFinancialBreakdown />
        <PaymentsInfo />
        <ContactInfo />
      </div>
    </div>
  );
}
