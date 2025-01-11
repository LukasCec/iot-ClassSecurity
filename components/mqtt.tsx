'use client';

import { useState, useEffect } from 'react';
import mqtt from 'mqtt';
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { DoorOpen } from "lucide-react";

// Define the type for the history data
interface CardData {
    card_id: string;
    holder_name: string;
    timestamp: number; // Assuming timestamp is a number (Unix timestamp)
}

// Helper function to format the timestamp into a readable format
const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

const MqttClient = () => {
    const [isActivated, setIsActivated] = useState(false); // State to track the switch status
    const [client, setClient] = useState<any>(null); // MQTT client state
    const [history, setHistory] = useState<CardData[]>([]); // Explicitly typing the history state
    const [doorStatus, setDoorStatus] = useState('closed'); // State for door status

    useEffect(() => {
        const options = {
            username: 'maker',
            password: 'mother.mqtt.password',
        };

        // Connect to MQTT broker over WebSocket
        const mqttClient = mqtt.connect('ws://147.232.205.176:8000', options);

        mqttClient.on('connect', () => {
            console.log('MQTT connection successful');
            // Subscribe to the History topic to listen for visitor data
            mqttClient.subscribe('kpi/kronos/temperature/LES/History/#', (err) => {
                if (err) {
                    console.error('Error subscribing to History topic', err);
                }
            });

            // Subscribe to the DoorStatus topic to listen for door status updates
            mqttClient.subscribe('kpi/kronos/temperature/LES/DoorStatus', (err) => {
                if (err) {
                    console.error('Error subscribing to DoorStatus topic', err);
                }
            });
        });

        mqttClient.on('message', (topic, message) => {
            // If message comes from a History card topic (e.g., History/Card1, History/Card2)
            if (topic.startsWith('kpi/kronos/temperature/LES/History/')) {
                const cardData: CardData = JSON.parse(message.toString());
                setHistory((prevHistory) => [cardData, ...prevHistory]); // Prepend the new card data to the history
            }

            // If message comes from the DoorStatus topic
            if (topic === 'kpi/kronos/temperature/LES/DoorStatus') {
                const doorData = JSON.parse(message.toString());
                setDoorStatus(doorData.status); // Update door status based on the MQTT message
            }
        });

        setClient(mqttClient); // Store the client for later use

        return () => {
            mqttClient.end(); // Disconnect on component unmount
        };
    }, []);

    const handleSwitchChange = () => {
        setIsActivated(!isActivated); // Toggle the state of the switch

        const topic = 'kpi/kronos/temperature/LES/DoorSecurity'; // Define the MQTT topic
        const message = isActivated ? 'deactivated' : 'activated'; // Determine the message based on the switch state

        if (client) {
            client.publish(topic, message, { qos: 0, retain: false }, (err) => {
                if (err) {
                    console.error('Error sending message:', err);
                } else {
                    console.log(`Message "${message}" sent successfully to topic: ${topic}`);
                }
            });
        }
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
                                    Status: {doorStatus === 'opened' ? 'Opened' : 'Closed'}
                                </p>
                            </div>
                        </div>
                        {/* Switch positioned on the right side */}
                        <div
                            onClick={handleSwitchChange}
                            className={`relative inline-block w-12 h-6 cursor-pointer rounded-full transition-all duration-300 ${isActivated ? 'bg-green-500' : 'bg-gray-600'}`}
                        >
                            <div
                                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300 ${isActivated ? 'transform translate-x-full' : ''}`}
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
                                <p className="text-lg">Window 1</p>
                                <p className="text-small text-default-500">Status: Closed</p>
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
                {/* Table for Visitor History */}
                <div className="w-[93%] bg-gray-800 px-3 py-2 rounded-lg">
                    <table className="w-full text-white">
                        <thead>
                        <tr className="border-b-3 border-b-gray-700">
                            <th className="px-4 py-2">Card ID</th>
                            <th className="px-4 py-2">Holder Name</th>
                            <th className="px-4 py-2">Timestamp</th>
                        </tr>
                        </thead>
                        <tbody>
                        {history.map((entry, index) => (
                            <tr key={index}>
                                <td className="text-center px-4 py-2">{entry.card_id}</td>
                                <td className="text-center px-4 py-2">{entry.holder_name}</td>
                                <td className="text-center px-4 py-2">{formatDate(entry.timestamp)}</td>
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
