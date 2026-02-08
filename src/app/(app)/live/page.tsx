import { StartMatchForm } from "@/components/live/StartMatchForm";

export default function LivePage() {
  return (
    <div className="w-full">
      <h1 className="ml-12 mb-6 text-3xl font-bold">Live Mode</h1>
      <div className="ml-12 max-w-4xl">
        <StartMatchForm />
      </div>
    </div>
  );
}
