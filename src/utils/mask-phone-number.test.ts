import maskPhoneNumber from "./mask-phone-number";

describe("maskPhoneNumber", () => {
  it("create masked for a HKG phone number with country code and show last 4 digits", () => {
    const maskedString = maskPhoneNumber("+85291234567", 4);

    expect(maskedString).toBe("+852 •••• 4567");
  });

  it("create masked for a SA phone number with country code and show last 4 digits", () => {
    const maskedString = maskPhoneNumber("+966512345678", 4);

    expect(maskedString).toBe("+966 •• ••• 5678");
  });

  it("create masked for a SA phone number with country code and show last 3 digits", () => {
    const maskedString = maskPhoneNumber("+966512345678", 3);

    expect(maskedString).toBe("+966 •• ••• •678");
  });

  it("create masked for phone number without country code which starts with 0 and show last 4 digits", () => {
    const maskedString = maskPhoneNumber("0512345678", 4);

    expect(maskedString).toBe("+966 •• ••• 5678");
  });

  it("create masked for phone number without country code which starts with 0, show last 4 digits and hide country code", () => {
    const maskedString = maskPhoneNumber("0512345678", 4, false);

    expect(maskedString).toBe("•• ••• 5678");
  });

  it("create masked for phone number without country code and show last 4 digits", () => {
    const maskedString = maskPhoneNumber("12345678", 4);

    expect(maskedString).toBe("••••5678");
  });
});
