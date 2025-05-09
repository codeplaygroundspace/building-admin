import PaymentsInfo from "@/components/InfoPayments";
import ContactInfo from "@/components/InfoContacts";
import BuildingInfoCard from "@/components/InfoBuilding";

export default function Info() {
  return (
    <>
      <BuildingInfoCard />
      <PaymentsInfo />
      <ContactInfo />
    </>
  );
}
