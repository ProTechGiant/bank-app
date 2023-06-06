import * as pincodeUtils from "./is-valid-pin";

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
    expect(pincodeUtils.isIdentical("39992")).toBe(false);
  });

  it("recognizes an identical passcode", () => {
    expect(pincodeUtils.isPasscodeIdentical("11111")).toBe(true);
    expect(pincodeUtils.isPasscodeIdentical("33333")).toBe(true);
    expect(pincodeUtils.isPasscodeIdentical("99999")).toBe(true);
    expect(pincodeUtils.isPasscodeIdentical("32145")).toBe(false);
    expect(pincodeUtils.isPasscodeIdentical("78964")).toBe(false);
    expect(pincodeUtils.isPasscodeIdentical("39992")).toBe(true);
  });

  it("recognizes a passcode with max repeat threshold met", () => {
    expect(pincodeUtils.maxRepeatThresholdMet("23466190")).toBe(false);
    expect(pincodeUtils.maxRepeatThresholdMet("33333")).toBe(true);
    expect(pincodeUtils.maxRepeatThresholdMet("1122334444")).toBe(true);
    expect(pincodeUtils.maxRepeatThresholdMet("111")).toBe(false);
  });

  it("rejects invalid pincodes", () => {
    expect(pincodeUtils.isValidPincode("12345")).toBe(false);
    expect(pincodeUtils.isValidPincode("22222")).toBe(false);
    expect(pincodeUtils.isValidPincode("57218")).toBe(true);
  });
});
