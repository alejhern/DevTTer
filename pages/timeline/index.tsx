import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function DocsPage({userName} : {userName: string}) {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Docs</h1>
          <h1>{userName}</h1>
        </div>
      </section>
    </DefaultLayout>
  );
}

DocsPage.getInitialProps = async () =>
{

  return  await fetch('http://localhost:3000/api/hello').then(res => {
    if (res.status !== 200) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  }).then(data => {
    const {userName} = data;
    return {userName};
  })
  .catch(err => {
    console.error(err);
    return {userName: 'Error'};
  });
}