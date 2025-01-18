import React, { useState, useEffect } from "react";
import mqtt from "mqtt";
import { Card, CardHeader } from "@/components/ui/card";
import {DoorOpen, Window as WindowIcon} from "lucide-react"; // Using a Window icon

export function WindowStatusWidget({ topic, mqttUrl, username, password }) {
    const [windowStatuses, setWindowStatuses] = useState([]);

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
                    setWindowStatuses(data.windows ?? []);
                } catch (err) {
                    console.error("Error parsing MQTT message:", err);
                }
            }
        });

        return () => {
            mqttClient.end();
        };
    }, [mqttUrl, topic, username, password]);

    return (
        <div className="flex gap-5 mt-6  hover:scale-105 duration-300">
            <Card className=" mt-6 aspect-square rounded-[50px] flex  items-center shadow-[0_0_5px_10px_lightgray]">
                <CardHeader className="flex flex-col justify-center items-center text-center pb-0">
                    <div className="flex gap-3 justify-center items-center">
                        <DoorOpen className="text-gray-900 w-[50px] h-[50px]" />
                        <div className="flex flex-col">
                            <p className="text-lg">Windows</p>
                            <p className="text-small text-default-500">
                                Status: {windowStatuses.some((w) => w.status === "open") ? "Opened" : "Closed"}
                            </p>
                        </div>
                    </div>
                    <div className={"relative inline-block w-12 h-6 cursor-pointer rounded-full transition-all duration-300"}><div className={"absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300 "}/></div>
                </CardHeader>
            </Card>
        </div>

    );
}
