"use client";
import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  useOrganization,
} from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  const organization = useOrganization();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SignedOut>
        <SignInButton mode="modal">
          <Button>Sign in</Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <SignOutButton>
          <Button>Sign out</Button>
        </SignOutButton>
      </SignedIn>
    </main>
  );
}
