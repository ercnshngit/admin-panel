export function slugify(text: string) {
  if (!text) return "";
  var trMap = {
    çÇ: "c",
    ğĞ: "g",
    şŞ: "s",
    üÜ: "u",
    ıİ: "i",
    öÖ: "o",
  } as const;
  for (var key in trMap) {
    text = text.replace(
      new RegExp("[" + key + "]", "g"),
      trMap[key as keyof typeof trMap]
    );
  }
  return text
    .replace(/[^-a-zA-Z0-9\s]+/gi, "") // remove non-alphanumeric chars
    .replace(/\s/gi, "-") // convert spaces to dashes
    .replace(/[-]+/gi, "-") // trim repeated dashes
    .toLowerCase();
}
