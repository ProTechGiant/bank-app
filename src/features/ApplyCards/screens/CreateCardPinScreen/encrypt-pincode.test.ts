import encryptPincode from "./encrypt-pincode";

describe("encrypt-pincode", () => {
  it("encrypts pincode using rsa", () => {
    const encrypted = encryptPincode("1234");

    expect(typeof encrypted).toBe("string");
    expect(encrypted.length).toBe(344);
  });
});
