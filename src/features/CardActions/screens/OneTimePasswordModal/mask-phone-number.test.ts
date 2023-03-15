import { maskPhoneNumber } from "./mask-phone-number";

describe("maskPhoneNumber", () => {
  it("create masked for a HKG phone number with country code", () => {
    const maskedString = maskPhoneNumber("+85291234567");

    expect(maskedString).toBe("•••• ••");
  });

  it("create masked for a SA phone number with country code", () => {
    const maskedString = maskPhoneNumber("+966512345678");

    expect(maskedString).toBe("•• ••• ••");
  });

  it("create masked for phone number without country code", () => {
    const maskedString = maskPhoneNumber("12345678");

    expect(maskedString).toBe("••••••");
  });
});
