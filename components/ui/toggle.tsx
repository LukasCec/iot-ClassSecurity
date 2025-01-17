type ToggleProps = {
    label: string;
};

export default function Toggle({ label }: ToggleProps) {
    return (
        <div className="flex items-center justify-between">
            <span>{label}</span>
            <button
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200"
                role="switch"
            >
                <span className="absolute left-0 h-4 w-4 bg-white rounded-full transition-transform transform translate-x-1" />
            </button>
        </div>
    );
}
