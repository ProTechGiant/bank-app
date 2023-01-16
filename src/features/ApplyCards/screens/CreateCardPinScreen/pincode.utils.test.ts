import * as pincodeUtils from "./is-valid-pincode";

describe("is-valid-pincode", () => {
  it("recognizes a sequential pincode", () => {
    expect(pincodeUtils.isSequential("12345")).toBe(true);
    expect(pincodeUtils.isSequential("56789")).toBe(true);
    expect(pincodeUtils.isSequential("21345")).toBe(false);
    expect(pincodeUtils.isSequential("76678")).toBe(false);
  });

  it("recognizes an identical pincode", () => {
    expect(pincodeUtils.isIdentical("11111")).toBe(true);
    expect(pincodeUtils.isIdentical("33333")).toBe(true);
    expect(pincodeUtils.isIdentical("99999")).toBe(true);
    expect(pincodeUtils.isIdentical("32145")).toBe(false);
    expect(pincodeUtils.isIdentical("78964")).toBe(false);
  });

  it("rejects invalid pincodes", () => {
    expect(pincodeUtils.default("12345")).toBe(false);
    expect(pincodeUtils.default("22222")).toBe(false);
    expect(pincodeUtils.default("57218")).toBe(true);
  });
});
