import * as SliderPrimitive from "@radix-ui/react-slider";

export function AppleSlider({
  value,
  onChange,
  min,
  max,
  step = 1,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  label: string;
}) {
  return (
    <SliderPrimitive.Root
      aria-label={label}
      className="relative flex h-6 w-full touch-none select-none items-center"
      value={[value]}
      min={min}
      max={max}
      step={step}
      onValueChange={(v) => onChange(v[0] ?? value)}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block size-6 rounded-full border border-border/70 bg-card shadow-[0_1px_4px_rgba(0,0,0,0.18)] outline-none transition-transform focus-visible:ring-2 focus-visible:ring-primary/40 active:scale-95" />
    </SliderPrimitive.Root>
  );
}