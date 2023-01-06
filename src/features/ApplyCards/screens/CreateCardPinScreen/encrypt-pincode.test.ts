import encryptPincode from "./encrypt-pincode";

describe("encrypt-pincode", () => {
  it("encrypts pincode using rsa", () => {
    const encrypted = encryptPincode("1234");
    const expectedValue =
      "GoLGlfNEJInLL5T7ZiScRSMmXmThRNd0Oyn2Eac4vsOMpYoKVRoXMjpIgTED6qnaI1rG4uKa6TbusneVUthcTqpTedhSM5yAzBTFzksGqolRCn5O6LpxsmqoZXIYltgu3F4zuEhfY8UuQ5GU7AsL2r4pSA4u61LP1AGf4PZ8iAKOhEUn6b/7wHEVs6qW3ubEjfXuanKCgkMvYO6hKZvTyx6PFaLEXlQFzd/kQ8PevG4KVeQ6vT0+jprwK9JxRwusVyVxUaLJq907SdQ/3TNbNPVxyBs675kv+BfgiYKUFGZoSfA0I5fau2aZmnyh8ckl+Yo7VEQlvI+ZcmuVYLfr+g==";

    expect(encrypted).toBe(expectedValue);
  });
});
