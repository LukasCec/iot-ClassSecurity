export const formatDateTime = (dateTime: string): string => {
  const date = new Date(dateTime); // Parse the date string into a Date object

  // Define the options type explicitly
  const options: Intl.DateTimeFormatOptions = {
    month: "short", // e.g., "Jan"
    day: "numeric",
    year: "numeric",
  };

  // Format the date
  const formattedDate = date.toLocaleDateString("en-US", options);

  // Format the time
  const time = date.toLocaleTimeString("en-US", {
    hour12: false, // Use 24-hour format
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return `${formattedDate} ${time}`;
};
