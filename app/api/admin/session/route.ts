import { NextResponse } from "next/server"
import { hasAdminAccess } from "@/lib/auth"

export async function GET() {
  return NextResponse.json({ authorized: await hasAdminAccess() })
}
