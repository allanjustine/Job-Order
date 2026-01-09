export default function capitalized(str: string) {
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}
