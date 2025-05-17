"use client";

import { useState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { signIn } from "@/actions/auth";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

type FormState = { error?: string } | null;

// Create a simple form handler without useFormState
function useFormAction(
  action: (prevState: FormState, formData: FormData) => Promise<FormState>,
  initialState: FormState = null
) {
  const [state, setState] = useState<FormState>(initialState);
  const formActionRef = useRef<(formData: FormData) => void>();

  // Use useRef to store the action function
  const actionRef = useRef(action);

  // Keep the action reference updated
  actionRef.current = action;

  // Initialize the form action function only once
  if (!formActionRef.current) {
    formActionRef.current = async (formData: FormData) => {
      const result = await actionRef.current(state, formData);
      setState(result);
    };
  }

  return [state, formActionRef.current] as const;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {pending ? "Iniciando sesión..." : "Iniciar sesión"}
    </button>
  );
}

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction] = useFormAction(signIn);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative text-sm"
          role="alert"
        >
          {state.error}
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Correo electrónico
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="correo@ejemplo.com"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Contraseña
        </label>
        <div className="mt-1 relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={togglePasswordVisibility}
            tabIndex={0}
            aria-label={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <div>
        <SubmitButton />
      </div>
    </form>
  );
}
