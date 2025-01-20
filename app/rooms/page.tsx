import RoomCard from "@/components/RoomCard";

export default function Rooms() {
  const availableRooms = [
    {
      name: "Kronos",
      image: "/images/rooms/kronos.png",
      status: "secured",
    },
    {
      name: "Caprica",
      image: "/images/rooms/caprica.png",
      status: "unsecured",
    },
    {
      name: "Endor",
      image: "/images/rooms/endor.png",
      status: "unsecured",
    },
    {
      name: "Vulcan",
      image: "/images/rooms/vulcan.png",
      status: "unsecured",
    },
    {
      name: "Abydos",
      image: "/images/rooms/abydos.png",
      status: "unsecured",
    },
    {
      name: "Dune",
      image: "/images/rooms/dune.png",
      status: "unsecured",
    },
    {
      name: "Romulus",
      image: "/images/rooms/romulus.png",
      status: "unsecured",
    },
    {
      name: "Solaris",
      image: "/images/rooms/solaris.png",
      status: "unsecured",
    },
    {
      name: "Hyperion",
      image: "/images/rooms/hyperion.png",
      status: "unsecured",
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
