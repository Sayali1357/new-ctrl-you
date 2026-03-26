"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "@/firebase/firebase"; // ✅ ensure this exists and exports your Firebase app

interface ParentControlForm {
  parentName: string;
  parentEmail: string;
  parentMobile: string;
  childConsent: boolean;
}

export default function ParentControlPage() {
  const [form, setForm] = useState<ParentControlForm>({
    parentName: "",
    parentEmail: "",
    parentMobile: "",
    childConsent: false,
  });

  const [uid, setUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // ✅ Get current Firebase user's UID
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        setUid(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (field: keyof ParentControlForm, value: string | boolean) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    if (!form.childConsent) {
      setError("You must declare that the details are true to proceed.");
      return;
    }

    if (!uid) {
      setError("You must be signed in to submit this form.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/send-consent-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, uid }), // ✅ Add UID here
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.message || "Failed to send email");
      }
    } catch (err: any) {
      setError("Error sending email: " + (err.message || err));
    }

    setLoading(false);
  };

  if (success) {
    // ✅ Redirect to sign-in after 3 seconds
    setTimeout(() => router.push("/sign-in"), 3000);
 
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 text-pink-300 p-6">
        <h1 className="text-5xl font-extrabold mb-4 text-pink-400 animate-pulse">✅ Email Sent!</h1>
        <p className="text-pink-200 text-center max-w-lg">
          The parent ({form.parentEmail}) has been notified.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 p-6 text-pink-300">
      <h1 className="text-4xl font-bold mb-6 text-pink-400 animate-pulse">👨‍👩‍👧 Parent Form</h1>

      <div className="w-full max-w-lg p-6 rounded-3xl bg-gray-800 shadow-xl border border-gray-700 space-y-4">
        <input
          placeholder="Parent Name"
          value={form.parentName}
          onChange={(e) => handleChange("parentName", e.target.value)}
          className="w-full p-3 rounded-xl bg-gray-700 text-pink-200 placeholder-pink-500 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
        />
        <input
          placeholder="Parent Email"
          type="email"
          value={form.parentEmail}
          onChange={(e) => handleChange("parentEmail", e.target.value)}
          className="w-full p-3 rounded-xl bg-gray-700 text-pink-200 placeholder-pink-500 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
        />
        <input
          placeholder="Parent Mobile"
          value={form.parentMobile}
          onChange={(e) => handleChange("parentMobile", e.target.value)}
          className="w-full p-3 rounded-xl bg-gray-700 text-pink-200 placeholder-pink-500 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
        />

        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            checked={form.childConsent}
            onChange={(e) => handleChange("childConsent", e.target.checked)}
            className="mr-2 w-5 h-5 accent-pink-500"
          />
          <label className="text-pink-200 font-medium">
            I declare that the above details are true
          </label>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-4 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl shadow-lg transition transform hover:scale-105 flex justify-center items-center"
        >
          {loading && (
            <span className="animate-spin mr-2 border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
          )}
          {loading ? "Sending Email..." : "Submit Consent ✅"}
        </button>
      </div>
    </div>
  );
}
