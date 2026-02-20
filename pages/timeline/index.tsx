import type { Devit } from "@/types";

import { title } from "@/components/primitives";
import Post from "@/components/post";

const mockPost: Devit = {
  id: "1",
  title: "Hello World",
  content: "This is my first post on Devtter!",
  code: {
    language: "typescript",
    content: "console.log('Hello Devtter!');",
  },
  author: {
    id: "123",
    userName: "johndoe",
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  createdAt: new Date(),
};

export default function Timeline({ userName }: { userName: string }) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title()}>Timeline</h1>
        <h1>{userName}</h1>
      </div>
      <Post {...mockPost} />
    </section>
  );
}

Timeline.getInitialProps = async () => {
  return await fetch("http://localhost:3000/api/hello")
    .then((res) => {
      if (res.status !== 200) {
        throw new Error("Failed to fetch data");
      }

      return res.json();
    })
    .then((data) => {
      const { userName } = data;

      return { userName };
    })
    .catch((err) => {
      console.error(err);

      return { userName: "Error" };
    });
};
