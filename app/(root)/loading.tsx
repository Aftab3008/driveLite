import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function loading() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <LoadingSpinner size="sm" classes="h-10 w-10" />
    </div>
  );
}
