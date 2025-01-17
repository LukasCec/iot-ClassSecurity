"use client";

import { useState, useEffect } from "react";
import mqtt from "mqtt";
import { TrendingUp } from "lucide-react";
import {
    Label,
    PolarGrid,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
} from "recharts";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    safari: {
        label: "Safari",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

export function TempChart() {
    const [temperature, setTemperature] = useState<number>(0); // State for temperature
    const [humidity, setHumidity] = useState<number>(0); // State for humidity
    const [client, setClient] = useState<any>(null); // MQTT client state

    useEffect(() => {
        // MQTT connection options
        const options = {
            username: "maker",
            password: "mother.mqtt.password",
        };

        // Connect to the MQTT broker
        const mqttClient = mqtt.connect("ws://147.232.205.176:8000", options);

        mqttClient.on("connect", () => {
            console.log("MQTT connection successful");

            // Subscribe to the topics for temperature and humidity
            mqttClient.subscribe("gateway/temperature/zen-e6614103e7698839", (err) => {
                if (err) {
                    console.error("Error subscribing to temperature topic", err);
                } else {
                    console.log("Successfully subscribed to temperature topic");
                }
            });

            mqttClient.subscribe("gateway/humidity/zen-e6614103e7698839", (err) => {
                if (err) {
                    console.error("Error subscribing to humidity topic", err);
                } else {
                    console.log("Successfully subscribed to humidity topic");
                }
            });
        });

        mqttClient.on("message", (topic, message) => {
            try {
                const data = JSON.parse(message.toString());

                // Log the message contents for both topics
                console.log("Message received on topic:", topic);
                console.log("Message contents:", data);

                if (topic === "gateway/temperature/zen-e6614103e7698839") {
                    const temperatureData = data.metrics.find((metric: any) => metric.name === "temperature");
                    if (temperatureData) {
                        setTemperature(Math.round(temperatureData.value)); // Set temperature
                    }
                }

                if (topic === "gateway/humidity/zen-e6614103e7698839") {
                    const humidityData = data.metrics.find((metric: any) => metric.name === "humidity");
                    if (humidityData) {
                        setHumidity(Math.round(humidityData.value)); // Set humidity
                    }
                }
            } catch (err) {
                console.error("Error parsing MQTT message:", err);
            }
        });

        setClient(mqttClient);

        return () => {
            mqttClient.end();
        };
    }, []);

    const chartData = [
        {
            browser: "safari",
            temperature, // Use state value for temperature
            humidity, // Use state value for humidity
            fill: "var(--color-safari)",
        },
    ];

    return (
        <Card className="flex flex-col rounded-[50px] p-0">
            <CardContent className="flex-1 p-0 ">
                {/* Flex container to display charts side by side */}
                <div className="flex space-x-4">
                    {/* Temperature Chart */}
                    <ChartContainer
                        config={chartConfig}
                        className="aspect-square max-h-[250px] flex-1"
                    >
                        <RadialBarChart
                            data={chartData}
                            startAngle={90} // Start from top
                            endAngle={90 + (360 * (chartData[0].temperature / 50))} // Increase clockwise
                            innerRadius={80}
                            outerRadius={110}
                            className="p-0"
                        >
                            <PolarGrid
                                gridType="circle"
                                radialLines={false}
                                stroke="none"
                                className="first:fill-muted last:fill-background"
                                polarRadius={[86, 74]}
                            />
                            <RadialBar
                                dataKey="temperature" // Use temperature data for the first chart
                                background
                                cornerRadius={10}
                                fill="var(--color-safari)"
                                maxBarSize={50} // Control size of progress bar
                                minPointSize={10} // Minimum point size for better visibility
                                isAnimationActive={true}
                            />
                            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                                <Label
                                    content={({ viewBox }) => {
                                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                            return (
                                                <text
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                >
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        className="fill-foreground text-4xl font-bold"
                                                    >
                                                        {chartData[0].temperature.toLocaleString() + "°C"}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) + 24}
                                                        className="fill-muted-foreground"
                                                    >
                                                        Temperature
                                                    </tspan>
                                                </text>
                                            );
                                        }
                                    }}
                                />
                            </PolarRadiusAxis>
                        </RadialBarChart>
                    </ChartContainer>

                    {/* Humidity Chart */}
                    <ChartContainer
                        config={chartConfig}
                        className="aspect-square max-h-[250px] flex-1"
                    >
                        <RadialBarChart
                            data={chartData}
                            startAngle={90} // Start from top
                            endAngle={90 + (360 * chartData[0].humidity) / 100} // Increase clockwise
                            innerRadius={80}
                            outerRadius={110}
                            className="p-0"
                        >
                            <PolarGrid
                                gridType="circle"
                                radialLines={false}
                                stroke="none"
                                className="first:fill-muted last:fill-background"
                                polarRadius={[86, 74]}
                            />
                            <RadialBar
                                dataKey="humidity" // Use humidity data for the second chart
                                background
                                cornerRadius={10}
                                fill="var(--color-safari)" // Set a different color for the progress
                                maxBarSize={50} // Control size of progress bar
                                minPointSize={10} // Minimum point size for better visibility
                                isAnimationActive={true}
                            />
                            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                                <Label
                                    content={({ viewBox }) => {
                                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                            return (
                                                <text
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                >
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        className="fill-foreground text-4xl font-bold"
                                                    >
                                                        {chartData[0].humidity.toLocaleString() + "%"}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) + 24}
                                                        className="fill-muted-foreground"
                                                    >
                                                        Humidity
                                                    </tspan>
                                                </text>
                                            );
                                        }
                                    }}
                                />
                            </PolarRadiusAxis>
                        </RadialBarChart>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    );
}
