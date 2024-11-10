import CardWrapper from "./ui-custom/CardWrapper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function FundSummary() {
  return (
    <CardWrapper title="Resumen por Fondo">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Concepto</TableHead>
            <TableHead>Gastos Comunes</TableHead>
            <TableHead>Caja Reserva</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Saldo Anterior</TableCell>
            <TableCell>$59,138.77</TableCell>
            <TableCell>$338,491.83</TableCell>
            <TableCell>$397,630.60</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Cobranza</TableCell>
            <TableCell>$8,691.01</TableCell>
            <TableCell>$27,642.99</TableCell>
            <TableCell>$36,334.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Gastos</TableCell>
            <TableCell>$27,376.74</TableCell>
            <TableCell>$283,579.00</TableCell>
            <TableCell>$310,955.74</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Créditos</TableCell>
            <TableCell>$0.00</TableCell>
            <TableCell>$0.00</TableCell>
            <TableCell>$0.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Débitos</TableCell>
            <TableCell>$10,549.40</TableCell>
            <TableCell>$0.00</TableCell>
            <TableCell>$10,549.40</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-bold">SALDO ACTUAL</TableCell>
            <TableCell className="font-bold">$29,903.64</TableCell>
            <TableCell className="font-bold">$82,555.82</TableCell>
            <TableCell className="font-bold">$112,459.46</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardWrapper>
  );
}
