const { default: handler } = require("./profile");
import { createMocks } from "node-mocks-http"; //npm install --save-dev node-mocks-http
import { getServerSession } from "next-auth";

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getFirestore: jest.fn(),
  setDoc: jest.fn(),
}));

describe("profile handler", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("เมื่อ req เป็น method อื่นที่ไม่ใช่ post res จะส่ง status 400 ออกไป", async () => {
    (getServerSession as jest.Mock).mockImplementation(() =>
      Promise.resolve(null)
    );
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

  it("เมื่อ req เป็น post และได้ signin (มี sub) res จะส่ง status 200 ออกไป", async () => {
    (getServerSession as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ sub: "test" })
    );
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
