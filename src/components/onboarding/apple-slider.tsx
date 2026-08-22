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
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted shadow-[0_1px_2px_oklch(0_0_0/0.06)_inset]">
        <SliderPrimitive.Range className="absolute h-full rounded-full bg-[linear-gradient(90deg,color-mix(in_oklab,var(--color-primary)_82%,white),var(--color-primary))]" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block size-6 rounded-full border border-black/[0.06] bg-[linear-gradient(180deg,white,color-mix(in_oklab,white_92%,var(--color-muted)))] shadow-[0_1px_1px_oklch(1_0_0/0.9)_inset,0_2px_6px_oklch(0_0_0/0.18),0_8px_18px_-10px_oklch(0_0_0/0.35)] outline-none transition-transform duration-150 hover:scale-105 focus-visible:ring-4 focus-visible:ring-primary/25 active:scale-95" />

    </SliderPrimitive.Root>
  );
}