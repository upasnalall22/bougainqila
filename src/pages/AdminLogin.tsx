import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import SEOHead from "@/components/SEOHead";

const AdminLogin = () => {
  const { user, isAdmin, loading, signIn, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (user && isAdmin) return <Navigate to="/admin/products" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    if (mode === "signup") {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Account created! Now sign in with your credentials. Note: An admin must grant you the admin role.");
        setMode("login");
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) setError(error.message);
    }

    setSubmitting(false);
  };

  return (
    <>
    <SEOHead title="Admin Login" noindex />
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-light text-foreground mb-8 text-center" style={{ fontFamily: "var(--font-heading)" }}>
          {mode === "login" ? "Admin Login" : "Create Admin Account"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full border border-border bg-background px-3 py-2 text-sm rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          {error && <p className="text-destructive text-xs">{error}</p>}
          {success && <p className="text-green-600 text-xs">{success}</p>}
          {user && !isAdmin && <p className="text-destructive text-xs">You do not have admin access. Ask an existing admin to grant you the role.</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-primary-foreground py-2.5 text-xs tracking-[0.15em] uppercase rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting ? (mode === "login" ? "Signing in..." : "Creating account...") : (mode === "login" ? "Sign In" : "Create Account")}
          </button>
        </form>
        <p className="text-center text-xs text-muted-foreground mt-4">
          {mode === "login" ? (
            <>No account? <button onClick={() => { setMode("signup"); setError(""); setSuccess(""); }} className="text-primary hover:underline">Create one</button></>
          ) : (
            <>Already have an account? <button onClick={() => { setMode("login"); setError(""); setSuccess(""); }} className="text-primary hover:underline">Sign in</button></>
          )}
        </p>
      </div>
    </div>
    </>
  );
};

export default AdminLogin;
