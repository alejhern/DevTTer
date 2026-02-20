import { useUser } from "@/hooks/useUser";
import { Profile } from "@/components/profile";
import AutorizePage from "@/components/autorizePage";

export default function ProfilePage() {
  const user = useUser();

  return (
    <AutorizePage user={user}>{user && <Profile user={user} />}</AutorizePage>
  );
}
