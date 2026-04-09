"use client";

import { Icon42 } from "@/components/icons";
import { Button } from "@/components/ui/button";

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
