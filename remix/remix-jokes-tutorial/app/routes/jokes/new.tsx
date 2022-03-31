import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
  useActionData,
} from "remix";
import { db } from "~/utils/db.server";
import invariant from "tiny-invariant";
import { requireUserId } from "~/utils/session.server";

type ActionData = {
  formError?: string;
  fieldErrors?: {
    name: string | undefined;
    content: string | undefined;
  };
  fields?: {
    name: string;
    content: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

const validateJokeName = (name: string) =>
  name.length < 3 ? "Too short" : undefined;
const validateJokeContent = (content: string) =>
  content.length < 10 ? "Too short" : undefined;

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const form = await request.formData();
  const name = form.get("name");
  const content = form.get("content");
  try {
    invariant(typeof name === "string", "Invalid name");
    invariant(typeof content === "string", "Invalid content");
  } catch (e) {
    return badRequest({ formError: "Form not submitted correctly." });
  }

  const fieldErrors = {
    name: validateJokeName(name),
    content: validateJokeContent(content),
  };
  const fields = { name, content };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  const joke = await db.joke.create({
    data: { ...fields, jokesterId: userId },
  });
  return redirect(`/jokes/${joke.id}`);
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  return null;
};

export default function NewJokeRoute() {
  const actionData = useActionData<ActionData>();
  return (
    <div>
      <p>Add your own hilarious joke</p>
      <form method="post">
        <div>
          <label>
            Name:{" "}
            <input
              type="text"
              defaultValue={actionData?.fields?.name}
              name="name"
              aria-invalid={Boolean(actionData?.fieldErrors?.name) || undefined}
            />
          </label>{" "}
          {actionData?.fieldErrors?.name ? (
            <p className="form-validation-error" role="alert" id="name-error">
              {actionData.fieldErrors.name}
            </p>
          ) : null}
        </div>
        <div>
          <label>
            Content:{" "}
            <textarea
              defaultValue={actionData?.fields?.content}
              name="content"
              aria-invalid={
                Boolean(actionData?.fieldErrors?.content) || undefined
              }
              aria-errormessage={
                actionData?.fieldErrors?.content ? "content-error" : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.content ? (
            <p
              className="form-validation-error"
              role="alert"
              id="content-error"
            >
              {actionData.fieldErrors.content}
            </p>
          ) : null}
        </div>
        <div>
          {actionData?.formError ? (
            <p className="form-validation-error" role="alert">
              {actionData.formError}
            </p>
          ) : null}
          <button type="submit" className="button">
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
