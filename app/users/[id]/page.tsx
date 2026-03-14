import { UserX } from "lucide-react";
import Link from "next/link";

import { Profile } from "@/components/profile";
import { getUserDevits } from "@/firebase/devits";
import { getUser } from "@/firebase/user";

function UserNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-6">
        <UserX className="w-8 h-8 text-zinc-500" />
      </div>

      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        User Not Found
      </h1>

      <p className="mt-2 text-zinc-500 max-w-sm">
        The user you are looking for does not exist or has been removed.
      </p>

      <Link
        className="mt-2 px-6 py-3 bg-black text-white dark:bg-white dark:text-black rounded-xl font-semibold"
        href="/"
      >
        Back to Home
      </Link>
    </div>
  );
}

export default async function UserPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const user = await getUser(id);
  const devits = await getUserDevits(id);

  if (!user) return <UserNotFound />;

  return <Profile devits={devits} user={user} />;
}
