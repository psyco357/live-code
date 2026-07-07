import { NextResponse } from "next/server";
import { createLead, getAllLeads } from "@/lib/lead.services";

export async function GET() {
  try {
    const leads = await getAllLeads();

    return NextResponse.json(leads, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to get leads" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, company, email } = body;

    // Validasi sederhana
    if (!name || !company || !email) {
      return NextResponse.json(
        { message: "Name, company and email are required" },
        { status: 400 },
      );
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 },
      );
    }

    const lead = await createLead({
      name,
      company,
      email,
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to create lead" },
      { status: 500 },
    );
  }
}
