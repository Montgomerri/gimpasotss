import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  const { data, error } = await supabase
    .from("questions")
    .select("id, title, description, created_at, user_id, users!inner(name)");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const questions = data?.map((q: any) => ({
    id: q.id,
    title: q.title,
    description: q.description,
    created_at: q.created_at,
    user_name: q.users?.name ?? "Unknown",
  }));

  return NextResponse.json({ questions: questions ?? [] });
}