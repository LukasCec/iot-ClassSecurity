import Link from "next/link";
import Image from "next/image";
import { Thermometer } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function RoomCard({ name, image, tempc }) {
  return (
    <Card className="w-auto group rounded-[50px] hover:scale-[102%] duration-300 relative space-y-4 overflow-hidden">
      <figure className="group-hover:opacity-90">
        <Image
          className="aspect-square w-full"
          src={image}
          width={400}
          height={400}
          alt={name}
        />
      </figure>
      <CardContent className="px-4 py-0">
        <div className="flex justify-between">
          <div>
            <h3 className="text-xl pl-5 uppercase">
              <Link href={"rooms/" + name.toLowerCase()}>
                <span aria-hidden="true" className="absolute inset-0" />
                {name}
              </Link>
            </h3>
          </div>
          <div className="flex flex-row items-center">
            <Thermometer size={22} />
            <span className="text-lg font-semibold"> {tempc} °C </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-0 border-t"></CardFooter>
    </Card>
  );
}
