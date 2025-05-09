import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
      <h2 className="text-2xl font-bold mb-4">Página no encontrada</h2>
      <p className="text-gray-700 mb-6">
        No pudimos encontrar la página que estás buscando.
      </p>
      <Link
        href="/"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
