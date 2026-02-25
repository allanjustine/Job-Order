export default function YearOptions({ startYear }: { startYear: number }) {
  const currentYear = new Date().getFullYear();

  const years = Array.from({ length: currentYear - startYear + 1 }).map(
    (_, i) => startYear + i,
  );

  return (
    <>
      <option value="">Select Year</option>
      {years
        .sort((a, b) => b - a)
        .map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
    </>
  );
}
