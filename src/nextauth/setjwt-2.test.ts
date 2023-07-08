const { default: setJWT } = require("./setjwt");

import { JWT } from "next-auth/jwt";
import "@testing-library/jest-dom";
import * as firestore from "firebase/firestore";

jest.mock("next-auth/react", () => ({
  signOut: jest.fn(),
}));

const testdata = {role: "admin"}

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getFirestore: jest.fn(),
  getDoc: jest.fn(
    () =>
    Promise.resolve({
      exists: () => true,
      data: () => testdata,
    })
  ),
}));

describe("setJWT", () => {
  it("token ไม่มี pea มี sub และมีข้อมูล pea ใน firestore จะรีเทิร์น token ที่มีข้อมูล pea", async () => {
    const token: JWT = {
      sub: "test",
    };
    expect(await setJWT(token)).toEqual({...token,pea:testdata});
  });
});
