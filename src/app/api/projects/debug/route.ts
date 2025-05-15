import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase/supabaseClient";

export async function GET() {
  try {
    console.log("Debug API called");
    console.log(
      "Supabase URL:",
      process.env.NEXT_PUBLIC_SUPABASE_URL || "Not set"
    );

    // Test basic connection with SELECT 1
    try {
      const { data: versionData, error: versionError } = await supabase.rpc(
        "version"
      );

      if (versionError) {
        console.error(
          "Failed to connect to Supabase with version RPC:",
          versionError
        );

        // Try a simpler query
        const { data: simpleData, error: simpleError } = await supabase
          .from("projects")
          .select("count(*)", { count: "exact" });

        if (simpleError) {
          console.error("Simple query also failed:", simpleError);
          return NextResponse.json(
            {
              status: "error",
              message: "Failed to connect to Supabase",
              error: {
                version_error: versionError,
                simple_error: simpleError,
              },
            },
            { status: 500 }
          );
        }

        return NextResponse.json({
          status: "partial_success",
          message: "Connected to Supabase but version RPC failed",
          count: simpleData,
        });
      }

      // Try to list tables
      const { data: tables, error: tablesError } = await supabase
        .from("information_schema.tables")
        .select("table_name")
        .eq("table_schema", "public");

      if (tablesError) {
        console.error("Error listing tables:", tablesError);
      }

      // Try direct SQL
      const { data: sqlData, error: sqlError } = await supabase.rpc(
        "exec_sql",
        {
          sql: "SELECT COUNT(*) AS count FROM projects",
        }
      );

      return NextResponse.json({
        status: "success",
        version: versionData,
        tables: tables || [],
        projects_count: sqlData && sqlData[0] ? sqlData[0].count : "unknown",
        sql_error: sqlError ? sqlError.message : null,
      });
    } catch (innerError) {
      console.error("Inner try-catch error:", innerError);
      return NextResponse.json(
        {
          status: "error",
          message: "Exception in Supabase connection test",
          error:
            innerError instanceof Error
              ? innerError.message
              : String(innerError),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Debug API error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Error in debug API",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
