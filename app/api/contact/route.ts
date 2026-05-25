import { NextRequest, NextResponse } from 'next/server'

// TODO: Replace this stub with a real email sending implementation.
// Options: Resend (recommended), Nodemailer + SMTP, or a form service like Formspree.
// The form data is validated here and the email handler should forward to info@nomadagro.uz.

interface ContactPayload {
  name: string
  company?: string
  email: string
  country?: string
  product?: string
  message?: string
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ContactPayload

    if (!body.name || !body.email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    // TODO: Send email here. Example with Resend:
    // import { Resend } from 'resend'
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({
    //   from: 'noreply@nomadagro.uz',
    //   to: 'info@nomadagro.uz',
    //   subject: `New inquiry from ${body.name} — ${body.company ?? body.country ?? ''}`,
    //   text: `Name: ${body.name}\nCompany: ${body.company}\nEmail: ${body.email}\nCountry: ${body.country}\nProduct: ${body.product}\nMessage: ${body.message}`,
    // })

    console.log('[Contact form] New inquiry:', {
      name: body.name,
      company: body.company,
      email: body.email,
      country: body.country,
      product: body.product,
      messageLength: body.message?.length ?? 0,
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('[Contact form] Error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
