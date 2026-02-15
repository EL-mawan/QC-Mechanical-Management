import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    // 1. Check Environment Variables (Values are redacted for security)
    const envStatus = {
      DATABASE_URL: process.env.DATABASE_URL ? "Set" : "Missing",
      TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN ? "Set" : "Missing",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ? process.env.NEXTAUTH_URL : "Missing",
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "Set" : "Missing",
      NODE_ENV: process.env.NODE_ENV,
    };

    // 2. Check Database Connection
    let dbStatus = "Unknown";
    let userCount = -1;
    let errorDetail = null;

    try {
      // Try a simple query
      userCount = await db.user.count();
      dbStatus = "Connected";
    } catch (e: any) {
      dbStatus = "Failed";
      errorDetail = e.message;
      console.error("Debug Route: DB Connection Failed", e);
    }

    return NextResponse.json({
      status: "Debug Check Complete",
      environment: envStatus,
      database: {
        status: dbStatus,
        userCount: userCount,
        error: errorDetail,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    return NextResponse.json({
      status: "Debug Route Error",
      error: error.message,
    }, { status: 500 });
  }
}
