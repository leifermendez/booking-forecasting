import { createClient } from "@supabase/supabase-js";
import { Apartament } from "../types/apartament.type";
import dotenv from "dotenv";
dotenv.config();

const supabase = createClient(
  process.env.SUPA_BASE_URL,
  process.env.SUPA_BASE_SECRET
);

async function insertRow(inRow: Apartament[]): Promise<any> {
  const response = await supabase.from("Booking").insert([].concat(inRow));
  return Promise.resolve(response);
}

export { insertRow };
