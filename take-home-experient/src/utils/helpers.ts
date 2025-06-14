import type { User } from "./fetch/users";

export const getName = (user: User): string => {
  let title = null;
  let first = null;
  let last = null;
  const nameArray = user.name.split(" ");
  if (
    nameArray[0] === "Mr." ||
    nameArray[0] === "Ms." ||
    nameArray[0] === "Mrs."
  ) {
    title = nameArray[0];
    nameArray.splice(0, 1);
  }

  first = nameArray[0];
  nameArray.splice(0, 1);

  last = nameArray.join(" ");
  return `${last}, ${first} ${title ? `(${title})` : ""}`;
};

export const getShortZipCode = (zip: string): string => {
  const zipCodeMatch = zip.match(/(\d{5})/);
  let zipCode = "";
  if (zipCodeMatch) {
    zipCode = zipCodeMatch[0];
  }

  return zipCode;
};
