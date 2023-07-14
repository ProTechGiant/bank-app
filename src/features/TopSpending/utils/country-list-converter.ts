interface CountryData {
  title: string;
  data: string[];
}

export const convertToCountryList = (array: { label: string; value: string }[]): CountryData[] => {
  const groupedArray: { [key: string]: string[] } = {};
  array.forEach(obj => {
    const firstLetter = obj.label.charAt(0).toUpperCase();
    if (!groupedArray[firstLetter]) groupedArray[firstLetter] = [];
    groupedArray[firstLetter].push(obj.label);
  });
  const countryList: CountryData[] = Object.entries(groupedArray).map(([title, data]) => ({
    title,
    data,
  }));
  return countryList;
};
