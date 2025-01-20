"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { CircleAlert, ChevronLeft, Lock, LockOpen, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { formatDateTime } from "@/lib/formatDateTime";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FormEvent } from "react";

import CalendarRow from "@/components/CalendarRow";
import StatusIndicator from "@/components/StatusIndicator";
import { TempChart } from "@/components/TempHumCharts";
import mqtt from "mqtt";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Switch } from "@/components/ui/switch";
import AvatarGroupUsers from "@/components/AvatarGroup";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function RoomPage() {
  const params = useParams<{ name: string }>();
  const [client, setClient] = useState(null);

  const [door, setDoor] = useState({
    status: "",
    dt: new Date().toISOString(),
    event: "",
    user: "",
    card: "",
  });
  const [windowData, setWindowData] = useState({
    status: "",
    dt: new Date().toISOString(),
    event: "",
  });
  const [members, setMembers] = useState({
    users: [
      {
        id: 1,
        name: "",
        card: 2846309891,
      },
    ],
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

  const sampleMembers = ["Matejko", "Mirko", "Oliverko", "Lukasko"];

  const name = params.name;

  if (!availableRooms.includes(name)) {
    return <div>Room not found</div>;
  }

  const roomImageUrl = `/images/rooms/${name}.png`;

  const mqttConfig = {
    url: "ws://147.232.205.176:8000",
    username: "maker",
    password: "mother.mqtt.password",
    topic: `kpi/${name}/security`,
    topicDoor: `kpi/${name}/security/door`,
    topicWindow: `kpi/${name}/security/window`,
    topicMembers: `kpi/${name}/security/members`,
  };

  const mqttClient = mqtt.connect(mqttConfig.url, {
    username: mqttConfig.username,
    password: mqttConfig.password,
  });

  // 1. Fetch Room Data
  const fetchRoomData = () => {
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
          console.log("Room data function", data);
        } catch (err) {
          console.error("Error parsing MQTT message:", err);
        }
      }
    });

    setClient(mqttClient);

    return () => mqttClient.end();
  };

  const fetchSecurityDoorData = () => {
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
          console.log("Door data function", data);
        } catch (err) {
          console.error("Error parsing MQTT message:", err);
        }
      }
    });

    setClient(mqttClient);

    return () => mqttClient.end();
  };

  const fetchSecurityWindowData = () => {
    mqttClient.on("connect", () => {
      mqttClient.subscribe(mqttConfig.topicDoor, (err) => {
        if (err) console.error("Subscription error:", err);
      });
    });

    mqttClient.on("message", (receivedTopic, message) => {
      if (receivedTopic === mqttConfig.topicWindow) {
        try {
          const data = JSON.parse(message.toString());
          setWindowData(data);
          console.log("Window data function", data);
        } catch (err) {
          console.error("Error parsing MQTT message:", err);
        }
      }
    });

    setClient(mqttClient);

    return () => mqttClient.end();
  };

  const fetchSecurityMembersData = () => {
    mqttClient.on("connect", () => {
      mqttClient.subscribe(mqttConfig.topicMembers, (err) => {
        if (err) console.error("Subscription error:", err);
      });
    });

    mqttClient.on("message", (receivedTopic, message) => {
      if (receivedTopic === mqttConfig.topicMembers) {
        try {
          const data = JSON.parse(message.toString());
          setMembers(data);
          console.log("Members data function", data);
        } catch (err) {
          console.error("Error parsing MQTT message:", err);
        }
      }
    });

    setClient(mqttClient);

    return () => mqttClient.end();
  };

  // 2. Update Room Status
  const updateSecurityStatus = () => {
    const payload = JSON.stringify({
      user: door.user,
      status: door.status == "secured" ? "unsecured" : "secured",
      event: door.status == "secured" ? "Unsecured door" : "Secured door",
      card: 2846309891,
      dt: new Date().toISOString(),
    });

    if (client) {
      client.publish(
        mqttConfig.topicDoor,
        payload,
        { qos: 0, retain: false },
        (err) => {
          if (err) {
            console.error("Error publishing door status:", err);
          } else {
            console.log(`Message "${payload}" sent successfully to topic.`);
          }
        }
      );
    }

    return () => client.end();
  };

  const handleAddNewUser = (event) => {
    event.preventDefault();

    const newMemberData = {
      id: members.users.length + 1,
      name: event.target.name.value,
      card: Number(event.target.card.value),
    };

    console.log("New member data", newMemberData);
    console.log("Old Members data", members);

    const updatedMembers = {
      users: [...members.users, newMemberData],
    };

    console.log("Updated Members data", updatedMembers);

    setMembers(updatedMembers);
    updateMembers(updatedMembers);
  };

  const handleRemoveUser = (id) => {
    const updatedMembers = {
      users: members.users.filter((member) => member.id !== id),
    };

    setMembers(updatedMembers);

    console.log("Updated Members data", updatedMembers);
    updateMembers(updatedMembers);
  };

  const updateMembers = (updatedMembers) => {
    const payload = JSON.stringify(updatedMembers);

    if (client) {
      client.publish(
        mqttConfig.topicMembers,
        payload,
        { qos: 0, retain: true },
        (err) => {
          if (err) {
            console.error("Error publishing door status:", err);
          } else {
            console.log(
              `Message "${updatedMembers}" sent successfully to topic.`
            );
          }
        }
      );
    }

    return () => client.end();
  };

  useEffect(() => {
    fetchRoomData();
    fetchSecurityDoorData();
    fetchSecurityWindowData();
    fetchSecurityMembersData();
    console.log("Security door data", door);
  }, []);

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

            <div
              className={`flex gap-3 border p-2 rounded-lg mb-2 ${
                door.status == "unauthorized" && "bg-red-200 border-red-500"
              } ${door.event == "Card rejected" && "border-red-500"}`}
            >
              <LockOpen className="text-gray-500" />
              <Switch
                id="door-switch"
                checked={
                  door.status == "secured"
                    ? true
                    : door.status == "unsecured"
                    ? false
                    : true
                }
                onCheckedChange={(checked) =>
                  setDoor({ status: checked ? "secured" : "unsecured" })
                }
                onClick={() => {
                  updateSecurityStatus();
                }}
              />
              <Lock className="text-gray-500" />
            </div>
          </div>

          <div className="flex flex-row border-b-2 pb-6">
            <div className="w-1/2 space-y-2 border-r-2">
              <span className="font-bold">Door</span>
              <div className="pl-1">
                <StatusIndicator
                  status={`${
                    door.status == "secured" ? "secured" : "unsecured"
                  }`}
                />
              </div>
            </div>
            <div className="w-1/2 pl-4 space-y-2">
              <span className="font-bold">Window</span>
              <div className="pl-1">
                <StatusIndicator
                  status={`${
                    windowData.status == "secured" ? "secured" : "unsecured"
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="pb-2 border-b-2">
            <h3 className="text-lg xl:text-xl font-extrabold dark:text-white pb-2">
              Members
            </h3>
            <div className="flex flex-row justify-between p-2">
              <div>
                <AvatarGroupUsers />
              </div>
              <div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Edit Members</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit Members</DialogTitle>
                      <DialogDescription>
                        Change who has access to this room.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col">
                      {/* single member */}
                      {members?.users?.map((member) => (
                        <div
                          key={member?.id}
                          className="flex flex-row space-x-4 items-center justify-between border p-2 rounded-lg mb-2"
                        >
                          <div className="flex flex-row space-x-4 items-center">
                            <Avatar>
                              <AvatarImage
                                src="https://github.com/shadcn.png"
                                alt="@shadcn"
                              />
                              <AvatarFallback>
                                {member?.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>{member?.name}</div>
                          </div>
                          <div>
                            <Button
                              variant="outline"
                              size="icon"
                              className="bg-red-500 text-white hover:bg-red-700 hover:text-white"
                              onClick={() => handleRemoveUser(member?.id)}
                            >
                              <Trash2 />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <form
                        onSubmit={handleAddNewUser}
                        className="border p-3 rounded-lg mb-2 mt-5 space-y-2"
                      >
                        <div>
                          <h4 className="font-bold text-sm pb-2">
                            Add New Member
                          </h4>
                        </div>
                        <div className="flex flex-row items-center justify-between gap-4 pl-1">
                          <Label htmlFor="username">Name</Label>
                          <Input
                            id="name"
                            name="name"
                            defaultValue="Mirko"
                            className="w-3/4"
                          />
                        </div>
                        <div className="flex flex-row items-center justify-between gap-4 pl-1">
                          <Label htmlFor="username">Card Id</Label>
                          <Input
                            id="card"
                            name="card"
                            defaultValue="133769420"
                            type="number"
                            className="w-3/4"
                          />
                        </div>

                        <div className="flex flex-row justify-end pt-4">
                          <Button variant="default" type="submit">
                            Add Member
                          </Button>
                        </div>
                      </form>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <div className="pb-2 border-b-2">
            <div className="flex flex-row justify-between pb-2">
              <div className="w-full">
                <h3 className="text-lg xl:text-xl font-extrabold dark:text-white pb-4">
                  Latest Activity
                </h3>
                <Alert className="mb-4">
                  <CircleAlert className="h-4 w-4" />
                  <AlertTitle>{door.event}</AlertTitle>
                  <AlertDescription>
                    By {door.user} at {formatDateTime(door.dt)}
                  </AlertDescription>
                </Alert>
              </div>
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
