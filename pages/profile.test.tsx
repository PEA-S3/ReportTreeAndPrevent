const { render, fireEvent, screen } = require("@testing-library/react");
const { default: ProfilePage } = require("./profile");

import { getSession } from "next-auth/react";
import { getServerSideProps } from "./profile";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { peaUser } from "@/types/next-auth";
import sendProfileForm from "@/src/sendprofileform";

jest.mock("next-auth/react");

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../src/sendprofileform")

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

describe("profile page Component", () => {
  it("Submit โดยใส่ช่องบางช่องผิด หรือไม่ครบ จะไม่ call handleSubmit", async () => {
    render(<ProfilePage pea={null} />);
    const sendProfileForm = jest.fn()
    

    const spinButton = screen.getAllByRole("spinbutton");
    const textBox = screen.getAllByRole("textbox");
    const submitButton = screen.getByRole('button', { name: /submit/i })
    const backButton = screen.getByRole('button',{name: /back/i})

    await userEvent.type(textBox[0], "1234");
    await userEvent.type(textBox[1], "1234");
    await userEvent.type(spinButton[0], "1234");
    await userEvent.type(spinButton[1], "test");
    await userEvent.click(submitButton)


    expect(spinButton).toHaveLength(2);
    expect(submitButton).toBeInTheDocument()
    expect(backButton).toBeInTheDocument()
    expect(textBox).toHaveLength(2);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(textBox[0]).toHaveValue("1234");
    expect(textBox[1]).toHaveValue("1234");
    expect(spinButton[0]).toHaveValue(1234);
    expect(spinButton[1]).toHaveValue(null);
    expect(sendProfileForm.mock.calls).toHaveLength(0);
  });

  it("Submit จะไม่ call handleSubmit", async () => {
    const peaUser:peaUser = {
      karnfaifa: "กบษ.(ต.3)"
    }
    render(<ProfilePage pea={peaUser} />);
    const sendProfileForm = jest.fn()

    const spinButton = screen.getAllByRole("spinbutton");
    const textBox = screen.getAllByRole("textbox");
    const submitButton = screen.getByRole('button', { name: /submit/i })
    

    await userEvent.type(textBox[0], "1234");
    await userEvent.type(textBox[1], "1234");
    await userEvent.type(spinButton[0], "1234");
    await userEvent.type(spinButton[1], "1234");
    await userEvent.click(submitButton)
    
    expect(textBox[0]).toHaveValue("1234");
    expect(textBox[1]).toHaveValue("1234");
    expect(spinButton[0]).toHaveValue(1234);
    expect(spinButton[1]).toHaveValue(1234);
    expect(sendProfileForm.mock.calls).toHaveLength(1)
  });
});
