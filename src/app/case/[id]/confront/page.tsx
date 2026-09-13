import { redirect } from "next/navigation";

/** Direction C — Confront folds into Gather for now. */
export default async function ConfrontRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/case/${id}/evidence`);
}
