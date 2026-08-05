import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

import { sendMessage, getChatHistory } from "@/services/chatService";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function ChatPage() {
  const { user } = useUser();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    setMessages([]);
  }, [user]);
  const handleSend = async () => {
    if (!message.trim() || !user) return;
    try {
      const data = await sendMessage(message, user.id);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          message: data.user_message,
          response: data.ai_response,
        },
      ]);
      setMessage("");
    } catch (error) {
      console.error("Send Error:", error);
    }
  };
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-2">Chat With Notes 💬</h1>
        <p className="text-gray-600 mb-8">
          Ask questions from your uploaded notes.
        </p>
        <Card className="h-[500px] flex flex-col">
          <CardContent className="flex-1 p-6 overflow-y-auto">
            {messages.map((chat) => (
              <div key={chat.id} className="flex flex-col gap-2 mb-4">
                <div className="flex justify-end">
                  <div className="bg-slate-200 p-3 rounded-lg max-w-[70%]">
                    {chat.message}
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex justify-start">
                  <div className="bg-blue-500 text-white p-3 rounded-lg max-w-[70%]">
                    {chat.response}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
          <div className="border-t p-4 flex gap-3">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
              placeholder="Ask something about your notes..."
            />

            <Button onClick={handleSend}>Send</Button>
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
}

export default ChatPage;
