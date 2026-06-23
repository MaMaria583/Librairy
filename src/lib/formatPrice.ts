export function formatPrice(amount: number): string {
  return (
    new Intl.NumberFormat("fr-ML", {
      maximumFractionDigits: 0,
    }).format(Math.round(amount)) + " FCFA"
  );
}
