"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect("/login?message=Could not authenticate user");
  }

  // Verify if they are an admin
  const { data: adminUser, error: adminError } = await supabase
    .from("admin_users")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (adminError || !adminUser) {
    // Attempt sign out because they aren't authorized
    await supabase.auth.signOut();
    return redirect("/login?message=Unauthorized. You are not an admin.");
  }

  revalidatePath("/", "layout");
  redirect("/");
}
