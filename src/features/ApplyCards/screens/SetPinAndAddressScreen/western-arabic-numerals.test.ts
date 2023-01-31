import westernArabicNumerals from "./western-arabic-numerals";

describe("western-arabic-numerals", () => {
  it("converts eastern arabic numerals", () => {
    const inputString = "٠١٢٣٤٥٦٧٨٩";
    expect(westernArabicNumerals(inputString)).toEqual("0123456789");
  });

  it("converts persian arabic numerals", () => {
    const inputString = "۰۱۲۳۴۵۶۷۸۹";
    expect(westernArabicNumerals(inputString)).toEqual("0123456789");
  });
});
