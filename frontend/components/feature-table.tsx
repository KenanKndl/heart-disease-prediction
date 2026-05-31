type FeatureTableProps = {
  features: Record<string, number>;
};

export function FeatureTable({ features }: FeatureTableProps) {
  const ObjectEntries = Object.entries(features);

  return (
    <div className="rounded-[2rem] border border-border/60 bg-background p-6 md:p-8 flex flex-col">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-foreground">
            Extracted Features
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Statistical and signal-based features extracted from the ECG.
          </p>
        </div>

        <div className="w-fit rounded-full border border-border/40 bg-muted/10 px-3 py-1 text-xs font-medium text-muted-foreground">
          {ObjectEntries.length} features
        </div>
      </div>

      <div className="flex-1 overflow-hidden rounded-[1.5rem] border border-border/40 bg-muted/5">
        <div className="max-h-[340px] overflow-auto px-6 py-2">
          <div className="flex flex-col">
            {ObjectEntries.map(([feature, value], index) => (
              <div
                key={feature}
                className="flex items-center justify-between border-b border-border/30 py-3.5 last:border-0 hover:bg-muted/10 transition-colors -mx-6 px-6"
              >
                <span className="text-sm font-medium text-foreground">
                  {feature}
                </span>
                <span className="font-mono text-sm text-muted-foreground">
                  {Number(value).toFixed(5)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}