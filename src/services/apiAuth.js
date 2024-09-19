import supabase from "../utils/supabase";

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error(error.message);

  return data;
}
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();

  if (!session.session) return null;
  const { data, error } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);

  return data?.user;
}

export async function fetchLatestSchedule() {
  try {
    const { data, error } = await supabase
      .from("schedule")
      .select("*")
      .order("id", { ascending: false });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error fetching schedule:", error.message);
    throw new Error("Failed to load schedule.");
  }
}
export async function insertNewSchedule(schedule) {
  try {
    const { data, error } = await supabase.from("schedule").insert(schedule);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error inserting new schedule:", error.message);
  }
}
