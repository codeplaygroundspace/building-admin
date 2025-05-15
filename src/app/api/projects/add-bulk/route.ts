import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase/supabaseClient";

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { projects } = await request.json();
    console.log("API received projects:", projects);

    // Validate the projects array
    if (!Array.isArray(projects) || projects.length === 0) {
      console.error("Invalid request format:", projects);
      return NextResponse.json(
        {
          error: "Invalid request format. Expected an array of projects.",
        },
        { status: 400 }
      );
    }

    // Validate each project object
    const validatedProjects = projects.map((project) => {
      // Check required fields
      if (!project.cost) {
        throw new Error("All projects must have a cost");
      }

      // Format cost as a number
      const cost =
        typeof project.cost === "string"
          ? parseFloat(project.cost)
          : project.cost;

      // Check that cost is a valid number
      if (isNaN(cost)) {
        throw new Error("Cost must be a valid number");
      }

      // Return the validated project record
      return {
        description: project.description || null,
        cost: cost,
        status: project.status !== undefined ? project.status : true,
        provider_id: project.provider_id || null,
        building_id: project.building_id || null,
      };
    });

    console.log(
      `Processing ${validatedProjects.length} projects:`,
      validatedProjects
    );

    // Insert all projects into the database
    const { data, error } = await supabase
      .from("projects")
      .insert(validatedProjects)
      .select();

    if (error) {
      console.error("Error inserting projects:", error);
      return NextResponse.json(
        { error: `Error inserting projects: ${error.message}` },
        { status: 500 }
      );
    }

    console.log("Successfully inserted projects:", data);

    // Return the newly created projects
    return NextResponse.json({
      success: true,
      message: `${data.length} projects added successfully`,
      projects: data,
    });
  } catch (err) {
    console.error("Error processing add bulk projects request:", err);

    return NextResponse.json(
      {
        error: "Error processing add bulk projects request",
        message: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
