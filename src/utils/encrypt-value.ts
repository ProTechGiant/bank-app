import JSEncrypt from "jsencrypt";

// TODO: this key will probably by environment-dependent
const rsaPublicKeyBase64 =
  "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmXtDKoQe0q7IjUxAS7AfRJjdz8EdGvoA0l0cJIDs3mEoqChLu9Kqh7exNqjpcV5VWP4EvLoqDCbYIOgCLUCmNisE23eiConUIL/Q2C+vE45KJONCxn32GLxWPY3lZuSETz5wVJcxHVX58Ou/N+9vQXabPj5q6NhXJbdo5lWyJ2RD3JUoxmqK8rSzDED18xWxP0GJRqPcjwsIZpv5isbLfG6aLuI3sHjHHewp6X3xXiBm3BQCHbseqipfVWY9NUqV3k7nVOTvzryC0opKsV+IbC2emzE8P7ZvKrQLLIlLZNPE0T0eLBuUO1Glv8LGuaWsy5q0LhlrvAzw3Pzj8YX5FQIDAQAB";

export default function encryptValue(input: string) {
  const encrypter = new JSEncrypt();
  encrypter.setPublicKey(rsaPublicKeyBase64);

  const encryptedValue = encrypter.encrypt(input);
  if (!encryptedValue) throw new Error("Could not encrypt PIN-code");

  return encryptedValue;
}
