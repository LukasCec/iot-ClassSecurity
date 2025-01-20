import React from "react";
import dayjs from "dayjs";

interface CalendarRowProps {
  currentDate?: Date; // Optional, defaults to today
}

const CalendarRow: React.FC<CalendarRowProps> = ({
  currentDate = new Date(),
}) => {
  const today = dayjs(currentDate);
  const days = Array.from({ length: 7 }, (_, i) => {
    return today.add(i - 3, "day");
  });

  return (
    <div className="flex items-center justify-center gap-2">
      {days.map((day, index) => (
        <div
          key={index}
          className={`w-16 h-20 flex flex-col cursor-pointer hover:translate-y-[-5px] duration-300 items-center justify-center rounded-[40px] ${
            day.isSame(today, "day")
              ? "bg-neutral-100 dark:bg-muted dark:text-white text-gray-900 font-bold"
              : "bg-neutral-50 dark:bg-muted dark:text-gray-300 text-gray-700"
          }`}
        >
          <div className="text-center">
            <p className="text-xl">{day.format("D")}</p>
            <p className="text-sm">{day.format("ddd")}</p>
          </div>
          {day.isSame(today, "day") && (
            <div className="w-2 h-2 mt-1 rounded-full bg-green-500"></div> // Small green dot
          )}
        </div>
      ))}
    </div>
  );
};

export default CalendarRow;
