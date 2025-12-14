import { NextResponse } from "next/server";
import { getUserByEmail, createPasswordResetToken, sendPasswordResetEmail } from '@/lib/auth';

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Invalid email.' }, { status: 400 });
  }
  // Find user by email
  const user = await getUserByEmail(email);
  if (user) {
    // Create a reset token and send email (do not reveal if user exists)
    const token = await createPasswordResetToken(user.id);
    await sendPasswordResetEmail(user.email, token);
  }
  // Always return success for privacy
  return NextResponse.json({ ok: true });
}
