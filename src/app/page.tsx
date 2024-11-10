import Header from "../components/Header";
import PaymentsInfo from "@/components/InfoPayments";
import ContactInfo from "@/components/InfoContacts";
import InfoDebt from "@/components/FinDebt";
import FundSummary from "@/components/FinFundSummary";
import ExpenseBreakdown from "@/components/FinExpenseBreakdown";
import CreditsDebitsBreakdown from "@/components/FinCreditsDebitsBreakdown";
import ApartmentFinancialBreakdown from "@/components/FinApartmentFinancialBreakdown";

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
