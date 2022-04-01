import { json, LoaderFunction, useLoaderData, useParams } from "remix";
import { db } from "~/utils/db.server";
import type { Joke } from "@prisma/client";

type LoaderData = { joke: Joke };

export const loader: LoaderFunction = async ({ params }) => {
  const joke = await db.joke.findUnique({
    where: {
      id: params.jokeId,
    },
  });
  if (!joke) throw new Error("Joke not found");
  const data: LoaderData = { joke };
  return json(data);
};

export default function JokeRoute() {
  const data = useLoaderData<LoaderData>();
  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{data.joke.content}</p>
    </div>
  );
}

export function ErrorBoundary() {
  const { jokeId } = useParams();
  return (
    <div className="error-container">{`There was an error loading joke by the id ${jokeId}. Sorry.`}</div>
  );
}
