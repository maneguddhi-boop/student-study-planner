import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  BookOpen,
  Brain,
  CheckCircle,
  Clock,
  GraduationCap,
  Loader2,
} from "lucide-react";
import { motion } from "motion/react";

export function LoginPage() {
  const { login, loginStatus, isInitializing } = useInternetIdentity();
  const isLoggingIn = loginStatus === "logging-in";

  const features = [
    { icon: BookOpen, text: "Track all your subjects" },
    { icon: CheckCircle, text: "Manage tasks with Kanban" },
    { icon: Clock, text: "Log study sessions" },
    { icon: Brain, text: "Pomodoro timer built-in" },
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "oklch(var(--sidebar))" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Brand */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "oklch(var(--sidebar-primary))" }}
          >
            <GraduationCap className="w-9 h-9 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">
            StudyPlanner
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "oklch(var(--sidebar-foreground) / 0.7)" }}
          >
            Your academic success companion
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-lg">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access your personalized study dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-2 gap-2.5">
              {features.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                >
                  <Icon className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            <Button
              data-ocid="login.primary_button"
              className="w-full"
              size="lg"
              onClick={login}
              disabled={isLoggingIn || isInitializing}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Signing in…
                </>
              ) : isInitializing ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Initializing…
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Secure, passwordless login via Internet Identity.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
