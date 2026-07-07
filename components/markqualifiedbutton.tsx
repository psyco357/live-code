"use client";

import { useRouter } from "next/navigation";

export default function MarkQualifiedButton({
  id,
}: {
  id: string;
}) {
  const router = useRouter();

  async function handleClick() {
    const res = await fetch(`/api/leads/${id}`, {
      method: "PATCH",
    });

    if (!res.ok) {
      alert("Failed to update lead");
      return;
    }

    router.refresh();
  }

  return (
    <button
      onClick={handleClick}
      className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
    >
      Mark as Qualified
    </button>
  );
}