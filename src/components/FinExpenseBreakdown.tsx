import CardWrapper from "./ui-custom/CardWrapper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function ExpenseBreakdown() {
  return (
    <CardWrapper title="Desglose de Gastos">
      <Table aria-label="Desglose de Gastos">
        <TableHeader>
          <TableRow>
            <TableHead>Gasto</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Importe</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* MANTENIMIENTOS Y CONSUMOS */}
          <TableRow>
            <TableCell>U.T.E.</TableCell>
            <TableCell>Consumo 23/08/2024 - 23/09/2024</TableCell>
            <TableCell>
              <Badge variant="secondary">Mantenimiento y consumo</Badge>
            </TableCell>
            <TableCell>- $1,052.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>U.T.E.</TableCell>
            <TableCell>Consumo 23/08/2024 - 23/09/2024 Bomba</TableCell>
            <TableCell>
              <Badge variant="secondary">Mantenimiento y consumo</Badge>
            </TableCell>
            <TableCell>- $863.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>O.S.E.</TableCell>
            <TableCell>Consumo 07/09/2024 - 08/10/2024</TableCell>
            <TableCell>
              <Badge variant="secondary">Mantenimiento y consumo</Badge>
            </TableCell>
            <TableCell>- $2,973.00</TableCell>
          </TableRow>

          {/* SERVICIOS */}
          <TableRow>
            <TableCell>Limpieza</TableCell>
            <TableCell>Júpiter Setiembre 2024</TableCell>
            <TableCell>
              <Badge variant="secondary">Servicios</Badge>
            </TableCell>
            <TableCell>- $4,600.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Sanitaria</TableCell>
            <TableCell>
              Patrón, hidrolavado en camaras generales y desagues
            </TableCell>
            <TableCell>
              <Badge variant="secondary">Servicios</Badge>
            </TableCell>
            <TableCell>- $13,398.00</TableCell>
          </TableRow>

          {/* ADMINISTRACION */}
          <TableRow>
            <TableCell>Honorarios </TableCell>
            <TableCell>Inmco Octubre 2024</TableCell>
            <TableCell>
              <Badge variant="secondary">Administración</Badge>
            </TableCell>
            <TableCell>- $4,338.00</TableCell>
          </TableRow>

          {/* BANCO */}
          <TableRow>
            <TableCell>Comisiones</TableCell>
            <TableCell>BROU</TableCell>
            <TableCell>
              <Badge variant="secondary">Banco</Badge>
            </TableCell>
            <TableCell>- $152.74</TableCell>
          </TableRow>

          {/* Total */}
          <TableRow>
            <TableCell colSpan={3} className="font-bold">
              Total de Gastos:
            </TableCell>
            <TableCell className="font-bold">- $27,376.74</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardWrapper>
  );
}
