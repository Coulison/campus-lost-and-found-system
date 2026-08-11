import './globals.css'

export const metadata = {
  title: '__PROJECT_NAME__',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
