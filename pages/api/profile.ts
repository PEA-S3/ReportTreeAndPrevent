// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { doc, setDoc } from "firebase/firestore";
import db from "@/firebase";
import { peaUser } from "@/types/next-auth";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const session = await getServerSession(req, res, authOptions);
  if (req.method != "POST") {
    res.status(400).end();
  }

  if (session && session.sub) {
    let pea:peaUser = JSON.parse(req.body)
    if(!pea.role){
        pea = {...pea,role:"operator"}
    } 
    const docRef = doc(
      db,
      process.env.NEXT_PUBLIC_USER_DB_COLLECTION as string,
      session.sub
    );
    await setDoc(docRef, pea);
    res.status(200).end();
  }

  res.status(401).end();
}
