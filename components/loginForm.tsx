"use client";
import { FirebaseError } from "firebase/app";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { GithubIcon } from "@/components/icons";
import { loginWithGithub } from "@/firebase/usergithub";
import { Icon42 } from "@/components/icons";

export default function Login42() {
  const handleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_FT_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_FT_PUBLIC_APP_URL}${process.env.NEXT_PUBLIC_FT_REDIRECT_URI}`;

    if (!clientId || !redirectUri) {
      console.error("Faltan variables de entorno FT_CLIENT_ID o REDIRECT_URI");

      return;
    }

    const authUrl =
      `https://api.intra.42.fr/oauth/authorize?` +
      `client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code&scope=public`;

    window.location.href = authUrl;
  };

  return (
    <Button
      className="flex items-center justify-center gap-2"
      type="button"
      variant="outline"
      onClick={handleLogin}
    >
      Authenticate with intra
      {/* Logo 42 */}
      <Icon42
        className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6"
        fill="currentColor"
      />
    </Button>
  );
}

interface LoginFormProps {
  onClose: () => void;
}

export function LoginForm({ onClose }: LoginFormProps) {
  const router = useRouter();
  const handlerLoginGithub = useCallback(async () => {
    try {
      await loginWithGithub();
      onClose();
      router.replace("/profile");
    } catch (error) {
      const firebaseError = error as FirebaseError;

      console.error(
        "Firebase error:",
        firebaseError.code,
        firebaseError.message,
      );
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        role="button"
        tabIndex={0}
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      />
      <Card className="relative w-full max-w-md mx-4 shadow-2xl animate-in fade-in zoom-in-95">
        <CardContent className="p-6">
          <form>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground">Login to your account</p>
              </div>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  required
                  id="email"
                  placeholder="m@example.com"
                  type="email"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input required id="password" type="password" />
              </Field>

              <Field>
                <Button className="w-full" type="submit">
                  Login
                </Button>
              </Field>

              <FieldSeparator>Or continue with</FieldSeparator>

              <Field className="grid grid-cols-2 gap-4">
                <Login42 />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlerLoginGithub}
                >
                  <GithubIcon className="mr-2" />
                  Github
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Don&apos;t have an account? <a href="/">Sign up</a>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>

        {/* Close Button */}
        <button
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
          type="button"
          onClick={onClose}
        >
          ✕
        </button>
      </Card>
    </div>
  );
}
