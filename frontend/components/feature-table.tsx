import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type FeatureTableProps = {
  features: Record<string, number>;
};

export function FeatureTable({ features }: FeatureTableProps) {
  const rows = Object.entries(features);

  return (
    <Card className="border-border/70 bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Extracted Features</CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">
          Statistical and signal-based features extracted from the ECG signal.
        </p>
      </CardHeader>
      <CardContent>
        <div className="max-h-[360px] overflow-auto rounded-xl border border-border/70">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-muted text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Feature</th>
                <th className="px-4 py-3 font-semibold">Value</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([feature, value]) => (
                <tr key={feature} className="border-t border-border/70">
                  <td className="px-4 py-2 font-medium text-foreground">
                    {feature}
                  </td>
                  <td className="px-4 py-2 text-muted-foreground">
                    {Number(value).toFixed(5)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
