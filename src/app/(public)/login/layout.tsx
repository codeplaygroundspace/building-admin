import React from "react";

export const metadata = {
  title: "Login - Administración de Edificios",
  description: "Administración de Edificios - Acceso al sistema",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
