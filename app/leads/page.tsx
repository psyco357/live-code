import Link from "next/link";

type Lead = {
  id: string;
  name: string;
  company: string;
  email: string;
  status: string;
};

async function getLeads(): Promise<Lead[]> {
  const res = await fetch("http://localhost:3000/api/leads", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch leads");
  }

  return res.json();
}

export default async function LeadPage() {
  const leads = await getLeads();

  return (
    <main className="max-w-5xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Leads
        </h1>

        <Link
          href="/leads/new"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Lead
        </Link>
      </div>

      <div className="space-y-4">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="border rounded-lg p-5 shadow"
          >
            <h2 className="font-semibold text-lg">
              {lead.name}
            </h2>

            <p>{lead.company}</p>

            <p>{lead.email}</p>

            <p className="mt-2">
              Status :
              <strong> {lead.status}</strong>
            </p>

            <Link
              href={`/leads/${lead.id}`}
              className="text-blue-600 underline mt-3 inline-block"
            >
              View Detail
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}