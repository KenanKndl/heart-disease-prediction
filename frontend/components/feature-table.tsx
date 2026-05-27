type FeatureTableProps = {
  features: Record<string, number>;
};

export function FeatureTable({ features }: FeatureTableProps) {
  const rows = Object.entries(features);

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-slate-900">
          Extracted Features
        </h3>
        <p className="text-sm text-slate-500">
          Statistical and signal-based features extracted from the ECG signal.
        </p>
      </div>

      <div className="max-h-[360px] overflow-auto rounded-xl border">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-slate-100 text-slate-700">
            <tr>
              <th className="px-4 py-3 font-semibold">Feature</th>
              <th className="px-4 py-3 font-semibold">Value</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([feature, value]) => (
              <tr key={feature} className="border-t">
                <td className="px-4 py-2 font-medium text-slate-700">
                  {feature}
                </td>
                <td className="px-4 py-2 text-slate-600">
                  {Number(value).toFixed(5)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}