"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FaUser } from "react-icons/fa";
import { useSignup, useLogin } from "../../api/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function AuthCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const signupMutation = useSignup();
  const loginMutation = useLogin();
  const loading = signupMutation.isPending || loginMutation.isPending;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await signupMutation.mutateAsync({ email, password });

      // optional: auto login after signup
      const res = await loginMutation.mutateAsync({ email, password });
      router.push("/videos");
      // localStorage.setItem("access_token", res.access_token);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center ">
      <Card className="w-full min-w-lg rounded-2xl shadow-xl border bg-gray-50 h-[25rem]">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            Welcome
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin" className="cursor-pointer">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="cursor-pointer">
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* ---------- SIGN IN ---------- */}
            <TabsContent value="signin">
              <form className="space-y-4 mt-4">
                <div className="space-y-1">
                  <Label>Email</Label>
                  <Input type="email" placeholder="you@example.com" required />
                </div>

                <div className="space-y-1">
                  <Label>Password</Label>
                  <Input type="password" required />
                  <p className="mt-6 text-center text-sm text-muted-foreground">
                    Don’t just choose. Choose right.
                  </p>
                  <input type="checkbox" className="invisible" />
                </div>

                <Button
                  type="submit"
                  className="w-full flex items-center gap-2"
                  disabled={loading}
                >
                  <FaUser className="h-4 w-4" />
                  Sign In
                </Button>
              </form>
            </TabsContent>

            {/* ---------- SIGN UP ---------- */}
            <TabsContent value="signup">
              <form className="space-y-4 mt-4" onSubmit={handleSignup}>
                <div className="space-y-1">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label>Confirm Password</Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full flex items-center gap-2"
                  disabled={loading}
                >
                  <FaUser className="h-4 w-4" />
                  Create Account
                </Button>

                {signupMutation.error && (
                  <p className="text-sm text-red-500 text-center">
                    {signupMutation.error.message}
                  </p>
                )}
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
