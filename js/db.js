import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.57.4/+esm";

const supabaseUrl = "https://oucydoxmpgsgoqytcvtb.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91Y3lkb3htcGdzZ29xeXRjdnRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3NDU1OTQsImV4cCI6MjA3NDMyMTU5NH0.e5iAii2E-uIxKWE-He1O5aGfaZu_k1hzw_SuI8iFGaA";

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function fetchProducts(table) {
  let { data, error } = await supabase.from(table).select("*");
  if (error) {
    console.error("Fetch error:", error);
    return;
  }
//   console.log("data",  data);
  
  return data;
}

export async function addProduct(
  title,
  long_des,
  short_des,
  price,
  brand,
  category,
  images_urls
) {
  let { data, error } = await supabase
    .from("products")
    .insert([
      { title, long_des, short_des, price, brand, category, images_urls },
    ]);

  if (error) {
    console.error("Insert error:", error);
    return false;
  }
  console.log(data);
  return true;
}

export async function updateProduct(table, id, updatedData) {
  const updateData = {};

  for (const key in updatedData) {
    if (updatedData[key] !== undefined) {
      updateData[key] = updatedData[key];
    }
  }

  const { data, error } = await supabase
    .from(table)
    .update(updateData)
    .eq("id", id);

  if (error) {
    console.error("Update failed:", error);
    return { error };
  }

  return { data };
}

export async function deleteProduct(table, id) {
  let { error } = await supabase.from(table).delete().eq("id", id);

  if (error) console.error("Delete error:", error);
  return { error };
}