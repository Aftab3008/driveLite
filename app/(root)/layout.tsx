import Sidebar from "@/components/shared/Sidebar";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedOut>
        <main className="flex flex-col items-center justify-center p-24">
          <h1 className="text-4xl font-bold mb-4">Welcome to FileDrive</h1>
          <p className="text-lg text-gray-500">Sign in to see your files</p>
        </main>
      </SignedOut>
      <SignedIn>
        <main className="container mx-auto pt-12 min-h-screen mb-10">
          <div className="flex gap-8">
            <Sidebar />
            <div className="border-l border-gray-1/40"></div>
            <div className="w-full">{children}</div>
          </div>
        </main>
      </SignedIn>
    </>
  );
}
