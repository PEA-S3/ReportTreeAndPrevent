import { peaUser } from "@/types/next-auth";
import { signOut } from "next-auth/react";

const { default: sendProfileForm } = require("./sendprofileform");

jest.mock("next-auth/react", () => ({
  signOut: jest.fn(),
}));

let windowSpy: any;
global.fetch = jest.fn()


beforeEach(() => {
  windowSpy = jest.spyOn(window, "window", "get");
  (global.fetch as jest.Mock).mockClear()
});

afterEach(() => {
  windowSpy.mockRestore();
});

describe("Send Profile Form", () => {
  it("เมื่อ User กดยกเลิกการยืนยันจะส่งออกเป็น null", async () => {
    windowSpy.mockImplementation(() => ({
      confirm: () => false,
    }));
    const pea: peaUser = {
      firstname: "test",
      lastname: "test",
      mobileno: "test",
    };
    expect(await sendProfileForm(pea)).toBeNull();
  });
  it("เมื่อ user ส่งมาไม่มีสังกัดการไฟฟ้า ส่งออกเป็น null", async () => {
    windowSpy.mockImplementation(() => ({
      confirm: () => true,
      alert: jest.fn(),
    }));
    const pea: peaUser = {
      firstname: "test",
      lastname: "test",
      mobileno: "test",
    };
    expect(await sendProfileForm(pea)).toBeNull();
  });
  it("เมื่อ server ส่ง status อื่นที่ไม่ใช่ 200 และ 401", async () => {
    windowSpy.mockImplementation(() => ({
      confirm: () => true,
      alert: jest.fn(),
    }));

    (global.fetch as jest.Mock).mockResolvedValue({status:333})

    const pea: peaUser = {
      firstname: "test",
      lastname: "test",
      mobileno: "test",
      karnfaifa: "test",
    };
    expect(await sendProfileForm(pea)).toBeNull();
  });

  it("เมื่อ server ส่ง status 401 จะรีเทิร์น /signin", async () => {
    windowSpy.mockImplementation(() => ({
      confirm: () => true,
      alert: jest.fn(),
    }));

    (global.fetch as jest.Mock).mockResolvedValue({status:401})

    const pea: peaUser = {
      firstname: "test",
      lastname: "test",
      mobileno: "test",
      karnfaifa: "test",
    };
    expect(await sendProfileForm(pea)).toEqual("/signin");
  });

  it("เมื่อ server ส่ง status 200 จะรีเทิร์น / เพื่อไปหน้าหลัก", async () => {
    windowSpy.mockImplementation(() => ({
      confirm: () => true,
      alert: jest.fn(),
    }));

    (global.fetch as jest.Mock).mockResolvedValue({status:200})

    const pea: peaUser = {
      firstname: "test",
      lastname: "test",
      mobileno: "test",
      karnfaifa: "test",
    };
    expect(await sendProfileForm(pea)).toEqual("/");
  });
});
