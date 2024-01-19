"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { Idea } from "./definitions";

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

export type CreateIdeaState = {
  errors?: {
    title?: string[];
    description?: string[];
  };
  message?: string | null;
};

export async function createIdea(prevState: CreateIdeaState, formData: FormData) {
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
        INSERT INTO project_ideas (title, description)
        VALUES (${title}, ${description}) RETURNING id;
    `).rows[0] as Idea;
  } catch (error) {
    return {
      message: "Database Error. Failed to create idea.",
    };
  }

  revalidatePath("/");
  redirect(`/idea/${idea.id}`);
}
