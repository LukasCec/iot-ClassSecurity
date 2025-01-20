export const formatDateTime = (dateTime) => {
  const date = new Date(dateTime); // Parse the date string into a Date object

  // Extract date components
  const options = { month: "short", day: "numeric", year: "numeric" }; // Month in 'Jan' format
  const formattedDate = date.toLocaleDateString("en-US", options);

  // Extract time
  const time = date.toLocaleTimeString("en-US", {
    hour12: false, // Use 24-hour format
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return `${formattedDate} ${time}`;
};
