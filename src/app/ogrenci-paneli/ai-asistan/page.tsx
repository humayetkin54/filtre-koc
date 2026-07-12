import { createClient, createAdminClient } from "@/lib/supabase/server";
import { ChatUI } from "./chat-ui";
import { DAILY_LIMIT, getDailyUsage } from "./actions";

export const maxDuration = 60;

export default async function AiAsistanPage({
  searchParams,
}: {
  searchParams: Promise<{ chat?: string }>;
}) {
  const { chat: activeChatId } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const admin = createAdminClient();

  const [{ data: chats }, used] = await Promise.all([
    admin
      .from("ai_chats")
      .select("id, title, created_at")
      .eq("student_id", user!.id)
      .order("created_at", { ascending: false }),
    getDailyUsage(user!.id),
  ]);

  // Aktif sohbetin mesajları
  const selectedId = activeChatId ?? chats?.[0]?.id ?? null;
  let messages: { id: string; role: string; content: string; has_image: boolean }[] = [];
  if (selectedId) {
    const { data } = await admin
      .from("ai_messages")
      .select("id, role, content, has_image")
      .eq("chat_id", selectedId)
      .eq("student_id", user!.id)
      .order("created_at", { ascending: true });
    messages = data ?? [];
  }

  return (
    <ChatUI
      chats={chats ?? []}
      activeChatId={selectedId}
      initialMessages={messages}
      remaining={Math.max(0, DAILY_LIMIT - used)}
      dailyLimit={DAILY_LIMIT}
    />
  );
}
