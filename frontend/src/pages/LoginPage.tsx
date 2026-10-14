import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BriefcaseBusiness, Lock, User } from "lucide-react";
import { login } from "../api/auth";
import { useToast } from "../components/ToastProvider";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export function LoginPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("changeme");
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-app px-4 transition-colors">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3B5BFF] dark:bg-[#6C86FF] text-white shadow-sm">
            <BriefcaseBusiness className="h-6 w-6 stroke-[2.2]" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-main">JobTracker</h1>
          <p className="mt-1 text-xs text-muted">Sign in to manage your career pipeline.</p>
        </div>

        <form
          className="rounded-3xl border border-line dark:border-[#262C38] bg-surface p-7 shadow-elevated space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setLoading(true);
            try {
              await login(username, password);
              toast.success("Welcome back!");
              navigate("/");
            } catch (error) {
              toast.error(error instanceof Error ? error.message : "Invalid credentials");
            } finally {
              setLoading(false);
            }
          }}
        >
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-main">Username</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              startIcon={<User className="h-4 w-4" />}
              placeholder="Username"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-main">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              startIcon={<Lock className="h-4 w-4" />}
              placeholder="Password"
              required
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              isLoading={loading}
            >
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
