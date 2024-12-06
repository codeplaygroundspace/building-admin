import CardWrapper from "@/components/CardWrapper";
import { Mail, Phone, User } from "lucide-react"; // Replace with appropriate Shadcn icons if different

export default function ContactInfo() {
  return (
    <CardWrapper title="Información de contacto">
      <ul className="list-none p-0 m-0 space-y-4">
        <li className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold ">Administración</h3>
          <div className="flex items-center gap-2 ">
            <span className="sr-only">Contacto:</span>
            <User className="w-5 h-5" aria-hidden="true" />
            <span>Carolina, HR</span>
          </div>
          <div className="flex items-center gap-2 ">
            <Phone className="w-5 h-5" aria-hidden="true" />
            <span>09583838</span>
          </div>
          <div className="flex items-center gap-2 ">
            <Mail className="w-5 h-5" aria-hidden="true" />
            <span>contacto@demo.com</span>
          </div>
        </li>
        <li className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold ">Limpieza</h3>
          <div className="flex items-center gap-2 ">
            <span className="sr-only">Limpieza contact name:</span>
            <User className="w-5 h-5" aria-hidden="true" />
            <span>Empresa Júpiter</span>
          </div>
          <div className="flex items-center gap-2 ">
            <Phone className="w-5 h-5" aria-hidden="true" />
            <span>12903232</span>
          </div>
        </li>
      </ul>
    </CardWrapper>
  );
}
