import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabaseClient";

export async function POST(request: Request) {
  try {
    // Parse the request body
    const projectData = await request.json();

    // Validate the required fields
    if (!projectData.cost) {
      return NextResponse.json({ error: "Cost is required" }, { status: 400 });
    }

    // Format cost as a number
    const cost =
      typeof projectData.cost === "string"
        ? parseFloat(projectData.cost)
        : projectData.cost;

    // Check that cost is a valid number
    if (isNaN(cost)) {
      return NextResponse.json(
        { error: "Cost must be a valid number" },
        { status: 400 }
      );
    }

    // Prepare the project record
    const newProject = {
      description: projectData.description || null,
      cost: cost,
      status: projectData.status !== undefined ? projectData.status : true,
      provider_id: projectData.provider_id || null,
    };

    console.log("Adding new project:", newProject);

    // Insert the project into the database
    const { data, error } = await supabase
      .from("projects")
      .insert(newProject)
      .select();

    if (error) {
      console.error("Error inserting project:", error);
      return NextResponse.json(
        { error: `Error inserting project: ${error.message}` },
        { status: 500 }
      );
    }

    // Return the newly created project
    return NextResponse.json({
      success: true,
      message: "Project added successfully",
      project: data[0],
    });
  } catch (err) {
    console.error("Error processing add project request:", err);

    return NextResponse.json(
      {
        error: "Error processing add project request",
        message: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
