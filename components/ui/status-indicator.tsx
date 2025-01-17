type StatusIndicatorProps = {
    status: "online" | "offline";
};

export default function StatusIndicator({ status }: StatusIndicatorProps) {
    const color = status === "online" ? "bg-green-500" : "bg-red-500";

    return (
        <div className="flex mb-12 items-center space-x-2">
            <span className={`h-3 w-3  rounded-full ${color}`} />
            <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
        </div>
    );
}
