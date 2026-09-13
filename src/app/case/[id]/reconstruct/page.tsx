import { redirect } from "next/navigation";

/** Direction C — Scene draft lives inside Decide (Who/How/Where). */
export default async function ReconstructRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/case/${id}/accuse`);
}
