import { cn } from "@/lib/utils";

type MetricCardProps = {
  title: string;
  value: string;
  description?: string;
  isHighlighted?: boolean;
};

export function MetricCard({ title, value, description, isHighlighted }: MetricCardProps) {
  return (
    <div
      className={cn(
        "flex min-h-[160px] flex-col justify-between rounded-[1.75rem] border p-6 transition-shadow duration-300",
        isHighlighted
          ? "border-foreground bg-foreground shadow-lg"
          : "border-border/50 bg-background shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.06)]"
      )}
    >
      <div>
        <p
          className={cn(
            "text-sm font-medium",
            isHighlighted ? "text-background/70" : "text-muted-foreground"
          )}
        >
          {title}
        </p>

        <p
          className={cn(
            "mt-5 text-4xl font-bold tracking-tight",
            isHighlighted ? "text-background" : "text-foreground"
          )}
        >
          {value}
        </p>
      </div>

      {description ? (
        <p
          className={cn(
            "mt-6 text-sm leading-6",
            isHighlighted ? "text-background/70" : "text-muted-foreground"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}