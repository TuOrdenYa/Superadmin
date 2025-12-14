import { NextResponse } from "next/server";
import { verifyPasswordResetToken, updateUserPassword, invalidatePasswordResetToken, passwordMeetsPolicy } from '@/lib/auth';

export async function POST(req: Request) {
  const { token, password } = await req.json();
  if (!token || typeof token !== 'string' || !password || typeof password !== 'string') {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  if (!passwordMeetsPolicy(password)) {
    return NextResponse.json({ error: 'Password does not meet policy.' }, { status: 400 });
  }
  const userId = await verifyPasswordResetToken(token);
  if (!userId) {
    return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 400 });
  }
  await updateUserPassword(userId, password);
  await invalidatePasswordResetToken(token);
  return NextResponse.json({ ok: true });
}
