"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  router.push("/rooms");

  return (
    <div className="h-full min-h-[100vh] w-full px-20 py-10">
      <h1 className="font-bold text-2xl">IOT Hub</h1>
    </div>
  );
}
