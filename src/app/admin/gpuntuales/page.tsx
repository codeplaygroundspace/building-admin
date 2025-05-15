"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import CardWrapper from "@/components/CardWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { formatUppercase } from "@/helpers/formatters";
import { PlusCircle, X, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Provider } from "@/types/expense";
import { ProjectItem, FetchedProject, SortConfig } from "@/types/project";
import { useProjects, useAddBulkProjects } from "@/lib/tanstack/projects";

export default function AdminGastosPuntualesPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoadingProviders, setIsLoadingProviders] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig<FetchedProject>>({
    key: null,
    direction: "ascending",
  });
  const [nextId, setNextId] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Query hooks
  const { data: allProjects = [], isLoading: isLoadingProjects } =
    useProjects();
  const addBulkProjects = useAddBulkProjects();

  // Debug
  useEffect(() => {
    console.log("Projects data:", allProjects);
    console.log("isLoading:", isLoadingProjects);
  }, [allProjects, isLoadingProjects]);

  // Function to get next stable ID
  const getNextStableId = useCallback(() => {
    const id = `project-${nextId}`;
    setNextId((prev) => prev + 1);
    return id;
  }, [nextId]);

  // Initialize with a single project
  const [projects, setProjects] = useState<ProjectItem[]>([
    {
      id: "project-1",
      description: "",
      cost: "",
      status: true,
      provider_id: "",
      provider_name: "",
      provider_category: "General",
    },
  ]);

  // Fetch providers on component mount
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setIsLoadingProviders(true);
        const response = await fetch("/api/providers");

        if (!response.ok) {
          throw new Error("Failed to fetch providers");
        }

        const data = await response.json();
        setProviders(data.providers || []);
      } catch (error) {
        console.error("Error fetching providers:", error);
        toast({
          title: "Error",
          description: "Failed to load providers",
        });
      } finally {
        setIsLoadingProviders(false);
      }
    };

    fetchProviders();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    projectId: string
  ) => {
    const { name, value } = e.target;
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId ? { ...project, [name]: value } : project
      )
    );
  };

  const handleProviderChange = (providerId: string, projectId: string) => {
    const selectedProvider = providers.find(
      (provider) => provider.id === providerId
    );

    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              provider_id: providerId,
              provider_name: selectedProvider?.name || "",
              provider_category: selectedProvider?.category_name || "General",
            }
          : project
      )
    );
  };

  const handleAddProject = () => {
    setProjects((prev) => [
      ...prev,
      {
        id: getNextStableId(),
        description: "",
        cost: "",
        status: true,
        provider_id: "",
        provider_name: "",
        provider_category: "General",
      },
    ]);
  };

  const handleRemoveProject = (projectId: string) => {
    // Don't allow removing if only one project remains
    if (projects.length <= 1) return;

    setProjects((prev) => prev.filter((project) => project.id !== projectId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for any validations in browser console
    console.log("Submitting projects:", projects);

    // Validate all projects
    const invalidProjects = projects.filter(
      (project) => !project.cost || !project.provider_id
    );

    if (invalidProjects.length > 0) {
      toast({
        title: "Hay un error 🥴",
        description: `Debes completar todos los datos requeridos en ${invalidProjects.length} gastos puntuales`,
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare all project data
      const projectsData = projects.map((project) => ({
        description: project.description || null,
        cost: parseFloat(project.cost),
        status: project.status,
        provider_id: project.provider_id,
      }));

      console.log("Sending data to API:", projectsData);

      // Use mutation to add projects
      await addBulkProjects.mutateAsync(projectsData);

      // Reset the form with one empty project
      setProjects([
        {
          id: getNextStableId(),
          description: "",
          cost: "",
          status: true,
          provider_id: "",
          provider_name: "",
          provider_category: "General",
        },
      ]);
    } catch (error) {
      console.error("Error al agregar gastos puntuales:", error);
      // Error is handled by the mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  // Handle sorting
  const requestSort = (key: keyof FetchedProject) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  // Get sorted projects
  const getSortedProjects = () => {
    return [...allProjects].sort((a, b) => {
      if (sortConfig.key === null) {
        return 0;
      }

      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle nullish values
      if (aValue === null || aValue === undefined) aValue = "";
      if (bValue === null || bValue === undefined) bValue = "";

      // Normalize values for comparison
      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      // Actual comparison
      const result = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      return sortConfig.direction === "ascending" ? result : -result;
    });
  };

  // Get sort direction icon
  const getSortDirectionIcon = (columnKey: keyof FetchedProject) => {
    if (sortConfig.key !== columnKey) {
      return <span className="text-gray-300 ml-1">⇅</span>;
    }

    return sortConfig.direction === "ascending" ? (
      <span className="text-black ml-1">↑</span>
    ) : (
      <span className="text-black ml-1">↓</span>
    );
  };

  // Group providers by category for better organization
  const providersByCategory = useMemo(
    () =>
      providers.reduce((acc, provider) => {
        const category = provider.category_name || "Uncategorized";
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(provider);
        return acc;
      }, {} as Record<string, Provider[]>),
    [providers]
  );

  // Check if we can add more projects (max 8)
  const canAddMoreProjects = projects.length < 8;

  // Get sorted projects
  const sortedProjects = getSortedProjects();

  // Apply pagination to projects
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedResult = sortedProjects.slice(
      startIndex,
      startIndex + rowsPerPage
    );
    console.log("Paginated projects:", paginatedResult);
    return paginatedResult;
  }, [sortedProjects, currentPage, rowsPerPage]);

  // Calculate total pages
  const totalProjects = sortedProjects.length;
  const totalPages = Math.max(1, Math.ceil(totalProjects / rowsPerPage));

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <CardWrapper title="Agregar gastos puntuales">
        <form onSubmit={handleSubmit} className="space-y-6 p-4">
          {/* Project list */}
          <div className="space-y-8">
            {projects.map((project, index) => (
              <div key={project.id} className="border rounded-lg p-4 relative">
                <div className="absolute -top-3 left-3 bg-white px-2 text-sm font-medium text-gray-600">
                  Gasto Puntual #{index + 1}
                </div>

                {projects.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 text-gray-500 hover:text-red-500"
                    onClick={() => handleRemoveProject(project.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`provider-${project.id}`}>Proveedor:</Label>
                    <Select
                      value={project.provider_id}
                      onValueChange={(value) =>
                        handleProviderChange(value, project.id)
                      }
                      required
                    >
                      <SelectTrigger id={`provider-${project.id}`}>
                        <SelectValue placeholder="Selecciona un proveedor" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(providersByCategory).map(
                          ([category, providers]: [string, Provider[]]) => (
                            <div key={category}>
                              <div className="px-2 py-1.5 text-sm font-semibold text-gray-500 bg-gray-50">
                                {category}
                              </div>
                              {providers.map((provider: Provider) => (
                                <SelectItem
                                  key={provider.id}
                                  value={provider.id}
                                >
                                  {provider.name}
                                </SelectItem>
                              ))}
                            </div>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`cost-${project.id}`}>Costo:</Label>
                    <Input
                      id={`cost-${project.id}`}
                      name="cost"
                      type="number"
                      step="0.01"
                      value={project.cost}
                      onChange={(e) => handleInputChange(e, project.id)}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`description-${project.id}`}>
                      Descripción del gasto puntual (opcional):
                    </Label>
                    <Textarea
                      id={`description-${project.id}`}
                      name="description"
                      value={project.description}
                      onChange={(e) => handleInputChange(e, project.id)}
                      placeholder="Descripción del gasto puntual"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`status-${project.id}`}>Estado:</Label>
                    <Select
                      value={project.status ? "true" : "false"}
                      onValueChange={(value) => {
                        setProjects((prevProjects) =>
                          prevProjects.map((p) =>
                            p.id === project.id
                              ? { ...p, status: value === "true" }
                              : p
                          )
                        );
                      }}
                    >
                      <SelectTrigger id={`status-${project.id}`}>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Activo</SelectItem>
                        <SelectItem value="false">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add more projects button */}
          {canAddMoreProjects && (
            <Button
              type="button"
              variant="outline"
              className="w-full border-dashed"
              onClick={handleAddProject}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar otro gasto puntual
            </Button>
          )}

          <div className="flex w-full">
            <Button
              type="submit"
              disabled={
                isSubmitting || isLoadingProviders || addBulkProjects.isPending
              }
              className="w-full bg-black hover:bg-gray-800"
            >
              {isSubmitting || addBulkProjects.isPending ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Agregando {projects.length} gastos puntuales...
                </span>
              ) : (
                `Agregar ${projects.length} gasto${
                  projects.length > 1 ? "s" : ""
                } puntual${projects.length > 1 ? "es" : ""}`
              )}
            </Button>
          </div>
        </form>
      </CardWrapper>

      {/* Projects Table */}
      <CardWrapper title="Gastos puntuales registrados">
        <div className="p-4 space-y-4">
          {allProjects.length === 0 && !isLoadingProjects ? (
            <div className="text-center py-8 text-gray-500">
              No hay gastos puntuales registrados.
            </div>
          ) : (
            <>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => requestSort("provider_name")}
                      >
                        <div className="flex items-center">
                          Proveedor {getSortDirectionIcon("provider_name")}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => requestSort("provider_category")}
                      >
                        <div className="flex items-center">
                          Categoría {getSortDirectionIcon("provider_category")}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => requestSort("cost")}
                      >
                        <div className="flex items-center">
                          Costo {getSortDirectionIcon("cost")}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => requestSort("status")}
                      >
                        <div className="flex items-center">
                          Estado {getSortDirectionIcon("status")}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => requestSort("description")}
                      >
                        <div className="flex items-center">
                          Descripción {getSortDirectionIcon("description")}
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingProjects && paginatedProjects.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          <div className="flex justify-center items-center">
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            <span>Cargando datos...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : paginatedProjects.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No se encontraron resultados para la página actual.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedProjects.map((project, index) => (
                        <TableRow
                          key={project.id}
                          className={`${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          } hover:bg-primary/10 transition-colors`}
                        >
                          <TableCell className="font-medium">
                            {formatUppercase(
                              project.provider_name || "General"
                            )}
                          </TableCell>
                          <TableCell>{project.provider_category}</TableCell>
                          <TableCell>{formatCurrency(project.cost)}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                project.status
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {project.status ? "Activo" : "Inactivo"}
                            </span>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {project.description || "-"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    Filas por página:
                  </span>
                  <Select
                    value={rowsPerPage.toString()}
                    onValueChange={(value) => setRowsPerPage(Number(value))}
                  >
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue placeholder={rowsPerPage.toString()} />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 10, 20, 50].map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-2">
                  <div className="text-sm text-gray-500 whitespace-nowrap mr-2">
                    {totalProjects} gastos puntuales en total | Página{" "}
                    {currentPage} de {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="h-8 px-3"
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="h-8 px-3"
                  >
                    Siguiente
                  </Button>
                </div>
              </div>

              {/* Debug tools */}
              <div className="mt-8 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                <h3 className="text-sm font-semibold mb-2">
                  Herramientas de depuración
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      try {
                        const response = await fetch("/api/projects/debug");
                        const data = await response.json();
                        console.log("Debug response:", data);
                        toast({
                          title:
                            data.status === "success"
                              ? "Debug Exitoso"
                              : "Error de Debug",
                          description: `Conteo de proyectos: ${data.projectCount}`,
                        });
                      } catch (error) {
                        console.error("Debug error:", error);
                        toast({
                          title: "Error",
                          description: "Error al ejecutar diagnóstico",
                        });
                      }
                    }}
                  >
                    Diagnosticar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      try {
                        const response = await fetch("/api/projects/seed");
                        const data = await response.json();
                        console.log("Seed response:", data);
                        toast({
                          title:
                            data.status === "success"
                              ? "Seed Exitoso"
                              : "Error de Seed",
                          description: data.message,
                        });

                        if (data.status === "success") {
                          // Refetch projects after successful seeding
                          setTimeout(() => window.location.reload(), 1000);
                        }
                      } catch (error) {
                        console.error("Seed error:", error);
                        toast({
                          title: "Error",
                          description: "Error al insertar datos de ejemplo",
                        });
                      }
                    }}
                  >
                    Insertar Ejemplo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      try {
                        const response = await fetch(
                          "/api/projects/seed-direct"
                        );
                        const data = await response.json();
                        console.log("Direct SQL seed response:", data);
                        toast({
                          title:
                            data.status === "success"
                              ? "SQL Seed Exitoso"
                              : "Error de SQL Seed",
                          description: data.message,
                        });

                        if (data.status === "success") {
                          // Refetch projects after successful seeding
                          setTimeout(() => window.location.reload(), 1000);
                        }
                      } catch (error) {
                        console.error("Direct SQL seed error:", error);
                        toast({
                          title: "Error",
                          description: "Error al ejecutar SQL directo",
                        });
                      }
                    }}
                  >
                    SQL Directo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Force a clear cache and hard reload
                      window.localStorage.clear();
                      window.location.reload();
                    }}
                  >
                    Refrescar Forzado
                  </Button>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  <div>
                    Estado de la API:{" "}
                    {isLoadingProjects
                      ? "Cargando..."
                      : allProjects.length > 0
                      ? `${allProjects.length} proyectos cargados`
                      : "Sin datos"}
                  </div>
                  <div>
                    Datos paginados: {paginatedProjects.length} proyectos en la
                    página actual
                  </div>
                  <div>Intenta usar los botones de arriba si no ves datos</div>
                </div>

                <div className="mt-4 space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      try {
                        const response = await fetch("/api/projects/simple");
                        const data = await response.json();
                        console.log("Simple API response:", data);
                        toast({
                          title:
                            data.projects && data.projects.length > 0
                              ? "Datos Encontrados"
                              : "Sin Datos",
                          description:
                            data.projects && data.projects.length > 0
                              ? `Se encontraron ${data.projects.length} proyectos`
                              : data.error || "No se encontraron proyectos",
                        });

                        if (data.projects && data.projects.length > 0) {
                          // Force a refresh to use new data
                          window.location.reload();
                        }
                      } catch (error) {
                        console.error("Simple API error:", error);
                        toast({
                          title: "Error",
                          description: "Error al consultar API simple",
                        });
                      }
                    }}
                  >
                    API Simple
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      try {
                        const response = await fetch("/api/supabase-info");
                        const data = await response.json();
                        console.log("Supabase info:", data);
                        toast({
                          title: "Conexión Supabase",
                          description: `URL: ${data.connection_details.url}, Key: ${data.connection_details.key_status}`,
                        });
                      } catch (error) {
                        console.error("Supabase info error:", error);
                        toast({
                          title: "Error",
                          description: "Error al verificar conexión",
                        });
                      }
                    }}
                  >
                    Info Supabase
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </CardWrapper>
    </div>
  );
}
