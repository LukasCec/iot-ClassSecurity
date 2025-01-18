"use client";

import { useParams } from "next/navigation";
import Link from "next/link"; // Import Link for navigation
import { User, Home, ChevronLeft } from "lucide-react"; // Import User and Home icons
import { useEffect, useState } from "react";

import CalendarRow from "@/components/CalendarRow";
import StatusIndicator from "@/components/StatusIndicator";
import { TempChart } from "@/components/TempHumCharts";
import { DoorStatusWidget } from "@/components/DoorStatusWidget";
import { WindowStatusWidget } from "@/components/WindowStatusWidget";
import { HistoryWidget } from "@/components/HistoryWidget";
import mqtt from "mqtt";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

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
  console.log("roomImageUrl", roomImageUrl);
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

    mqttClient.publish(
      mqttConfig.topic,
      payload,
      { qos: 0, retain: false },
      (err) => {
        if (err) console.error("Error publishing status:", err);
      }
    );

    mqttClient.end();
  };

  // 3. Reset Room Settings
  const resetRoomSettings = () => {
    setResetTriggered(true);
    setRoomData(null);
    fetchRoomData();
  };

  return (
    <div className="font-sans">
      <nav className="fixed top-0 dark:bg-background left-0 w-full h-16 bg-white flex z-10 shadow shadow-accent items-center justify-between px-5">
        {/* Room Name and Home Button on the Left */}
        <div className="flex items-center space-x-5">
          <Button variant="outline" size="icon" className="rounded-full">
            <Link href="/rooms/">
              <ChevronLeft />
            </Link>
          </Button>
          <div className="text-gray-900 dark:text-white font-bold text-lg sm:text-3xl">
            {name.toUpperCase()}{" "}
            <span className="text-lg font-thin dark:text-gray-300">
              Classroom
            </span>
          </div>
        </div>

        <ThemeToggle />
      </nav>

      <div className="flex gap-4 p-4 mt-16">
        <div className="flex-grow relative">
          <img
            src={roomImageUrl}
            alt={`Room ${name}`}
            className="absolute inset-0 h-full w-full object-cover mb-12 rounded-md border"
          />
          <div className="absolute top-4 right-10 space-y-4">
            <DoorStatusWidget {...mqttConfig} />
            <WindowStatusWidget {...mqttConfig} />
          </div>
        </div>

        <div className="bg-white dark:bg-background p-6 space-y-7 overflow-y-auto rounded-[35px] border">
          <h2 className="text-3xl font-thin dark:text-white">Smart Class</h2>
          <div className="flex flex-row justify-between items-center">
            <h3 className="text-2xl font-extrabold dark:text-white">
              Security Status
            </h3>
            <StatusIndicator status="activated" />
          </div>
          <CalendarRow />
          <div className="space-y-6 mt-6">
            <TempChart />
          </div>
        </div>
      </div>
    </div>
  );
}
