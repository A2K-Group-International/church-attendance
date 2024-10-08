import supabase from '../utils/supabase';

// Login function
export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error(error.message);

  return data;
}

// Logout function
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

// Get current user function
export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();

  if (!session.session) return null;
  const { data, error } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);

  return data?.user;
}

// Fetch the latest schedule
export async function fetchLatestSchedule() {
  try {
    const { data, error } = await supabase
      .from('schedule')
      .select('schedule, time')
      .order('id', { ascending: false });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching schedule:', error.message);
    throw new Error('Failed to load schedule.');
  }
}

export async function fetchTime(selectedDate) {
  try {
    const { data, error } = await supabase
      .from('schedule')
      .select('schedule, time')
      .eq('schedule', selectedDate);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching schedule:', error.message);
    throw new Error('Failed to load schedule.');
  }
}
export async function fetchAllEvents(id) {
  try {
    const { data, error } = await supabase
      .from("schedule")
      .select("*")
      .order("id", { ascending: false });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error fetching events:", error.message);
    throw new Error("Failed to load events.");
  }
}

// Insert new schedule
export async function insertNewSchedule(schedule, time) {
  try {
    const { data, error } = await supabase
      .from('schedule')
      .insert(schedule, time);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error inserting new schedule:', error.message);
  }
}

// New Register function to sign up a new user
export async function requestAccount({ name, email, password, contactNumber }) {
  // Insert the registration request into the account_pending table
  const { data, error } = await supabase

    .from('account_pending')
    .insert({ name, email, password, contact: contactNumber }); // Use correct field name

  if (error) throw new Error(error.message);

  return data;
}

export async function getUserRole(id) {
  const { data, error } = await supabase
    .from('user_list')
    .select('user_role')
    .eq('user_uuid', id) // Assuming you're using Supabase auth
    .single();

  console.log('userROleFetched');

  if (error) {
    throw new Error(error.message);
  }
  return data?.user_role;
}
