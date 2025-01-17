import RoomCard from "@/components/RoomCard";

export default function Rooms() {
  const availableRooms = [
    {
      name: "Kronos",
      image: "/images/rooms/kronos.png",
      tempc: "23",
    },
    {
      name: "Caprica",
      image: "/images/rooms/caprica.png",
      tempc: "23",
    },
    {
      name: "Endor",
      image: "/images/rooms/endor.png",
      tempc: "23",
    },
    {
      name: "Vulcan",
      image: "/images/rooms/vulcan.png",
      tempc: "23",
    },
    {
      name: "Abydos",
      image: "/images/rooms/abydos.png",
      tempc: "23",
    },
    {
      name: "Dune",
      image: "/images/rooms/dune.png",
      tempc: "23",
    },
    {
      name: "Romulus",
      image: "/images/rooms/romulus.png",
      tempc: "23",
    },
    {
      name: "Solaris",
      image: "/images/rooms/solaris.png",
      tempc: "23",
    },
    {
      name: "Hyperion",
      image: "/images/rooms/hyperion.png",
      tempc: "23",
    },
  ];

  return (
    <div className="h-full min-h-[100vh] w-full px-8 md:px-20 py-10">
      <h1 className="font-bold text-4xl mb-6">Available rooms:</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14">
        {availableRooms.map((room, index) => (
          <RoomCard {...room} key={index} />
        ))}
      </div>
    </div>
  );
}
