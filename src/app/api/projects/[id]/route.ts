import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase/supabaseClient";

// Get single project by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Get project data
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id, cost, description, status, created_at, provider_id")
      .eq("id", id)
      .single();

    if (projectError) {
      console.error(`Error fetching project ${id}:`, projectError);
      if (projectError.code === "PGRST116") {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 }
        );
      }
      throw projectError;
    }

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Get provider data if project has a provider
    let providerName = "General";
    let providerCategory = "General";

    if (project.provider_id) {
      const { data: provider } = await supabase
        .from("providers")
        .select("id, name, provider_category_id")
        .eq("id", project.provider_id)
        .single();

      if (provider) {
        providerName = provider.name;

        // Get category name
        if (provider.provider_category_id) {
          const { data: category } = await supabase
            .from("provider_categories")
            .select("name")
            .eq("id", provider.provider_category_id)
            .single();

          if (category) {
            providerCategory = category.name;
          }
        }
      }
    }

    // Transform project data with provider information
    const formattedProject = {
      id: project.id,
      cost: project.cost || 0,
      description: project.description || "",
      status: project.status,
      created_at: project.created_at,
      provider_id: project.provider_id,
      provider_name: providerName,
      provider_category: providerCategory,
    };

    return NextResponse.json({ project: formattedProject });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project data" },
      { status: 500 }
    );
  }
}

// Update project
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const projectData = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Validate the project exists
    const { data: existingProject, error: checkError } = await supabase
      .from("projects")
      .select("id")
      .eq("id", id)
      .single();

    if (checkError || !existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Format cost as a number if provided
    const updateData: Record<string, unknown> = { ...projectData };
    delete updateData.id; // Remove id from update data

    if (updateData.cost !== undefined) {
      const cost =
        typeof updateData.cost === "string"
          ? parseFloat(updateData.cost)
          : updateData.cost;

      // Validate cost is a number
      if (cost === null || cost === undefined || Number.isNaN(Number(cost))) {
        return NextResponse.json(
          { error: "Cost must be a valid number" },
          { status: 400 }
        );
      }

      updateData.cost = cost;
    }

    // Update the project
    const { data, error } = await supabase
      .from("projects")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) {
      console.error(`Error updating project ${id}:`, error);
      return NextResponse.json(
        { error: `Error updating project: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Project updated successfully",
      project: data[0],
    });
  } catch (err) {
    console.error("Error processing update project request:", err);
    return NextResponse.json(
      {
        error: "Error processing update project request",
        message: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Delete project
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Delete the project
    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      console.error(`Error deleting project ${id}:`, error);
      return NextResponse.json(
        { error: `Error deleting project: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (err) {
    console.error("Error processing delete project request:", err);
    return NextResponse.json(
      {
        error: "Error processing delete project request",
        message: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
