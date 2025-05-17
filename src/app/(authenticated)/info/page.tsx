import PaymentsInfo from "@/components/InfoPayments";
import ContactInfo from "@/components/InfoContacts";
import BuildingInfoCard from "@/components/InfoBuilding";

export default function Info() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-8">
        <BuildingInfoCard />
        <PaymentsInfo />
        <ContactInfo />
      </div>
    </div>
  );
}
