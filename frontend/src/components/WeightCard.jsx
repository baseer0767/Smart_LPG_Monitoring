import WeightMeter from "./WeightMeter";
export default function WeightCard({ value = 0, unit = "kg" }) {
  return (
    <div
      className="flex flex-col gap-4 relative overflow-hidden rounded-xl p-6 border border-black/20 
        shadow-lg backdrop-blur-lg bg-white/5 transition-all duration-300 
        hover:-translate-y-1 hover:shadow-xl 
  
        before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-black text-xl font-semibold">Current Weight</h3>
        <div className="text-black/80 text-2xl">⚖</div>
      </div>

      <div className="flex flex-col items-center" >
        <div>
        <WeightMeter weight_in={value} />
        </div>

        {/* Value */}
        <div className="flex items-baseline gap-2 mb-4">
          <div
            className="text-5xl font-bold leading-none drop-shadow-md"
            id="weight"
          >
            {value}
          </div>
          <div className="text-lg font-semibold text-black-300">{unit}</div>
        </div>
      </div>

      {/* Status
      <div className="text-gray-400 text-sm uppercase tracking-wide">
        Real-time measurement
      </div> */}
    </div>
  );
}
