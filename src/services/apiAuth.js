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
    .insert({ name, email, password, contact_number: contactNumber }); // Use correct field name

  if (error) throw new Error(error.message);

  return data;
}
