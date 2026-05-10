import { ImageResponse } from 'next/og'
import fs from 'fs/promises'
import path from 'path'

// Route segment config
export const runtime = 'nodejs'

// Image metadata (Apple Touch Icon standard size)
export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

// Image generation
export default async function Icon() {
  // Read the logo from the filesystem
  const logoPath = path.join(process.cwd(), 'public/images/logo-s.png')
  const logoBuffer = await fs.readFile(logoPath)
  const logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`

  return new ImageResponse(
    (
      // ImageResponse layout
      <div
        style={{
          background: 'white', // Standard for Apple icons
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          borderRadius: '20%', // App icon style
        }}
      >
        <img
          src={logoBase64}
          style={{
            width: '350%', 
            height: '350%',
            objectFit: 'contain',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
