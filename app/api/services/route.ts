import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('services')
      .select('*')

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in services API:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { host_address, port, email_id, password, cors_origin } = body

    const { data, error } = await supabase
      .from('services')
      .insert([
        {
          user_id: session.user.id,
          host_address,
          port,
          email_id,
          password,
          cors_origin
        }
      ])
      .select()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in services API:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Service ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('service_id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in services API:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

