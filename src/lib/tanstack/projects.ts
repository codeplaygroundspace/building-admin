import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { projectKeys } from "./query-keys";
import { FetchedProject, ProjectItem } from "@/types/project";
import { toast } from "@/components/ui/use-toast";
import { getBaseUrl } from "@/lib/utils";

// Fetch all projects
export function useProjects() {
  const baseUrl = getBaseUrl();

  return useQuery({
    queryKey: projectKeys.lists(),
    queryFn: async () => {
      console.log("Fetching projects...");
      const response = await fetch(`${baseUrl}/api/projects`);
      console.log("API Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to fetch projects:", errorText);
        throw new Error("Failed to fetch projects");
      }

      const data = await response.json();
      console.log("Projects API response:", data);

      // Make sure projects is an array and normalize IDs to strings
      const projects = data.projects || [];

      if (projects.length === 0) {
        console.warn(
          "API returned zero projects, this might indicate a data issue"
        );
      }

      if (projects.length > 0) {
        console.log("First project sample:", projects[0]);

        // Convert all IDs to strings in a new array
        return projects.map((p: FetchedProject) => ({
          ...p,
          id: p.id.toString(), // Ensure ID is a string
        }));
      }

      return projects;
    },
    placeholderData: (previousData) => previousData,
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnReconnect: true,
    retry: 2, // Try up to 3 times total (initial + 2 retries)
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
  });
}

// Fetch a single project by ID
export function useProject(id: string) {
  const queryClient = useQueryClient();
  const baseUrl = getBaseUrl();

  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/api/projects/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch project");
      }
      const data = await response.json();
      return data.project as FetchedProject;
    },
    enabled: !!id, // Only fetch when id is available
    placeholderData: (previousData) => previousData,
    initialData: () => {
      // Try to get the project from the projects list cache
      const projectsCache = queryClient.getQueryData(projectKeys.lists()) as
        | FetchedProject[]
        | undefined;
      if (projectsCache) {
        const cachedProject = projectsCache.find(
          (project) => project.id === id
        );
        if (cachedProject) return cachedProject;
      }
      return undefined;
    },
  });
}

// Add a single project
export function useAddProject() {
  const queryClient = useQueryClient();
  const baseUrl = getBaseUrl();

  return useMutation({
    mutationFn: async (
      project: Omit<ProjectItem, "id" | "provider_name" | "provider_category">
    ) => {
      const response = await fetch(`${baseUrl}/api/projects/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add project");
      }

      const data = await response.json();
      return data.project;
    },
    onSuccess: () => {
      // Invalidate projects list to refetch
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      toast({
        title: "Listo ✅",
        description: "Gasto puntual añadido correctamente",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error al añadir gasto puntual",
      });
    },
  });
}

// Add multiple projects
export function useAddBulkProjects() {
  const queryClient = useQueryClient();
  const baseUrl = getBaseUrl();

  interface ProjectSubmission {
    description: string | null;
    cost: number;
    status: boolean | undefined;
    provider_id: string;
    building_id?: string;
  }

  return useMutation({
    mutationFn: async (projects: ProjectSubmission[]) => {
      console.log("Mutation called with:", projects);

      const response = await fetch(`${baseUrl}/api/projects/add-bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projects }),
      });

      console.log("API Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to add projects:", errorData);
        throw new Error(errorData.message || "Failed to add projects");
      }

      const data = await response.json();
      console.log("API Response data:", data);
      return data.projects;
    },
    onSuccess: (_, variables) => {
      // Invalidate projects list to refetch
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      toast({
        title: "Listo ✅",
        description: `${variables.length} gastos puntuales añadidos correctamente`,
      });
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error al añadir gasto puntual",
      });
    },
  });
}

// Update a project
export function useUpdateProject() {
  const queryClient = useQueryClient();
  const baseUrl = getBaseUrl();

  return useMutation({
    mutationFn: async (project: Partial<ProjectItem> & { id: string }) => {
      const response = await fetch(`${baseUrl}/api/projects/${project.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update project");
      }

      const data = await response.json();
      return data.project;
    },
    onSuccess: (data) => {
      // Invalidate specific project and list
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      toast({
        title: "Listo ✅",
        description: "Gasto puntual actualizado correctamente",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error al actualizar gasto puntual",
      });
    },
  });
}

// Delete a project
export function useDeleteProject() {
  const queryClient = useQueryClient();
  const baseUrl = getBaseUrl();

  return useMutation({
    mutationFn: async (projectId: string) => {
      const response = await fetch(`${baseUrl}/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete project");
      }

      return projectId;
    },
    onSuccess: (projectId) => {
      // Invalidate projects list to refetch
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      // Remove the deleted project from cache
      queryClient.removeQueries({ queryKey: projectKeys.detail(projectId) });
      toast({
        title: "Listo ✅",
        description: "Gasto puntual eliminado correctamente",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error al eliminar gasto puntual",
      });
    },
  });
}
