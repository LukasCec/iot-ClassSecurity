type StatusIndicatorProps = {
  status: "secured" | "unsecured";
};

export default function StatusIndicator({ status }: StatusIndicatorProps) {
  const color = status === "secured" ? "bg-red-500" : "bg-blue-500";

  return (
    <div className="flex items-center space-x-2">
      <span className="relative flex h-3 w-3">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${color}`}
        ></span>
        <span
          className={`relative inline-flex rounded-full h-3 w-3 ${color}`}
        ></span>
      </span>
      <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
    </div>
  );
}
