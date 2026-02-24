export function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      {/* Spinner animado */}
      <div className="w-16 h-16 border-4 border-t-primary border-gray-300 rounded-full animate-spin" />

      <span className="text-foreground text-lg font-medium mt-2">
        Loading...
      </span>
    </div>
  );
}
