const { default: handler } = require("./profile");
import { getServerSession } from "next-auth";
import { createMocks } from "node-mocks-http"; //npm install --save-dev node-mocks-http

const mockValueGetServerSession = {
  sub: test,
};

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(() => Promise.resolve(mockValueGetServerSession)),
}));

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getFirestore: jest.fn(),
  setDoc: jest.fn(),
}));

describe("profile handler", () => {
  it("เมื่อ req เป็น post และได้ signin (มี sub) res จะส่ง status 200 ออกไป", async () => {
    const { req, res } = createMocks({
      method: "POST",
    });

    const parse = {
      role: "operator",
    };

    JSON.parse = jest.fn().mockImplementationOnce(() => parse);

    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
  });
});
