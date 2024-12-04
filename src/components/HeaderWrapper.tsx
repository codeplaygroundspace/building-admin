import BuildingName from "./BuildingName";
import SelectMonth from "./SelectMonth";

interface HeaderWrapperProps {
  selectedMonth: string | null;
  setSelectedMonth: (month: string | null) => void;
}

export default function HeaderWrapper({
  selectedMonth,
  setSelectedMonth,
}: HeaderWrapperProps) {
  return (
    <header className="flex justify-between items-center p-4 shadow-md mb-8">
      <BuildingName />
      <SelectMonth
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />
    </header>
  );
}
