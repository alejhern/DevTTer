import { Profile } from "@/components/profile";
import { getUserDevits } from "@/firebase/devits";
import { getUser } from "@/firebase/user";

export default async function UserPage({ params }: { params: { id: string } }) {
  const user = await getUser(params.id);
  const devits = await getUserDevits(params.id);

  return (
    <div>
      <Profile devits={devits} user={user} />
    </div>
  );
}
