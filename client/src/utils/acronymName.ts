export default function acronymName(name: string) {
  return (
    name.charAt(0).toUpperCase() +
    (name.split(" ")?.length > 1
      ? name.split(" ")[name.split(" ").length - 1].charAt(0).toUpperCase()
      : "")
  );
}
