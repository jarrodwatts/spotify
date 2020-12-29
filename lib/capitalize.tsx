export default function capitalizeFirstLetter(string: String) {
  let splitString: String[] = string.split(" ");
  splitString = splitString.map((s) => s.charAt(0).toUpperCase() + s.slice(1));

  return splitString.join(" ");
}
