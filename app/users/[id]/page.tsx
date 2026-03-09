import { Profile } from "@/components/profile";
import { getUserDevits } from "@/firebase/devits";
import { getUser } from "@/firebase/user";

export default async function UserPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const user = await getUser(id);
  const devits = await getUserDevits(id);

  return (
    <div>
      <Profile devits={devits} user={user} />
    </div>
  );
}
