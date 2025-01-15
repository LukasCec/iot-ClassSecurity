import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Rooms() {
  const availableRooms = [
    "kronos",
    "endor",
    "meridian",
    "vulcan",
    "caprica",
    "abydos",
    "dune",
    "romulus",
    "solaris",
    "hyperion",
  ];

  return (
    <div className="h-full min-h-[100vh] w-full px-20 py-10">
      <h1 className="font-bold text-4xl">Available rooms:</h1>
      <div className="flex flex-row gap-3">
        {availableRooms.map((room, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{room}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Room {index + 1}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
