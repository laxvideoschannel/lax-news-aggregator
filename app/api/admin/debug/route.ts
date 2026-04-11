export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Returns sanitized info about whether admin env vars are set.
// Does NOT expose the actual values.
export async function GET() {
  const usernameSet = Boolean(process.env.ADMIN_USERNAME);
  const passwordSet = Boolean(process.env.ADMIN_PASSWORD);
  const passwordLength = process.env.ADMIN_PASSWORD?.length ?? 0;
  const usernameValue = process.env.ADMIN_USERNAME || '(not set — defaults to "admin")';

  return Response.json({
    ADMIN_USERNAME_set: usernameSet,
    ADMIN_USERNAME_value: usernameValue,
    ADMIN_PASSWORD_set: passwordSet,
    ADMIN_PASSWORD_length: passwordLength,
    note: passwordSet
      ? 'Env vars look good. If login still fails, check for extra spaces or quotes in the Vercel variable value.'
      : 'ADMIN_PASSWORD is empty or not set — login is blocked until this is configured in Vercel → Settings → Environment Variables.',
  });
}
