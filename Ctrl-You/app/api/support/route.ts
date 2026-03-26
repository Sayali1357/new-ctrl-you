// app/api/appointments/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// ✅ POST: Create a new appointment
export async function POST(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("ctrlyou");
    const appointments = db.collection("appointments");

    const { uid, name, date, time, type, notes, counselor } = await req.json();

    if (!uid || !name || !date || !time || !type) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Convert to single Date object for consistency
    const appointmentDate = new Date(`${date}T${time}:00`);

    // ✅ Prevent double booking (per counselor if counselor field exists)
    const conflict = await appointments.findOne({
      appointmentDate,
      ...(counselor ? { counselor } : {}), // check counselor if provided
    });

    if (conflict) {
      return NextResponse.json({
        success: false,
        message: "This time slot is already booked. Please choose another.",
      });
    }

    // ✅ Add location / meeting details
    const location =
      type === "face"
        ? "Sunshine Address, College Road, Nashik"
        : "Online Video Call (Host: 8767159906)";

    const meetingUrl =
      type === "video"
        ? `https://meet.jit.si/${encodeURIComponent(name)}-${Date.now()}`
        : "";

    // ✅ Save appointment
    const newAppointment = {
      uid, // 🔑 Firebase user
      name,
      counselor: counselor || "Default Counselor",
      appointmentDate,
      type, // "video" | "face"
      notes: notes || "",
      location,
      meetingUrl,
      createdAt: new Date(),
    };

    await appointments.insertOne(newAppointment);

    return NextResponse.json({
      success: true,
      appointment: {
        name: newAppointment.name,
        counselor: newAppointment.counselor,
        appointmentDate: newAppointment.appointmentDate,
        type: newAppointment.type,
        location: newAppointment.location,
        meetingUrl: newAppointment.meetingUrl,
      },
    });
  } catch (error) {
    console.error("POST /appointments error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// ✅ GET: Fetch appointments (filter by uid, only future ones)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");

    const client = await clientPromise;
    const db = client.db("ctrlyou");
    const appointments = db.collection("appointments");

    const query: any = {
      appointmentDate: { $gte: new Date() }, // ✅ only future appointments
    };

    if (uid) query.uid = uid;

    const allAppointments = await appointments
      .find(query)
      .sort({ appointmentDate: 1 })
      .toArray();

    return NextResponse.json({
      success: true,
      appointments: allAppointments.map((appt) => ({
        id: appt._id,
        name: appt.name,
        counselor: appt.counselor,
        appointmentDate: appt.appointmentDate,
        type: appt.type,
        location: appt.location,
        meetingUrl: appt.meetingUrl,
      })),
    });
  } catch (error) {
    console.error("GET /appointments error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
