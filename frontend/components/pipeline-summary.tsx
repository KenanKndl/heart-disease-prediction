import { Activity, ChartNoAxesCombined, Filter, Trees } from "lucide-react";
import { cn } from "@/lib/utils"; // cn fonksiyonunu ekledik

const steps = [
  {
    title: "ECG Signal Input",
    description:
      "A 187-point heartbeat segment is loaded from the MIT-BIH test set.",
    icon: Activity,
  },
  {
    title: "Feature Extraction",
    description:
      "Statistical, energy-based and peak-based ECG features are extracted.",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Feature Selection",
    description:
      "SelectKBest keeps the most useful features for classification.",
    icon: Filter,
  },
  {
    title: "Classification",
    description:
      "The selected features are evaluated by a Random Forest classifier.",
    icon: Trees,
  },
];

export function PipelineSummary() {
  return (
    // Dış kapsayıcının arka planını çok hafif gri (muted/10) yapıp border'ını incelttik. 
    // Böylece içindeki beyaz kartlar daha iyi öne çıkacak.
    <div className="rounded-[2rem] border border-border/40 bg-muted/10 p-6 md:p-10 shadow-sm">
      <div className="grid gap-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === steps.length - 1; // Son kart mı kontrolü

          return (
            <div
              key={step.title}
              className={cn(
                "grid gap-5 rounded-[1.5rem] border p-5 md:grid-cols-[auto_1fr_auto] md:items-center md:p-6 transition-all duration-300",
                isLast
                  ? "border-foreground bg-foreground shadow-lg" // Son kart için siyah tema
                  : "border-border/50 bg-background shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06)]" // Diğer kartlar için beyaz tema ve gölge
              )}
            >
              {/* İkon Kutusu */}
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-2xl border transition-colors",
                  isLast
                    ? "border-background/20 bg-background/10 text-background"
                    : "border-border/60 bg-muted/20 text-foreground"
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={1.8} />
              </div>

              {/* Metin Alanı */}
              <div>
                <h3
                  className={cn(
                    "font-semibold tracking-tight",
                    isLast ? "text-background" : "text-foreground"
                  )}
                >
                  {step.title}
                </h3>

                <p
                  className={cn(
                    "mt-1 text-sm leading-6",
                    isLast ? "text-background/70" : "text-muted-foreground"
                  )}
                >
                  {step.description}
                </p>
              </div>

              {/* Adım Numarası */}
              <span
                className={cn(
                  "text-xs font-bold",
                  isLast ? "text-background/40" : "text-muted-foreground/40"
                )}
              >
                0{index + 1}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}