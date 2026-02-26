export default function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <h1 className="text-4xl font-bold">404 - Not Found</h1>
      <p className="text-lg text-muted-foreground">
        The page you are looking for does not exist.
      </p>
    </section>
  );
}
