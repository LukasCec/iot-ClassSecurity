'use client';

import { useState, useEffect } from 'react';
import mqtt from 'mqtt';
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { DoorOpen } from "lucide-react";

const MqttClient = () => {
    const [isActivated, setIsActivated] = useState(false);
    const [client, setClient] = useState(null);
    const [history, setHistory] = useState([]);
    const [doorStatus, setDoorStatus] = useState('unknown');
    const [windowsStatus, setWindowsStatus] = useState('unknown');

    useEffect(() => {
        const options = {
            username: 'maker',
            password: 'mother.mqtt.password',
        };

        const mqttClient = mqtt.connect('ws://147.232.205.176:8000', options);

        mqttClient.on('connect', () => {
            console.log('MQTT connection successful');

            // Subscribe to the topic
            mqttClient.subscribe('/kpi/kronos/security/megasupa', (err) => {
                if (err) {
                    console.error('Error subscribing to topic', err);
                } else {
                    console.log('Successfully subscribed to /kpi/kronos/security/megasupa');
                }
            });
        });

        mqttClient.on('message', (topic, message) => {
            if (topic === '/kpi/kronos/security/megasupa') {
                try {
                    const data = JSON.parse(message.toString());

                    // Update states
                    setIsActivated(data.activated ?? false);
                    setDoorStatus(data.door?.status ?? 'unknown');

                    // Aggregate window statuses
                    if (data.windows && Array.isArray(data.windows)) {
                        const windowStatus = data.windows.every(window => window.status === 'closed')
                            ? 'closed'
                            : 'open';
                        setWindowsStatus(windowStatus);
                    } else {
                        setWindowsStatus('unknown');
                    }

                    setHistory(data.history ?? []);
                } catch (err) {
                    console.error('Error parsing MQTT message:', err);
                }
            }
        });

        setClient(mqttClient);

        return () => {
            mqttClient.end();
        };
    }, []);

    const handleSwitchChange = () => {
        setIsActivated((prevState) => {
            const newState = !prevState;

            const payload = JSON.stringify({
                activated: newState,
            });

            if (client) {
                client.publish('/kpi/kronos/security/megasupa', payload, { qos: 0, retain: false }, (err) => {
                    if (err) {
                        console.error('Error sending message:', err);
                    } else {
                        console.log(`Message "${payload}" sent successfully to topic.`);
                    }
                });
            }

            return newState;
        });
    };

    return (
        <>
            <div className="flex gap-5 mt-3">
                {/* Card 1 */}
                <Card className="w-[45%] bg-gray-800 px-3">
                    <CardHeader className="flex justify-between items-center">
                        <div className="flex gap-3">
                            <DoorOpen className="text-white w-[50px] h-[50px]" />
                            <div className="flex flex-col">
                                <p className="text-lg">Main Door</p>
                                <p className="text-small text-default-500">
                                    Status: {doorStatus === 'open' ? 'Opened' : 'Closed'}
                                </p>
                            </div>
                        </div>
                        <div
                            onClick={handleSwitchChange}
                            className={`relative inline-block w-12 h-6 cursor-pointer rounded-full transition-all duration-300 ${
                                isActivated ? 'bg-green-500' : 'bg-gray-600'
                            }`}
                        >
                            <div
                                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300 ${
                                    isActivated ? 'transform translate-x-full' : ''
                                }`}
                            />
                        </div>
                    </CardHeader>
                    <CardBody>
                        <p className="mb-6">Entry door to the Kronos classroom</p>
                    </CardBody>
                </Card>

                {/* Card 2 */}
                <Card className="w-[45%] bg-gray-800 px-3">
                    <CardHeader className="flex justify-between items-center">
                        <div className="flex gap-3">
                            <DoorOpen className="text-white w-[50px] h-[50px]" />
                            <div className="flex flex-col">
                                <p className="text-lg">Windows</p>
                                <p className="text-small text-default-500">
                                    Status: {windowsStatus}
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <p className="mb-6">Check if the window is closed or not</p>
                    </CardBody>
                </Card>
            </div>

            <h1 className="mt-6 font-bold text-2xl">History of Visitors:</h1>
            <div className="flex gap-5 mt-3">
                <div className="w-[93%] bg-gray-800 px-3 py-2 rounded-lg">
                    <table className="w-full text-white">
                        <thead>
                        <tr className="border-b-3 border-b-gray-700">
                            <th className="px-4 py-2">Event</th>
                            <th className="px-4 py-2">User</th>
                            <th className="px-4 py-2">Timestamp</th>
                        </tr>
                        </thead>
                        <tbody>
                        {history.map((entry, index) => (
                            <tr key={index}>
                                <td className="text-center px-4 py-2">{entry.event}</td>
                                <td className="text-center px-4 py-2">{entry.user}</td>
                                <td className="text-center px-4 py-2">
                                    {new Date(entry.timestamp).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default MqttClient;
