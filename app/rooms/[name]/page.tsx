"use client";

import { useParams } from "next/navigation";
import { User } from "lucide-react"; // Import the User icon from Lucide React
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import Toggle from "@/components/ui/toggle";
import Slider from "@/components/ui/slider";
import CalendarRow from "@/components/ui/CalendarRow";
import StatusIndicator from "@/components/ui/status-indicator";

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
      <div className="relative flex h-screen font-sans">
        {/* Navbar */}
        <nav className="fixed top-0 left-0 w-full h-32 bg-white flex z-10 shadow shadow-accent items-center justify-between px-16">
          {/* Room Name on the Left */}
          <div className="text-gray-900 font-bold text-3xl">{name.toUpperCase()} <span className="text-xl font-thin">Classroom</span></div>

          {/* Logged-in User on the Right with Icon and Dropdown */}
          <div className="flex items-center space-x-4">
            {/* User Icon and Dropdown */}
            <Dropdown>
              <DropdownTrigger>
                <div className="flex items-center cursor-pointer space-x-2">
                  <User className="w-6 h-6 text-gray-800" />
                  <span className="font-semibold text-gray-700 border-gray-400 border-2 py-1 px-3 rounded-[10px]">Admin</span>
                </div>
              </DropdownTrigger>
              <DropdownMenu aria-label="User menu" className="bg-neutral-50 p-6 rounded-[10px]">
                <DropdownItem key="profile">Profile</DropdownItem>
                <DropdownItem key="settings">Settings</DropdownItem>
                <DropdownItem key="logout">Logout</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </nav>

        {/* Room Image Section */}
        <div className="flex-grow relative bg-gray-200 mt-32">
          <img
              src={roomImageUrl}
              alt={`Room ${name}`}
              className="absolute inset-0 h-full w-full  object-cover mb-12"
          />
        </div>

        {/* Control Panel Section */}
        <div className="w-1/3 bg-white p-16 overflow-y-auto m-6 rounded-[50px] pt-24 mt-40 mb-8">
          <h2 className="text-[50px] font-thin">Smart Class</h2>
          <h3 className="text-2xl font-extrabold">Security Systems</h3>
          <StatusIndicator status="online" />
          <CalendarRow />
          <div className="space-y-6 mt-6">
            <Toggle label="Lights" />
          </div>
        </div>
      </div>
  );
}
