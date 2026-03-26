"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { vapi } from "@/lib/vapi";
import { counselorPrompt } from "@/lib/prompts";
import { cn } from "@/lib/utils";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface CounselingSessionPageProps {
  sessionId: string;
  userId: string;
  userName: string;
  durationLimit: number;
  onComplete: (transcript: any[], duration: number) => Promise<void>;
}

export default function CounselingSessionPage({
  sessionId,
  userId,
  userName = "Guest",
  durationLimit = 30,
}: CounselingSessionPageProps) {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState("");
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [timer, setTimer] = useState(0); // minutes elapsed

  // --- AI Event Handling ---
  useEffect(() => {
    const onCallStart = () => {
      console.log("Counseling session started for:", userName);
      setSessionStartTime(Date.now());
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      console.log("Counseling session ended");
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: any) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);

        if (
          message.transcript.toLowerCase().includes("i don't want to continue") ||
          message.transcript.toLowerCase().includes("stop session") ||
          message.transcript.toLowerCase().includes("end call")
        ) {
          handleDisconnect();
        }
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (err: Error) => console.error("Error:", err);

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, [userName]);

  // --- Timer & Auto End ---
  useEffect(() => {
    if (callStatus === CallStatus.ACTIVE && sessionStartTime) {
      const timerInterval = setInterval(() => {
        const elapsedMinutes = Math.floor((Date.now() - sessionStartTime) / 60000);
        setTimer(elapsedMinutes);

        if (elapsedMinutes >= durationLimit) {
          console.log(`${durationLimit}-minute limit reached, ending session`);
          handleDisconnect();
        }
      }, 60000);

      return () => clearInterval(timerInterval);
    }
  }, [callStatus, sessionStartTime, durationLimit]);

  // --- Start Session ---
  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);
    await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
      variableValues: {
        prompt: counselorPrompt,
        sessionId,
        userId,
        userName,
      },
    });
  };

  // --- End Session ---
  const handleDisconnect = () => {
    vapi.stop();
    setCallStatus(CallStatus.FINISHED);

    // save summary data to backend
    fetch(`/api/counseling/${sessionId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        userName,
        messages,
        duration: timer,
        endedAt: new Date().toISOString(),
      }),
    }).finally(() => {
      router.push(`/counseling/feedback/${sessionId}`);
    });
  };

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }
  }, [messages]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-purple-50 to-white p-6 text-center">
      <h1 className="text-3xl font-semibold text-purple-600 mb-4">
        AI Counseling Session 💬
      </h1>
      <p className="text-gray-500 mb-6">
        {userName}, take a deep breath — your session ID:{" "}
        <span className="font-mono text-purple-600">{sessionId}</span>
      </p>

      <Image
        src="/ai-avatar.png"
        alt="Counselor"
        width={120}
        height={120}
        className={cn(
          "rounded-full border-4 border-purple-300 shadow-md",
          isSpeaking && "animate-pulse"
        )}
      />

      <p className="text-gray-600 max-w-md mt-6">
        {callStatus === CallStatus.INACTIVE &&
          "Ready to begin your session? You’ll have around 30 minutes or until you say 'I don’t want to continue talking'."}
        {callStatus === CallStatus.CONNECTING && "Connecting to your counselor..."}
        {callStatus === CallStatus.ACTIVE &&
          "Your counselor is here. Start whenever you feel ready."}
        {callStatus === CallStatus.FINISHED &&
          "Session completed. Redirecting to your feedback summary..."}
      </p>

      {callStatus === CallStatus.ACTIVE && (
        <p className="text-sm text-purple-600 mt-3">
          ⏱ {timer} / {durationLimit} mins elapsed
        </p>
      )}

      {messages.length > 0 && (
        <div className="mt-6 max-w-lg bg-white p-4 rounded-xl shadow-md border border-purple-100">
          <p key={lastMessage} className="text-gray-800 text-lg animate-fadeIn">
            {lastMessage}
          </p>
        </div>
      )}

      <div className="mt-8">
        {callStatus !== CallStatus.ACTIVE ? (
          <button
            className="bg-purple-600 text-white px-6 py-3 rounded-full text-lg shadow-lg hover:bg-purple-700 transition"
            onClick={handleCall}
            disabled={callStatus === CallStatus.CONNECTING}
          >
            {callStatus === CallStatus.CONNECTING ? "Connecting..." : "Start Session"}
          </button>
        ) : (
          <button
            className="bg-red-500 text-white px-6 py-3 rounded-full text-lg shadow-lg hover:bg-red-600 transition"
            onClick={handleDisconnect}
          >
            End Session
          </button>
        )}
      </div>
    </div>
  );
}
