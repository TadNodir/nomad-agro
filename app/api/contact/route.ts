import { NextRequest, NextResponse } from 'next/server'

interface ContactPayload {
  name: string
  company?: string
  email: string
  country?: string
  product?: string
  message?: string
  /** Honeypot field — only a bot fills this in. Rejected silently below. */
  website?: string
}

// Simple in-memory rate limiter: good enough for a single-instance deployment.
// On multi-instance serverless hosting (e.g. Vercel) each instance keeps its
// own counts, so this is a best-effort throttle, not a hard guarantee — swap
// for a shared store (Upstash Redis, etc.) if abuse becomes a real problem.
const WINDOW_MS = 10 * 60 * 1000
const MAX_REQUESTS_PER_WINDOW = 5
const hits = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = hits.get(ip)
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  entry.count++
  return entry.count > MAX_REQUESTS_PER_WINDOW
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown'

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = (await req.json()) as ContactPayload

    // Honeypot: real visitors never see or fill this field. Pretend success
    // so bots don't learn to look for a different signal.
    if (body.website) {
      return NextResponse.json({ success: true }, { status: 200 })
    }

    if (!body.name || !body.email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    const accessKey = process.env.WEB3FORMS_ACCESS_KEY
    if (!accessKey) {
      console.error('[Contact form] WEB3FORMS_ACCESS_KEY is not set — cannot send email.')
      return NextResponse.json({ error: 'Email service is not configured.' }, { status: 500 })
    }

    const safeName = body.name.replace(/[\r\n]+/g, ' ').trim()
    const safeCompany = body.company?.replace(/[\r\n]+/g, ' ').trim()

    const web3formsRes = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `New inquiry from ${safeName}${safeCompany ? ` — ${safeCompany}` : ''}`,
        replyto: body.email,
        name: safeName,
        email: body.email,
        company: safeCompany,
        country: body.country,
        product: body.product,
        message: body.message,
      }),
    })
    const web3formsData = (await web3formsRes.json()) as { success: boolean; message?: string }

    if (!web3formsRes.ok || !web3formsData.success) {
      console.error('[Contact form] Web3Forms error:', web3formsData.message)
      return NextResponse.json({ error: 'Failed to send email.' }, { status: 502 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('[Contact form] Error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
