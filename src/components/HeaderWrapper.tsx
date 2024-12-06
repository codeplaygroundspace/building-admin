import BuildingName from "@/components/BuildingName";
import SelectMonth from "@/components/SelectMonth";

interface HeaderWrapperProps {
  selectedMonth: string | null;
  setSelectedMonth: (month: string | null) => void;
  buildingId: string;
}

export default function HeaderWrapper({
  selectedMonth,
  setSelectedMonth,
  buildingId,
}: HeaderWrapperProps) {
  return (
    <header className="flex justify-between items-center p-4 shadow-md mb-8">
      <BuildingName buildingId={buildingId} />
      <SelectMonth
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />
    </header>
  );
}
