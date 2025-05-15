import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase/supabaseClient";

export async function GET() {
  try {
    console.log("Seed API called");

    // Insert sample project using EXACT VALUES from the SQL file
    const { data, error } = await supabase
      .from("projects")
      .insert([
        {
          id: "1", // Using the exact ID from the SQL file
          created_at: "2025-05-15 06:46:26.597085+00",
          cost: 240329,
          description: "arreglo paredes, fachada pintada",
          status: true,
          provider_id: "215ed888-4dc0-4775-89c2-9532f5975a45",
        },
      ])
      .select();

    if (error) {
      console.error("Error seeding project:", error);

      // Try alternative approach with RLS bypass if the first insert fails
      if (error.code === "23505") {
        // Duplicate key error
        // If it's a duplicate key error, try to use upsert instead
        console.log("Trying upsert instead of insert due to duplicate key");
        const { data: upsertData, error: upsertError } = await supabase
          .from("projects")
          .upsert(
            [
              {
                id: "1",
                created_at: "2025-05-15 06:46:26.597085+00",
                cost: 240329,
                description: "arreglo paredes, fachada pintada",
                status: true,
                provider_id: "215ed888-4dc0-4775-89c2-9532f5975a45",
              },
            ],
            { onConflict: "id" }
          )
          .select();

        if (upsertError) {
          return NextResponse.json(
            {
              status: "error",
              message:
                "Failed to seed project data (both insert and upsert failed)",
              error: upsertError,
            },
            { status: 500 }
          );
        }

        return NextResponse.json({
          status: "success",
          message: "Seeded sample project data using upsert",
          data: upsertData,
        });
      }

      return NextResponse.json(
        {
          status: "error",
          message: "Failed to seed project data",
          error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "success",
      message: "Seeded sample project data",
      data,
    });
  } catch (error) {
    console.error("Seed API error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Error in seed API",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
