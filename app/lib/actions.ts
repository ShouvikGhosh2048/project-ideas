"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { Idea } from "./definitions";
import { auth, signIn, signOut } from "@/auth";

export async function login() {
  await signIn('github');
}

export async function logout() {
  await signOut({
    redirectTo: '/',
  });
}

const FormSchema = z.object({
  title: z
    .string({
      invalid_type_error: "Please enter a title",
    })
    .max(100, {
      message: "The title can be atmost 100 characters",
    }),
  description: z
    .string({
      invalid_type_error: "Please enter a description",
    })
    .max(500, {
      message: "The description can be atmost 500 characters",
    }),
});

export type IdeaFormState = {
  errors?: {
    title?: string[];
    description?: string[];
  };
  message?: string | null;
};

export async function createIdea(prevState: IdeaFormState, formData: FormData) {
  const authResult = await auth();
  if (!authResult || !authResult.user) {
    return {
      message: "User not logged in.",
    };
  }

  const validatedFields = FormSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Field errors. Failed to create idea.",
    };
  }

  const { title, description } = validatedFields.data;
  let idea;
  try {
    idea = (await sql`
        INSERT INTO project_ideas (title, description, creator)
        VALUES (${title}, ${description}, ${authResult.user.id}) RETURNING id;
    `).rows[0] as Idea;
  } catch (error) {
    return {
      message: "Database Error. Failed to create idea.",
    };
  }

  revalidatePath("/");
  redirect(`/idea/${idea.id}`);
}

export async function editIdea(id: string, prevState: IdeaFormState, formData: FormData) {
  const authResult = await auth();
  if (!authResult || !authResult.user) {
    return {
      message: "User not logged in.",
    };
  }
  const user = authResult.user;

  const validatedFields = FormSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Field errors. Failed to edit idea.",
    };
  }

  const { title, description } = validatedFields.data;
  try {
    const updateResult = await sql`UPDATE project_ideas SET title = ${title}, description = ${description}
    WHERE id = ${id} AND creator = ${user.id};`;
    if (updateResult.rowCount === 0) {
      redirect("/profile");
    }
  } catch {
    return {
      message: "Database error. Couldn't update the idea."
    };
  }

  revalidatePath("/");
  revalidatePath('/profile');
  revalidatePath(`/idea/${id}`);
  redirect(`/idea/${id}`);
}

export type IdeaDeleteState = {
  message: string | null,
};

export async function deleteIdea(id: string) {
  const authResult = await auth();
  if (!authResult || !authResult.user) {
    return {
      message: "User not logged in."
    };
  }
  const user = authResult.user;

  try {
    const deleteQuery = await sql`DELETE FROM project_ideas WHERE id = ${id} AND creator = ${user.id};`;
    if (deleteQuery.rowCount === 0) {
      redirect("/profile");
    }
  } catch {
    return {
      message: "Database error."
    };
  }

  revalidatePath("/");
  revalidatePath(`/idea/${id}`); // Do we need to revalidate since idea is deleted?
  revalidatePath("/profile");
  redirect("/profile");
}

export async function createLike(projectId: string) {
  const authResult = await auth();
  if (!authResult || !authResult.user) {
    return 'User not logged in.';
  }
  const user = authResult.user;

  try {
    await sql`INSERT INTO project_likes(user_id, project_id) VALUES (${user.id}, ${projectId})`;
    revalidatePath(`/idea/${projectId}`);
    return 'Success';
  } catch {
    return 'Database error';
  }
}

export async function deleteLike(projectId: string) {
  const authResult = await auth();
  if (!authResult || !authResult.user) {
    return 'User not logged in.';
  }
  const user = authResult.user;

  try {
    await sql`DELETE FROM project_likes WHERE project_id = ${projectId} AND user_id = ${user.id}`;
    revalidatePath(`/idea/${projectId}`);
    return 'Success';
  } catch {
    return 'Database error';
  }
}