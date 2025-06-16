export default function phpCurrency(amount: number) {
  return amount.toLocaleString("en-PH", {
    style: "currency",
    currency: "PHP",
  });
}
