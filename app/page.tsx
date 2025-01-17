import MqttClient from "../components/Mqtt";

export default function Home() {
  return (
    <div className="h-full min-h-[100vh] w-full px-20 py-10">
      <h1 className="font-bold text-2xl">Old test</h1>
      <MqttClient></MqttClient>
    </div>
  );
}
