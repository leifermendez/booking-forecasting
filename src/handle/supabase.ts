import { createClient } from "@supabase/supabase-js";
import { Apartament } from "../types/apartament.type";

const supabase = createClient(
  'https://rruxjqxxyobtjejmpelc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJydXhqcXh4eW9idGplam1wZWxjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY0NTE5NjY2MSwiZXhwIjoxOTYwNzcyNjYxfQ.-UycUr0xvguJFopqYhfD-gNmJlSmoXG6uX4uX-q6hzc'
);

async function insertRow(inRow: Apartament[]): Promise<any> {
  const response = await supabase.from("Booking").insert([].concat(inRow));
  return Promise.resolve(response);
}

export { insertRow };
