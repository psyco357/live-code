import Link from "next/link";
import { notFound } from "next/navigation";
import MarkQualifiedButton from "@/components/markqualifiedbutton";

type Lead = {
  id: string;
  name: string;
  company: string;
  email: string;
  status: "New" | "Contacted" | "Qualified";
  qualifiedAt?: string;
};

async function getLead(id: string): Promise<Lead> {
  const res = await fetch(
    `http://localhost:3000/api/leads/${id}`,
    {
      cache: "no-store",
    }
  );

  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    throw new Error("Failed to fetch lead");
  }

  return res.json();
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const lead = await getLead(id);

  return (
    <main className="max-w-3xl mx-auto p-8">

      <Link
        href="/leads"
        className="text-blue-600 underline"
      >
        ← Back
      </Link>

      <div className="border rounded-lg p-6 mt-6">

        <h1 className="text-3xl font-bold mb-6">
          {lead.name}
        </h1>

        <div className="space-y-3">

          <p>
            <strong>Company:</strong>{" "}
            {lead.company}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {lead.email}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {lead.status}
          </p>

          <p>
            <strong>Qualified At:</strong>{" "}
            {lead.qualifiedAt
              ? new Date(
                  lead.qualifiedAt
                ).toLocaleString()
              : "-"}
          </p>

        </div>

        {lead.status !== "Qualified" && (
          <div className="mt-8">
            <MarkQualifiedButton
              id={lead.id}
            />
          </div>
        )}

      </div>

    </main>
  );
}