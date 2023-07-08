import optionsKarnfaifa from "@/src/karnfaifa";
import { peaUser } from "@/types/next-auth";
import { getSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (!session || !session.sub) {
    return {
      redirect: {
        destination: "/signout",
      },
    };
  }

  if(session.pea){
    return {
      props: {
        pea: session.pea,
      },
    };
  }

  return{
    props: {
      pea: null
    }
  }  
}

export default function ProfilePage({ pea }: { pea: peaUser | null }) {
  const router = useRouter();
  const [peaUser, setPeaUser] = useState<peaUser>();
  if(pea){
    setPeaUser(pea)
  }

  const profileTextForm = [
    {
      placeholder: "ชื่อ",
      type: "text",
      handleChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setPeaUser({ ...peaUser, firstname: e.target.value });
      },
      value: peaUser?.firstname,
    },
    {
      placeholder: "สกุล",
      type: "text",
      handleChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setPeaUser({ ...peaUser, lastname: e.target.value });
      },
      value: peaUser?.lastname,
    },
    {
      placeholder: "รหัสพนักงาน",
      type: "number",
      handleChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setPeaUser({ ...peaUser, userid: e.target.value });
      },
      value: peaUser?.userid,
    },
    {
      placeholder: "หมายเลขโทรศัพท์",
      type: "number",
      handleChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setPeaUser({ ...peaUser, mobileno: e.target.value });
      },
      value: peaUser?.mobileno,
    },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!window.confirm("ข้อมูลผู้ใช้ถูกต้อง?")) {
      return;
    }

    if (!peaUser?.karnfaifa || peaUser.karnfaifa == "") {
      window.alert("กรุณาเลือกสังกัด");
      return;
    }

    const res = await fetch("api/profile", {
      method: "POST",
      body: JSON.stringify(peaUser),
    });

    if (res.status != 200 && res.status != 401) {
      window.alert("บางอย่างผิดพลาด ติดต่อ 099-0210912");
      return;
    }

    //ถ้าส่งไปแล้วไม่มี session จะให้ logout ออก และ ไปหน้า login
    if (res.status == 401) {
      signOut({redirect:false});
      router.push("/signin");
    }

    router.push("/");
  };

  return (
    <div className=" mx-auto mt-24 flex flex-col w-96 shadow-xl rounded-xl">
      <h3 className=" mx-4 mt-8 text-right text-2xl">แก้ไขข้อมูลผู้ใช้งาน</h3>
      <form className="mx-4 my-8 flex flex-col" onSubmit={handleSubmit}>
        <span className="ml-5 mt-2 -mb-2 z-10 bg-white max-w-max text-xs text-gray-500">
          สังกัด
        </span>
        <select
          onChange={(e) => {
            setPeaUser({ ...peaUser, karnfaifa: e.target.value });
          }}
          required
          className="px-3 py-1 border border-slate-300 rounded-full focus:outline-slate-400  "
        >
          {peaUser?.karnfaifa ? (
            <option className="text-xs text-white" value={peaUser.karnfaifa}>
              {peaUser.karnfaifa}
            </option>
          ) : (
            <option></option>
          )}
          {optionsKarnfaifa.map((item, index) => {
            return (
              <option key={index} value={item} className="text-xs">
                {item}
              </option>
            );
          })}
        </select>
        {profileTextForm.map((item, index) => {
          return (
            <>
              <label
                key={index}
                className="ml-5 mt-2 -mb-2 z-10 bg-white max-w-max text-xs text-gray-500"
              >
                {item.placeholder}
              </label>
              <input
                required
                value={item.value}
                onChange={(e) => item.handleChange(e)}
                type={item.type}
                width={"auto"}
                className="px-3 py-1 border border-slate-300 rounded-full focus:outline-slate-400  "
              />
            </>
          );
        })}
        <div className=" ml-auto my-4 flex flex-row gap-4">
          <button
            onClick={() => {
              if (window.confirm("คุณต้องการจะออกจากหน้านี้?")) {
                router.push("/");
              }
            }}
            type="button"
            className="px-4 py-1 rounded-full border border-slate-300 hover:bg-slate-100 hover:shadow-lg"
          >
            กลับสู่หน้าหนัก
          </button>
          <button
            type="submit"
            className="px-4 py-1 rounded-full border border-slate-300 hover:bg-slate-100 hover:shadow-lg"
          >
            ยืนยัน
          </button>
        </div>
      </form>
    </div>
  );
}
