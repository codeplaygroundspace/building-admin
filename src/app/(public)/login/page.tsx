import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import LoginForm from "./login-form";

export default async function LoginPage() {
  // Check if user is already logged in
  const session = await getSession();

  if (session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Administración de Edificios
          </h1>
          <p className="text-gray-600 mt-2">
            Ingrese sus credenciales para acceder
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
