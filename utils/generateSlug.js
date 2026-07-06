import slugify from "slugify";
import Artwork from "../schema/Artwork.js";

export const generateUniqueSlug = async (title) => {
  let slug = slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });

  let uniqueSlug = slug;
  let counter = 1;

  while (await Artwork.findOne({ slug: uniqueSlug })) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
};