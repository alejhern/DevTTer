import { FirebaseError } from "firebase/app";
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";

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
import { GithubIcon, GoogleIcon } from "@/components/icons";
import { auth } from "@/firebase/index.js";
interface LoginFormProps {
  open: boolean;
  onClose: () => void;
}

const loginWithGithub = async () => {
  try {
    const provider = new GithubAuthProvider();
    const result = await signInWithPopup(auth, provider);
    // This gives you a GitHub Access Texportoken. You can use it to access the GitHub API.
    const credential = GithubAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    // The signed-in user info.
    const user = result.user;

    console.log("User Info:", user);
  } catch (error) {
    console.error("Error during GitHub login:", error);
  }
};

export function LoginForm({ open, onClose }: LoginFormProps) {
  if (!open) return null;

  const handlerLoginGithub = async () => {
    try {
      await loginWithGithub();
    } catch (error) {
      const firebaseError = error as FirebaseError;
      console.error("Firebase error:", firebaseError.code, firebaseError.message);
    } finally {
      onClose();
    }
  };

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
                <Button type="button" variant="outline">
                  <GoogleIcon className="mr-2" />
                  Google
                </Button>
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
