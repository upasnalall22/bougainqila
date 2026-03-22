import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Package, LogOut, User } from "lucide-react";
import { INDIAN_CITIES } from "@/data/indianCities";

interface Profile {
  salutation: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

const emptyProfile: Profile = {
  salutation: "Mr.",
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

const AccountProfile = () => {
  const { user, loading, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) {
        setProfile({
          salutation: data.salutation || "Mr.",
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          phone: data.phone || "",
          email: data.email || user.email || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          pincode: data.pincode || "",
        });
        setCitySearch(data.city || "");
      } else {
        setProfile({ ...emptyProfile, email: user.email || "" });
      }
      setLoadingProfile(false);
    };
    fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) return <Navigate to="/account/login" replace />;

  const filteredCities = citySearch.length >= 2
    ? INDIAN_CITIES.filter((c) => c.city.toLowerCase().includes(citySearch.toLowerCase())).slice(0, 8)
    : [];

  const selectCity = (city: { city: string; state: string }) => {
    setProfile({ ...profile, city: city.city, state: city.state });
    setCitySearch(city.city);
    setShowCityDropdown(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        salutation: profile.salutation,
        first_name: profile.first_name.trim(),
        last_name: profile.last_name.trim() || null,
        phone: profile.phone.trim(),
        email: profile.email.trim(),
        address: profile.address.trim() || null,
        city: profile.city || null,
        state: profile.state || null,
        pincode: profile.pincode || null,
      })
      .eq("user_id", user.id);

    if (error) {
      toast.error("Failed to save profile");
    } else {
      toast.success("Profile updated");
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead title="My Profile | BougenQila" description="Manage your BougenQila account profile and delivery address." />
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto px-4 md:px-6 py-12 w-full">
        {/* Account Nav */}
        <div className="flex items-center justify-between mb-8">
          <h1
            className="text-2xl md:text-3xl font-light text-foreground"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            My Account
          </h1>
          <button
            onClick={handleSignOut}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <Link
            to="/account"
            className="text-xs tracking-[0.15em] uppercase pb-3 border-b-2 border-primary text-foreground"
          >
            <User className="w-3.5 h-3.5 inline mr-1" />
            Profile
          </Link>
          <Link
            to="/account/orders"
            className="text-xs tracking-[0.15em] uppercase pb-3 border-b-2 border-transparent text-muted-foreground hover:text-foreground transition-colors"
          >
            <Package className="w-3.5 h-3.5 inline mr-1" />
            Orders
          </Link>
        </div>

        {loadingProfile ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Name */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Salutation</label>
                <select
                  value={profile.salutation}
                  onChange={(e) => setProfile({ ...profile, salutation: e.target.value })}
                  className="w-full border border-border bg-background px-3 py-2.5 text-sm rounded-sm"
                >
                  <option>Mr.</option>
                  <option>Ms.</option>
                </select>
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">First Name</label>
                <input
                  type="text"
                  value={profile.first_name}
                  onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                  className="w-full border border-border bg-background px-3 py-2.5 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Last Name</label>
                <input
                  type="text"
                  value={profile.last_name}
                  onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                  className="w-full border border-border bg-background px-3 py-2.5 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  readOnly
                  className="w-full border border-border bg-muted px-3 py-2.5 text-sm rounded-sm text-muted-foreground"
                />
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Phone</label>
                <div className="flex">
                  <span className="border border-r-0 border-border bg-muted px-3 py-2.5 text-sm rounded-l-sm text-muted-foreground">+91</span>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                    placeholder="10 digit mobile"
                    className="w-full border border-border bg-background px-3 py-2.5 text-sm rounded-r-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Delivery Address</label>
              <textarea
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                rows={2}
                className="w-full border border-border bg-background px-3 py-2.5 text-sm rounded-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="House/flat, street, landmark"
              />
            </div>

            {/* City, State, Pincode */}
            <div className="grid grid-cols-3 gap-3">
              <div className="relative">
                <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">City</label>
                <input
                  type="text"
                  value={citySearch}
                  onChange={(e) => {
                    setCitySearch(e.target.value);
                    setShowCityDropdown(true);
                    setProfile({ ...profile, city: e.target.value, state: "" });
                  }}
                  onFocus={() => setShowCityDropdown(true)}
                  onBlur={() => setTimeout(() => setShowCityDropdown(false), 200)}
                  className="w-full border border-border bg-background px-3 py-2.5 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Search city"
                />
                {showCityDropdown && filteredCities.length > 0 && (
                  <div className="absolute z-10 top-full left-0 right-0 bg-background border border-border rounded-sm shadow-lg max-h-40 overflow-y-auto mt-1">
                    {filteredCities.map((c, i) => (
                      <button
                        key={i}
                        type="button"
                        onMouseDown={() => selectCity(c)}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
                      >
                        {c.city}, {c.state}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">State</label>
                <input
                  type="text"
                  value={profile.state}
                  readOnly
                  className="w-full border border-border bg-muted px-3 py-2.5 text-sm rounded-sm text-muted-foreground"
                />
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Pincode</label>
                <input
                  type="text"
                  value={profile.pincode}
                  onChange={(e) => setProfile({ ...profile, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                  className="w-full border border-border bg-background px-3 py-2.5 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="6 digits"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary text-primary-foreground px-8 py-3 text-xs tracking-[0.2em] uppercase rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Profile"
              )}
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AccountProfile;
