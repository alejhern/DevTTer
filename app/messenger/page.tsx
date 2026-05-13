import AutorizePage from "@/components/autorizePage";
import { Messenger } from "@/components/messenger";

export default async function MessengerPage({
  params,
}: {
  params: Promise<{ receiver: string }>;
}) {
  const { receiver } = await params;

  return (
    <AutorizePage>
      <Messenger receiver={receiver} />
    </AutorizePage>
  );
}
