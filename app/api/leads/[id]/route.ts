import { NextResponse } from "next/server";
import { getLeadById,markAsQualified  } from "@/lib/lead.services";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

    const lead = await getLeadById(id);

    if (!lead) {
      return NextResponse.json(
        {
          message: "Lead not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(lead);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

    const lead = await markAsQualified(id);

    if (!lead) {
      return NextResponse.json(
        { message: "Lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(lead);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to update lead" },
      { status: 500 }
    );
  }
}