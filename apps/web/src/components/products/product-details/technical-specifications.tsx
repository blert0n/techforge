const specs = [
  {
    title: "Core Performance",
    rows: [
      ["Graphics Engine", "NVIDIA® GeForce RTX™ 4090"],
      ["Bus Standard", "PCI Express 4.0"],
      ["Video Memory", "24GB GDDR6X"],
      ["Engine Clock", "OC mode: 2640 MHz\nDefault mode: 2610 MHz"],
      ["CUDA Cores", "16384"],
    ],
  },
  {
    title: "Physical & Interfaces",
    rows: [
      ["Dimensions", "357.6 x 149.3 x 70.1 mm"],
      ["Recommended PSU", "1000W"],
      ["Power Connectors", "1 x 16-pin"],
      ["DisplayPort", "3x (Native DisplayPort 1.4a)"],
      ["HDMI", "2x (Native HDMI 2.1a)"],
    ],
  },
];
export function TechnicalSpecifications() {
  return (
    <div className="grid gap-12 rounded-2xl border border-border bg-card p-6 md:grid-cols-2 md:p-8">
      {specs.map((group) => (
        <div key={group.title}>
          <h3 className="mb-4 text-lg font-bold">{group.title}</h3>
          <table className="w-full text-sm">
            <tbody>
              {group.rows.map(([label, value], index) => (
                <tr
                  key={label}
                  className={`border-b border-border ${index % 2 ? "bg-muted/30" : ""}`}
                >
                  <th className="w-1/2 py-3 text-left font-medium text-muted-foreground">
                    {label}
                  </th>
                  <td className="py-3 whitespace-pre-line">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
