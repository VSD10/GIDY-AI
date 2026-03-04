import './globals.css'

export const metadata = {
  title: 'Gidy Profile Replica',
  description: 'Full-stack technical challenge profile page replica',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
