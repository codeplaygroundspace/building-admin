import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabaseClient";

export async function GET() {
  try {
    console.log("Direct SQL Seed API called");

    // Use raw SQL to insert the project
    const sql = `
      INSERT INTO "public"."projects" 
      ("id", "created_at", "cost", "description", "status", "provider_id") 
      VALUES 
      ('1', '2025-05-15 06:46:26.597085+00', '240329', 'arreglo paredes, fachada pintada', 'true', '215ed888-4dc0-4775-89c2-9532f5975a45')
      ON CONFLICT (id) DO UPDATE SET 
      cost = '240329',
      description = 'arreglo paredes, fachada pintada',
      status = 'true',
      provider_id = '215ed888-4dc0-4775-89c2-9532f5975a45'
      RETURNING *;
    `;

    // Execute the raw SQL
    const { data, error } = await supabase.rpc("exec_sql", { sql });

    if (error) {
      console.error("Error executing SQL:", error);

      // Try fallback method
      const { error: plainError } = await supabase
        .from("projects")
        .delete()
        .eq("id", "1");
      console.log(
        "Tried to delete existing record:",
        plainError ? "Error: " + plainError.message : "Success"
      );

      // Try simple insert again
      const { data: insertData, error: insertError } = await supabase
        .from("projects")
        .insert([
          {
            id: "1",
            cost: 240329,
            description: "arreglo paredes, fachada pintada",
            status: true,
            provider_id: "215ed888-4dc0-4775-89c2-9532f5975a45",
          },
        ])
        .select();

      if (insertError) {
        return NextResponse.json(
          {
            status: "error",
            message: "Failed with all seeding methods",
            mainError: error,
            insertError,
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        status: "success",
        message: "Seeded after cleanup",
        data: insertData,
      });
    }

    return NextResponse.json({
      status: "success",
      message: "Seeded using direct SQL",
      data,
    });
  } catch (error) {
    console.error("Direct SQL Seed API error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Error in direct SQL seed API",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
