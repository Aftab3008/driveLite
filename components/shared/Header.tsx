import {
  OrganizationSwitcher,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import { Button } from "../ui/button";

export default function Header() {
  return (
    <div className="border-b py-4 bg-gray-50">
      <div className="items-center container mx-auto justify-between flex">
        <div className="flex items-center gap-2 flex-wrap">
          <Image
            src="/images/logo.svg"
            alt="Logo"
            width={40}
            height={40}
            className="text-blue-1"
          />
          <h1 className="font-bold text-2xl hidden sm:block text-gray-800">
            CloudStore
          </h1>
        </div>
        <div className="flex gap-2">
          <SignedIn>
            <OrganizationSwitcher />
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button className="bg-blue-1 text-white hover:bg-blue-2 hover:text-black">
                Sign in
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="bg-black text-white hover:bg-blue-2 hover:text-black">
                Sign up
              </Button>
            </SignUpButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
