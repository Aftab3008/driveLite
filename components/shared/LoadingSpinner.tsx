import { Loader } from "lucide-react";

export default function LoadingSpinner({
  size = "sm",
  classes,
}: {
  size?: string;
  classes?: string;
}) {
  return (
    <Loader size={size} color="#1E90FF" className={`animate-spin ${classes}`} />
  );
}
