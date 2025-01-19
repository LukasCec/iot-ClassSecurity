"use client";

import { useParams } from "next/navigation";
import Link from "next/link"; // Import Link for navigation
import { User, Home, ChevronLeft, Lock, LockOpen } from "lucide-react"; // Import User and Home icons
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
import { Switch } from "@/components/ui/switch";
import AvatarGroupUsers from "@/components/AvatarGroup";

export default function RoomPage() {
  const params = useParams<{ name: string }>();
  const [client, setClient] = useState(null);
  const [door, setDoor] = useState({
    status: "secured",
  });
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
    url: "ws://147.232.205.176:8000",
    username: "maker",
    password: "mother.mqtt.password",
    topic: `kpi/${name}/security/megasupa`,
    topicDoor: `kpi/${name}/security/megasupa/door`,
    topicWindow: `kpi/${name}/security/megasupa/window`,
  };

  // 1. Fetch Room Data
  const fetchRoomData = () => {
    const mqttClient = mqtt.connect(mqttConfig.url, {
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

  const fetchSecurityDoorData = () => {
    const mqttClient = mqtt.connect(mqttConfig.url, {
      username: mqttConfig.username,
      password: mqttConfig.password,
    });

    mqttClient.on("connect", () => {
      mqttClient.subscribe(mqttConfig.topicDoor, (err) => {
        if (err) console.error("Subscription error:", err);
      });
    });

    mqttClient.on("message", (receivedTopic, message) => {
      if (receivedTopic === mqttConfig.topicDoor) {
        try {
          const data = JSON.parse(message.toString());
          setDoor(data);
        } catch (err) {
          console.error("Error parsing MQTT message:", err);
        }
      }
    });

    return () => mqttClient.end();
  };

  useEffect(() => {
    fetchRoomData();
    fetchSecurityDoorData();
  }, []);

  // 2. Update Room Status
  const updateSecurityStatus = (thing) => {
    const mqttClient = mqtt.connect(mqttConfig.url, {
      username: mqttConfig.username,
      password: mqttConfig.password,
    });

    if (thing === "door") {
      mqttClient.on("connect", () => {
        console.log("MQTT connection successful");

        // Subscribe to the topic
        mqttClient.subscribe(mqttConfig.topicDoor, (err) => {
          if (err) {
            console.error("Error subscribing to topic", err);
          } else {
            console.log(
              "Successfully subscribed to /kpi/kronos/security/megasupa/door"
            );
          }
        });
      });

      const payload = JSON.stringify({
        ...door,
        dt: new Date().toISOString(),
        status: door.status === "secured" ? "unsecured" : "secured",
      });

      mqttClient.publish(
        mqttConfig.topicDoor,
        payload,
        { qos: 0, retain: true },
        (err) => {
          if (err) {
            console.error("Error publishing door status:", err);
          } else {
            console.log(`Message "${payload}" sent successfully to topic.`);
          }
        }
      );
    } else if (thing === "window") {
      const payload = JSON.stringify({
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
    }

    mqttClient.end();
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

      <div className="h-screen flex flex-col lg:flex-row p-4 gap-4">
        <div className="flex-grow relative bg-gray-200 mt-16 rounded-lg hidden lg:block">
          <img
            src={roomImageUrl}
            alt={`Room ${name}`}
            className="absolute inset-0 h-full w-full object-cover mb-12 rounded-lg"
          />
          {/*
          <div className="hidden md:block absolute top-4 right-10 space-y-4">
            <DoorStatusWidget {...mqttConfig} />
            <WindowStatusWidget {...mqttConfig} />
          </div>
                    */}
        </div>

        {/* Main control panel */}
        <div className="bg-white dark:bg-background p-6 space-y-5 rounded-[35px] border mt-16 lg:mt-16">
          <h2 className="text-3xl font-thin dark:text-white">Smart Class</h2>
          <div className="flex flex-row justify-between items-center pb-2 border-b-2">
            <h3 className="text-lg xl:text-2xl font-extrabold dark:text-white pb-2">
              Security Status
            </h3>
            <StatusIndicator status="activated" />
          </div>

          <div className="flex flex-row border-b-2 pb-6">
            <div className="w-1/2 space-y-2 border-r-2">
              <span className="font-bold">Door status</span>
              <div className="flex justify-between align-center gap-4 pr-4">
                <div className="flex gap-3 border p-2 rounded-lg">
                  <LockOpen className="text-gray-500" />
                  <Switch
                    id="door-switch"
                    checked={door.status == "secured" ? true : false}
                    onCheckedChange={(checked) =>
                      setDoor({ status: checked ? "secured" : "unsecured" })
                    }
                    onClick={() => {
                      updateSecurityStatus("door");
                    }}
                  />
                  <Lock className="text-gray-500" />
                </div>
              </div>
            </div>
            <div className="w-1/2 pl-4 space-y-2">
              <span className="font-bold">Window status</span>
              <div className="flex justify-between align-center gap-4 pr-4">
                <div className="flex gap-3 border p-2 rounded-lg">
                  <LockOpen className="text-gray-500" />
                  <Switch id="window-switch" />
                  <Lock className="text-gray-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="pb-2 border-b-2">
            <h3 className="text-lg xl:text-xl font-extrabold dark:text-white pb-2">
              Members
            </h3>
            <div className="flex flex-row justify-left p-2">
              <AvatarGroupUsers />
            </div>
          </div>

          <div className="pb-2 border-b-2">
            <div className="flex flex-row justify-between">
              <div>
                <h3 className="text-lg xl:text-xl font-extrabold dark:text-white pb-4">
                  Activity
                </h3>
              </div>
              <div>Jan 20, 2025 12:00 00:00</div>
            </div>
            <CalendarRow />
          </div>

          <div className="space-y-6 mt-6">
            <TempChart />
          </div>
        </div>
      </div>
    </div>
  );
}
