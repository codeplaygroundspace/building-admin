import CardWrapper from "@/components/CardWrapper";
import BuildingInfo from "@/components/building-info";

export default function BuildingInfoCard() {
  return (
    <CardWrapper title="Información del Edificio">
      <div className="p-2">
        <BuildingInfo showAddress={true} />
      </div>
    </CardWrapper>
  );
}
