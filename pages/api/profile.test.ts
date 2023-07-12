const { default: handler } = require("./profile");
import { createMocks } from "node-mocks-http"; //npm install --save-dev node-mocks-http

const mockValueGetServerSession = null;

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(() => Promise.resolve(mockValueGetServerSession)),
}));

describe("profile handler", () => {
  it("เมื่อ req เป็น method อื่นที่ไม่ใช่ post res จะส่ง status 400 ออกไป", async () => {
    const { req, res } = createMocks({
      method: "GET",
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
  });

  it("เมื่อไม่มี session res จะส่ง status 401 ออกไป ", async () => {
    const { req, res } = createMocks({
      method: "POST",
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(401);
  });
});
