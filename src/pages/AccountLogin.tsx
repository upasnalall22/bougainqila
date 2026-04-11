import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const AccountLogin = () => {
  const { user, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);

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

  if (user) return <Navigate to="/account" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setSubmitting(true);

    if (mode === "signup") {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Account created! Please check your email to verify, then sign in.");
        setMode("login");
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
      } else {
        navigate("/account");
      }
    }

    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead title="My Account | BougainQila" description="Sign in or create your BougainQila account to track orders and manage your profile." />
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <h1
            className="text-2xl md:text-3xl font-light text-foreground mb-2 text-center"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-xs text-muted-foreground text-center mb-8">
            {mode === "login"
              ? "Sign in to view your orders and manage your profile"
              : "Join us to track your orders and get a personalized experience"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-border bg-background px-3 py-2.5 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full border border-border bg-background px-3 py-2.5 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === "signup" && (
              <div>
                <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full border border-border bg-background px-3 py-2.5 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="••••••••"
                />
              </div>
            )}

            {error && <p className="text-destructive text-xs">{error}</p>}
            {success && <p className="text-green-600 text-xs">{success}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-primary-foreground py-3 text-xs tracking-[0.2em] uppercase rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {mode === "login" ? "Signing In..." : "Creating Account..."}
                </>
              ) : mode === "login" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              {mode === "login" ? (
                <>
                  Don't have an account?{" "}
                  <button
                    onClick={() => { setMode("signup"); setError(""); setSuccess(""); }}
                    className="text-primary hover:underline"
                  >
                    Create one
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
                    className="text-primary hover:underline"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link to="/shop" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AccountLogin;
