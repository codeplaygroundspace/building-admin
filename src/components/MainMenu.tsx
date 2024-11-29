import { House, Receipt, PiggyBank, Info } from "lucide-react";
import Link from "next/link";

export default function MainMenu() {
  const menuItems = [
    { icon: House, label: "Apto", href: "/" },
    { icon: Receipt, label: "GC", href: "/gcomunes" },
    { icon: PiggyBank, label: "Fondo", href: "/fondo" },
    { icon: Info, label: "Info", href: "/info" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-20">
      <ul className="flex justify-around items-center h-16">
        {menuItems.map((item, index) => (
          <li key={index} className="flex-1">
            <Link
              href={item.href}
              className="flex flex-col items-center justify-center h-full"
            >
              <item.icon className="w-6 h-6 text-gray-600" />
              <span className="mt-1 text-xs text-gray-600">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
