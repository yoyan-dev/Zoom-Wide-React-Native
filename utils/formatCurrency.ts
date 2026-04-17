export function formatPhilippinePeso(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "Request quote";
  }

  return `\u20B1${value.toLocaleString("en-PH", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })}`;
}
