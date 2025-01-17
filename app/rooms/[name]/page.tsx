"use client";

import { useParams } from "next/navigation";
import Toggle from "@/components/ui/toggle";
import Slider from "@/components/ui/slider";
import CalendarRow  from "@/components/ui/CalendarRow";
import StatusIndicator from "@/components/ui/status-indicator";
import Battery from "@/components/animata/widget/battery";


export default function RoomPage() {
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

  const roomImageUrl = `/images/rooms/${name}.png`; // Assumes room images are stored in `public/images/rooms/`

  return (
      <div className="flex h-screen font-sans">
        {/* Room Image Section */}
        <div className="flex-grow relative bg-gray-200">
          <img
              src={roomImageUrl}
              alt={`Room ${name}`}
              className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute h-40 w-full bg-white ">

          </div>
        </div>

        {/* Control Panel Section */}
        <div className="w-1/3 bg-white p-16 overflow-y-auto pt-52">
          <h2 className="text-[50px] font-thin ">Smart Class</h2>
          <h3 className="text-2xl font-extrabold ">Security Systems</h3>
          <StatusIndicator status="online" />
          <CalendarRow/>
          <div className="space-y-6 mt-6">
            <Toggle label="Lights" />
            <Slider label="Temperature" min={16} max={30} unit="°C" />
            <Battery />
            <Toggle label="Air Conditioning" />
            <Toggle label="Lock Doors" />
          </div>
        </div>
      </div>
  );
}
