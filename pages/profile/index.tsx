import { Profile } from "@/components/profile";
import { useUser } from "@/hooks/useUser";

export default function ProfilePage() {
  const user = useUser();

  if (user === undefined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        {/* Spinner animado */}
        <div className="w-16 h-16 border-4 border-t-primary border-gray-300 rounded-full animate-spin" />

        <span className="text-foreground text-lg font-medium mt-2">
          Loading profile...
        </span>
      </div>
    );
  }
  if (!user) {
    return (
      <>
        <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <h1 className="text-2xl font-bold">Unauthorized</h1>
          <p className="text-muted-foreground">
            You need to be logged in to view this page.
          </p>
        </div>
      </>
    );
  }

  return <Profile user={user} />;
}
