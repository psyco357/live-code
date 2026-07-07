export type LeadStatus =
  | "New"
  | "Contacted"
  | "Qualified";

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  status: LeadStatus;
  qualifiedAt?: string;
}
export type CreateLeadInput = {
  name: string;
  company: string;
  email: string;
};