import Link from "next/link";

export function Footer() {
  return (
    <div className="h-40 bg-gray-100 mt-12 flex items-center">
      <div className="container mx-auto flex justify-between items-center">
        <div>CloudStore</div>

        <Link
          className="text-blue-1 hover:text-blue-1/80
        "
          href="/privacy"
        >
          Privacy Policy
        </Link>
        <Link
          className="text-blue-1 hover:text-blue-1/80"
          href="/terms-of-service"
        >
          Terms of Service
        </Link>
        <Link className="text-blue-1 hover:text-blue-1/80" href="/about">
          About
        </Link>
      </div>
    </div>
  );
}
