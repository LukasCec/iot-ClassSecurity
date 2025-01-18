"use client";

import { useParams } from "next/navigation";
import Link from "next/link"; // Import Link for navigation
import { User, Home, ChevronLeft } from "lucide-react"; // Import User and Home icons
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { useEffect, useState } from "react";

import CalendarRow from "@/components/CalendarRow";
import StatusIndicator from "@/components/StatusIndicator";
import { TempChart } from "@/components/TempHumCharts";
import { DoorStatusWidget } from "@/components/DoorStatusWidget";
import { WindowStatusWidget } from "@/components/WindowStatusWidget";
import { HistoryWidget } from "@/components/HistoryWidget";
import mqtt from "mqtt";

export default function RoomPage() {
  const params = useParams<{ name: string }>();
  const [roomData, setRoomData] = useState(null);
  const [resetTriggered, setResetTriggered] = useState(false);

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

  const roomImageUrl = `/images/rooms/${name}.png`;
  const mqttConfig = {
    mqttUrl: "ws://147.232.205.176:8000",
    username: "maker",
    password: "mother.mqtt.password",
    topic: `kpi/${name}/security/megasupa`,
  };

  // 1. Fetch Room Data
  const fetchRoomData = () => {
    const mqttClient = mqtt.connect(mqttConfig.mqttUrl, {
      username: mqttConfig.username,
      password: mqttConfig.password,
    });

    mqttClient.on("connect", () => {
      mqttClient.subscribe(mqttConfig.topic, (err) => {
        if (err) console.error("Subscription error:", err);
      });
    });

    mqttClient.on("message", (receivedTopic, message) => {
      if (receivedTopic === mqttConfig.topic) {
        try {
          const data = JSON.parse(message.toString());
          setRoomData(data);
        } catch (err) {
          console.error("Error parsing MQTT message:", err);
        }
      }
    });

    return () => mqttClient.end();
  };

  useEffect(() => {
    fetchRoomData();
  }, []);

  // 2. Update Room Status
  const updateRoomStatus = (status) => {
    const mqttClient = mqtt.connect(mqttConfig.mqttUrl, {
      username: mqttConfig.username,
      password: mqttConfig.password,
    });

    const payload = JSON.stringify({
      status,
      dt: new Date().toISOString(),
    });

    mqttClient.publish(mqttConfig.topic, payload, { qos: 0, retain: false }, (err) => {
      if (err) console.error("Error publishing status:", err);
    });

    mqttClient.end();
  };

  // 3. Reset Room Settings
  const resetRoomSettings = () => {
    setResetTriggered(true);
    setRoomData(null);
    fetchRoomData();
  };

  return (
      <div className="relative flex h-screen font-sans">
        {/* Navbar */}
        <nav className="fixed top-0 left-0 w-full h-32 bg-white flex z-10 shadow shadow-accent items-center justify-between px-16">
          <div className="flex items-center space-x-4">
            <Link
                href="/rooms/"
                className="flex items-center space-x-2 border border-gray-900 hover:scale-[105%] duration-300 rounded-[20px] p-3 text-gray-900 hover:text-gray-700"
            >
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <div className="text-gray-900 font-bold text-3xl">
              {name.toUpperCase()} <span className="text-xl font-thin">Classroom</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Dropdown>
              <DropdownTrigger>
                <div className="flex items-center cursor-pointer space-x-2">
                  <User className="w-6 h-6 text-gray-800" />
                  <span className="font-semibold text-gray-700 border-gray-400 border-2 py-1 px-3 rounded-[10px]">
                  Admin
                </span>
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
              className="absolute inset-0 h-full w-full object-cover mb-12"
          />
          <div className="absolute top-4 right-10 space-y-4">
            <DoorStatusWidget {...mqttConfig} />
            <WindowStatusWidget {...mqttConfig} />
          </div>
        </div>

        {/* Control Panel Section */}
        <div className="w-1/3 bg-white p-16 overflow-y-auto m-6 rounded-[50px] hover:scale-[101%] duration-300 pt-24 mt-40 mb-8">
          <h2 className="text-[50px] font-thin">Smart Class</h2>
          <h3 className="text-2xl font-extrabold">Security Systems</h3>
          <StatusIndicator status="online" />
          <CalendarRow />
          <div className="space-y-6 mt-6">
            <TempChart />
            <HistoryWidget {...mqttConfig} />

          </div>
        </div>
      </div>
  );
}
