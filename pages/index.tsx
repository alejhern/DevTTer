import { title, subtitle } from "@/components/primitives";

export default function IndexPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title()}>DEVTTER</h1>
        <h1 className={subtitle()}>DEVTEAM</h1>
      </div>
    </section>
  );
}
