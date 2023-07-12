const { render, screen } = require("@testing-library/react");
const { default: SignInPage } = require("./signin");

import { getSession } from "next-auth/react";
import { getServerSideProps } from "./signin";
import "@testing-library/jest-dom";

jest.mock("next-auth/react");

describe("sign in getServerSideProps", () => {
  it("ถ้ามี session จะให้ไปหน้าอื่น", async () => {
    (getSession as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve("any session")
    );
    const result = {
      redirect: {
        destination: "/",
      },
    };
    expect(await getServerSideProps(null)).toStrictEqual(result);
  });

  it("ถ้าไม่มี Session ต้อง signin ซึ่งจะรีเทิร์น props เปล่าๆ", async () => {
    (getSession as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve(null)
    );
    const result = {
      props: {},
    };
    expect(await getServerSideProps(null)).toStrictEqual(result);
  });
});

describe("sign in Component", () => {
  it("ต้องเห็นปุ่ม Sing In with google และ Sign in with line", () => {
    render(<SignInPage />);
    expect(screen.getByTestId("google")).toBeInTheDocument();
    expect(screen.getByTestId("line")).toBeInTheDocument();
  });
});
