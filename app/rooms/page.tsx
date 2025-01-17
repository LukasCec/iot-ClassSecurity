'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

export default function Rooms() {
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

  return (
      <div className="h-full min-h-[100vh] w-full px-20 py-10">
        <h1 className="font-bold text-4xl mb-6">Available rooms:</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {availableRooms.map((room, index) => (

                <Card className="cursor-pointer hover:shadow-lg duration-300 w-48 h-64 hover:scale-[101%] transition-shadow flex flex-col items-center">
                  <Link key={index} href={`/rooms/${room}`}>
                  <CardHeader className="flex items-center justify-center">
                    <CardTitle className="text-center">{room.toUpperCase()}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center p-0 w-full">
                    {/* Image Container */}
                    <div className="w-full aspect-w-1 aspect-h-1 overflow-hidden rounded-md">
                      <Image
                          className="aspect-square object-cover w-full h-full"
                          src={`/images/rooms/${room}.png`}
                          alt={room}
                          width={144} // Image dimensions
                          height={144}
                      />
                    </div>
                  </CardContent>
                  </Link>
                </Card>

          ))}
        </div>
      </div>
  );
}
