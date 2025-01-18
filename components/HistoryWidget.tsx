import React, { useState, useEffect } from "react";
import mqtt from "mqtt";
import { Card, CardHeader } from "@/components/ui/card";
import { DoorOpen } from "lucide-react";

export function HistoryWidget({ topic, mqttUrl, username, password }) {
    const [history, setHistory] = useState([]);

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
                    setHistory(data.history ?? []);
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
        <Card className="w-full rounded-[50px] pb-4 px-3">
            <CardHeader className="flex justify-between items-center">
                <div className="flex gap-3">
                    <div className="flex flex-col">
                        <p className="text-lg">History</p>
                    </div>
                </div>
            </CardHeader>
            <div className="w-full bg-neutral-50 rounded-[50px] px-3 py-2  h-auto">
                <table className="w-full  text-gray-900">
                    <thead>
                    <tr className="border-b-3 border-b-gray-700">
                        <th className="px-4 py-2">Event</th>
                        <th className="px-4 py-2">Timestamp</th>
                    </tr>
                    </thead>
                    <tbody>
                    {history.length > 0 ? (
                        history.map((entry, index) => (
                            <tr key={index}>
                                <td className="text-center px-4 py-2">{entry.event}</td>
                                <td className="text-center px-4 py-2">
                                    {new Date(entry.dt).toLocaleString()}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2" className="text-center px-4 py-2">
                                No history available
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
