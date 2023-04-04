import encryptValue from "./encrypt-value";

describe("encrypt-value", () => {
  it("encrypts pincode using rsa", () => {
    const encrypted = encryptValue("1234");

    expect(typeof encrypted).toBe("string");
    expect(encrypted.length).toBe(344);
  });
});
