import Image from "next/image";
import MqttClient from '../components/mqtt';

export default function Home() {
  return (
      <div className="bg-gray-900 h-full min-h-[100vh] w-full px-20 py-10">
        <h1 className="font-bold text-2xl">Devices:</h1>
          <MqttClient>

          </MqttClient>

      </div>
  );
}