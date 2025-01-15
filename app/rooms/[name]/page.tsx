"use client";

import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams<{ name: string }>();
  const availableRooms = [
    "kronos",
    "endor",
    "meridian",
    "vulcan",
    "caprica",
    "abydos",
    "dune",
    "romulus",
    "solaris",
    "hyperion",
  ];

  const name = params.name;

  if (!availableRooms.includes(name)) {
    return <div>Room not found</div>;
  }

  return <div>Room name: {name}</div>;
}
