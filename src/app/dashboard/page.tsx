import ExpensesList from "@/components/ExpensesList";
import SelectMonth from "@/components/SelectMonth";

export default function Dashboard() {
  // Using building ID from our database
  const buildingId = "cd4d2980-8c5e-444e-9840-6859582c0ea5";

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Expenses Dashboard</h1>
        <SelectMonth />
      </div>

      <ExpensesList buildingId={buildingId} />
    </div>
  );
}
