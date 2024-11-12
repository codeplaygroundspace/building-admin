import PaymentsInfo from "@/components/InfoPayments";
import ContactInfo from "@/components/InfoContacts";
import InfoDebt from "@/components/FinDebt";
import FundSummary from "@/components/FinFundSummary";
import ExpenseBreakdown from "@/components/FinExpenseBreakdown";
import CreditsDebitsBreakdown from "@/components/FinCreditsDebitsBreakdown";
import ApartmentFinancialBreakdown from "@/components/FinApartmentFinancialBreakdown";

export default function Home() {
  return (
    <>
      <FundSummary />
      <ExpenseBreakdown />
      <CreditsDebitsBreakdown />
      <ApartmentFinancialBreakdown />
      <InfoDebt />
      <PaymentsInfo />
      <ContactInfo />
    </>
  );
}
