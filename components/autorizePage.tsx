import { Loading } from "./ui/loading";

import { useUser } from "@/hooks/useUser";
interface AutorizePageProps {
  children: React.ReactNode;
}

export default function AutorizePage({ children }: AutorizePageProps) {
  const user = useUser();

  if (user === undefined) {
    return <Loading />;
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

  return children;
}
