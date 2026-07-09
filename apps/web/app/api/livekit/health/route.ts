import { NextResponse } from 'next/server'
import { AccessToken } from 'livekit-server-sdk'

/**
 * Health check endpoint for LiveKit configuration
 * Tests token generation and validates credentials
 */
export async function GET() {
  try {
    const apiKey = process.env.LIVEKIT_API_KEY
    const apiSecret = process.env.LIVEKIT_API_SECRET
    const liveKitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL

    // Check if credentials are configured
    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'LiveKit credentials not configured',
          details: {
            apiKey: !!apiKey,
            apiSecret: !!apiSecret,
            liveKitUrl: !!liveKitUrl,
          },
        },
        { status: 500 }
      )
    }

    // Try to generate a test token
    try {
      const at = new AccessToken(apiKey, apiSecret, {
        identity: 'health-check-test',
        name: 'Health Check',
      })

      at.addGrant({
        room: 'health-check',
        canPublish: true,
        canPublishData: true,
        canSubscribe: true,
      })

      const token = at.toJwt()

      return NextResponse.json({
        status: 'healthy',
        message: 'LiveKit is configured and token generation works',
        details: {
          apiKeyConfigured: true,
          apiSecretConfigured: true,
          liveKitUrl: liveKitUrl,
          tokenGenerated: !!token,
          tokenLength: token.length,
          timestamp: new Date().toISOString(),
        },
      })
    } catch (tokenError: any) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'LiveKit token generation failed',
          error: tokenError.message,
          details: {
            apiKeyConfigured: !!apiKey,
            apiSecretConfigured: !!apiSecret,
            liveKitUrl: !!liveKitUrl,
          },
        },
        { status: 500 }
      )
    }
  } catch (err: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Unexpected error checking LiveKit health',
        error: err?.message,
      },
      { status: 500 }
    )
  }
}
