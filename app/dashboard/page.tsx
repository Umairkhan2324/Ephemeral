export const dynamic = "force-dynamic"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase"
import Dashboard from "@/components/dashboard/dashboard"

export default async function DashboardPage() {
  try {
    const supabase = createServerSupabaseClient()

    const { data: userData, error: userError } = await supabase.auth.getUser()

    console.log("Dashboard user check:", userData?.user?.email, userError)

    if (userError || !userData?.user) {
      console.log("No authenticated user, redirecting to login:", userError)
      redirect("/login")
    }
    const userId = userData.user.id

    // Get or create user profile
    const { data: fetchedProfile, error: profileFetchError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    let profile = fetchedProfile;

    console.log("Dashboard: Profile fetch attempt:", { userId, fetchedProfile, profileFetchError });

    // Case 1: A real error occurred during fetch (not just "not found" which is PGRST116)
    if (profileFetchError && profileFetchError.code !== 'PGRST116') {
      console.error("Dashboard: Error fetching profile (and not PGRST116):", profileFetchError);
      redirect("/login");
    }

    // Case 2: Profile doesn't exist (fetchedProfile is null. This will be true if 0 rows were found, leading to PGRST116, or if .single() behaved differently and returned null error for 0 rows)
    // We attempt creation if fetchedProfile is null.
    if (!profile) {
      console.log(`Dashboard: Profile not found for user ${userId}. Attempting creation.`);
      const username = userData.user.email?.split("@")[0] || `user${userId.slice(0, 8)}`;
      const email = userData.user.email || ""; // Should always exist if user exists from auth

      const { data: newProfile, error: createError } = await supabase
        .from("users")
        .insert({
          id: userId,
          username,
          email,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        })
        .select()
        .single();

      if (createError) {
        console.error("Dashboard: Error creating profile:", createError);
        redirect("/login");
      }
      
      profile = newProfile;

      if (!profile) {
        // This case should ideally not be reached if insert().select().single() works as expected
        console.error("Dashboard: Profile creation attempt did not return a profile. This is unexpected. Redirecting.");
        redirect("/login");
      }
      console.log("Dashboard: Profile successfully created:", profile);
    }
    // At this point, 'profile' MUST be a valid user profile object, or we would have redirected.

    // Get servers
    const { data: servers, error: serversError } = await supabase.from("servers").select("*").order("name")

    console.log("Servers fetch:", servers?.length, serversError)

    if (serversError) {
      console.error("Error fetching servers:", serversError)
    }

    return <Dashboard user={profile!} servers={servers || []} />
  } catch (error) {
    console.error("Dashboard error:", error)
    redirect("/login")
  }
}
