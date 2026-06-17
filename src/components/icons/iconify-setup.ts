// Shared Iconify collection registration (used by BrandIcon in Skills).
import { addCollection, type IconifyJSON } from "@iconify/react";
import logos from "@iconify-json/logos/icons.json";
import devicon from "@iconify-json/devicon/icons.json";
import skillIcons from "@iconify-json/skill-icons/icons.json";

let registered = false;

export function registerIconCollections() {
  if (registered) return;
  addCollection(logos as IconifyJSON);
  addCollection(devicon as IconifyJSON);
  addCollection(skillIcons as IconifyJSON);
  registered = true;
}
