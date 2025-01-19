import React, { useState, useEffect } from "react";
import mqtt from "mqtt";
import { Card, CardHeader } from "@/components/ui/card";
import { DoorOpen } from "lucide-react";

export function DoorStatusWidget({ topic, mqttUrl, username, password }) {
  const [doorStatus, setDoorStatus] = useState("unknown");
  const [isActivated, setIsActivated] = useState(false);
  const [client, setClient] = useState(null);

  useEffect(() => {
    const mqttClient = mqtt.connect(mqttUrl, { username, password });

    mqttClient.on("connect", () => {
      mqttClient.subscribe(topic, (err) => {
        if (err) console.error("Subscription error:", err);
      });
    });

    mqttClient.on("message", (receivedTopic, message) => {
      if (receivedTopic === topic) {
        try {
          const data = JSON.parse(message.toString());
          setDoorStatus(data.door.status);
          setIsActivated(data.activated);
        } catch (err) {
          console.error("Error parsing MQTT message:", err);
        }
      }
    });

    setClient(mqttClient);

    return () => {
      mqttClient.end();
    };
  }, [mqttUrl, topic, username, password]);

  const handleSwitchChange = () => {
    setIsActivated((prevState) => {
      const newState = !prevState;
      const payload = JSON.stringify({
        activated: newState,
        dt: new Date().toISOString(),
        door: { status: doorStatus },
      });
      if (client) {
        client.publish(topic, payload, { qos: 0, retain: false }, (err) => {
          if (err) console.error("Error sending message:", err);
        });
      }
      return newState;
    });
  };

  return (
    <div className="flex gap-5 mt-6 hover:scale-105 duration-300">
      <Card className="rounded-[50px] aspect-square flex items-center shadow-[0_0_5px_10px_lightgray]">
        <CardHeader className="flex flex-col justify-center items-center text-center pb-0">
          <div className="flex gap-3 justify-center items-center">
            <DoorOpen className="text-gray-900 w-[50px] h-[50px]" />
            <div className="flex flex-col">
              <p className="text-lg">Main Door</p>
              <p className="text-small text-default-500">
                Status: {doorStatus === "open" ? "Opened" : "Closed"}
              </p>
            </div>
          </div>
          <p>Security:</p>
          <div
            onClick={handleSwitchChange}
            className={`relative inline-block w-12 h-6 cursor-pointer rounded-full transition-all duration-300 ${
              isActivated ? "bg-green-500" : "bg-gray-600"
            }`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300 ${
                isActivated ? "transform translate-x-full" : ""
              }`}
            />
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
