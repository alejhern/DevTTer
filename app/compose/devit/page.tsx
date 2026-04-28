import AutorizePage from "@/components/autorizePage";
import { DevitForm } from "@/components/devitForm";

export default async function ComposeDevit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const idDevit = id || undefined;

  return (
    <AutorizePage>
      <div className="w-full">
        <DevitForm idDevit={idDevit} />
      </div>
    </AutorizePage>
  );
}
