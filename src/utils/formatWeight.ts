export function formatWeight(weight_g?: number | string | null): string {
  if (!weight_g) return "-";

  const weight = Number(weight_g); 

  if (weight < 1000) {
    return `${weight.toLocaleString("id-ID")} g`;
  } else {
    const kg = weight / 1000;
    return `~${kg.toFixed(1)} kg`;
  }
}
