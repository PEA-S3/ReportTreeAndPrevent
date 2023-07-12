const { render, screen } = require("@testing-library/react");
//const { default: SignInPage} = require("./profile")

import { getSession } from "next-auth/react";
import { getServerSideProps } from "./profile";
import "@testing-library/jest-dom";
import { peaUser } from "@/types/next-auth";

jest.mock("next-auth/react");

describe("sign in getServerSideProps", () => {
  it("ถ้ามี session และมีข้อมูล pea จะให้ props pea", async () => {
    (getSession as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        pea: {
          firstname: "test",
          lastname: "test",
        },
        sub: "test",
      })
    );
    const pea: peaUser = {
      firstname: "test",
      lastname: "test",
    };
    const result = {
      props: {
        pea,
      },
    };
    expect(await getServerSideProps(null)).toStrictEqual(result);
  });

  it("ถ้ามี session แต่ไม่มีข้อมูล pea จะให้ props pea เป็น null", async () => {
    (getSession as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        sub: "test",
      })
    );
    const result = {
      props: {
        pea: null,
      },
    };
    expect(await getServerSideProps(null)).toStrictEqual(result);
  });

  it("ถ้าไม่มี Session จะบังคับไปหน้า signout", async () => {
    (getSession as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve(null)
    );
    const result = {
      redirect: {
        destination: "/signout",
      },
    };
    expect(await getServerSideProps(null)).toStrictEqual(result);
  });
});

// describe("sign in Component",()=>{
//     it("ต้องเห็นปุ่ม Sing In with google และ Sign in with line",()=>{
//          render(<SignInPage/>);
//          expect(screen.getByTestId("google")).toBeInTheDocument()
//          expect(screen.getByTestId("line")).toBeInTheDocument()
//     })
// })
