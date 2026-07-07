import { promises as fs } from "fs";
import path from "path";
import { Lead,CreateLeadInput } from "@/types/lead.types";
// import type { CreateLeadInput } from "@/types/lead.types";
import { randomUUID } from "crypto";

const filePath = path.join(process.cwd(), "data", "leads.json");

async function readLeads(): Promise<Lead[]> {
  const data = await fs.readFile(filePath, "utf8");
  return JSON.parse(data);
}

async function writeLeads(leads: Lead[]) {
  await fs.writeFile(filePath, JSON.stringify(leads, null, 2));
}
// ambil semua data
export async function getAllLeads() {
  return await readLeads();
}
// insert data
export async function createLead(data: CreateLeadInput): Promise<Lead> {
  const leads = await readLeads();

  const newLead: Lead = {
    id: randomUUID(),
    name: data.name,
    company: data.company,
    email: data.email,
    status: "New",
  };

  leads.push(newLead);

  await writeLeads(leads);

  return newLead;
}

// ambil by id
export async function getLeadById(id: string) {
  const leads = await readLeads();
  return leads.find((lead) => lead.id === id);
}

// update by id
export async function markAsQualified(id: string) {
  const leads = await readLeads();

  const leadIndex = leads.findIndex((lead) => lead.id === id);

  if (leadIndex === -1) {
    return null;
  }

  // Kalau sudah Qualified, tidak perlu diubah lagi
  if (leads[leadIndex].status === "Qualified") {
    return leads[leadIndex];
  }

  leads[leadIndex] = {
    ...leads[leadIndex],
    status: "Qualified",
    qualifiedAt: new Date().toISOString(),
  };

  await writeLeads(leads);

  return leads[leadIndex];
}