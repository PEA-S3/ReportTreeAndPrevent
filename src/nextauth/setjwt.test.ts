const { default: setJWT } = require("./setjwt");

import { JWT } from "next-auth/jwt";
import "@testing-library/jest-dom";
import { getDoc } from "firebase/firestore";

jest.mock("next-auth/react", () => ({
  signOut: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getFirestore: jest.fn(),
  getDoc: jest.fn(),
}));

describe("setJWT", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("token มี pea จะรีเทิร์น token เดิมออกมาก", async () => {
    (getDoc as jest.Mock).mockImplementation(() =>
      Promise.resolve({ exists: () => false })
    );
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
    const token: JWT = {
      sub: "test",
    };
    expect(await setJWT(token)).toBe(token);
  });

  it("token ไม่มี pea มี sub และมีข้อมูล pea ใน firestore จะรีเทิร์น token ที่มีข้อมูล pea", async () => {
    (getDoc as jest.Mock).mockImplementationOnce(() => {
      const testdata = { role: "admin" };
      return Promise.resolve({
        exists: () => true,
        data: () => testdata,
      });
    });
    const token: JWT = {
      sub: "test",
    };
    expect(await setJWT(token)).toEqual({ ...token, pea: { role: "admin" } });
  });
});
