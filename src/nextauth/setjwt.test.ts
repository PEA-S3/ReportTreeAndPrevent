const { default: setJWT } = require("./setjwt");

import { JWT } from "next-auth/jwt";
import "@testing-library/jest-dom";

jest.mock("next-auth/react", () => ({
  signOut: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getFirestore: jest.fn(),
  getDoc: jest.fn(() => Promise.resolve({ exists: () => false })),
}));

describe("setJWT", () => {
  it("token มี pea จะรีเทิร์น token เดิมออกมาก", async () => {
    const token: JWT = {
      pea: {
        firstname: "test",
      },
      sub: "test",
    };

    expect(await setJWT(token)).toBe(token);
  });

  it("token ไม่มี pea ไม่มี sub จะรีเทิร์น token เดิมออกมา", async () => {
    const token: JWT = {
      email: "fdasfdas",
    };

    expect(await setJWT(token)).toBe(token);
  });

  it("token ไม่มี pea มี sub แต่ไปหาข้อมูลใน firestore ไม่เจอ จะรีเทิร์น token เดิมออกมา", async () => {
    //getDoc.mockImplementation
    const token: JWT = {
      sub: "test",
    };
    expect(await setJWT(token)).toBe(token);
  });
});
