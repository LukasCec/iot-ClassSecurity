type SliderProps = {
    label: string;
    min: number;
    max: number;
    unit?: string;
};

export default function Slider({ label, min, max, unit }: SliderProps) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
                type="range"
                min={min}
                max={max}
                className="w-full mt-2"
            />
            <div className="text-right text-sm">
                {min} {unit} - {max} {unit}
            </div>
        </div>
    );
}
