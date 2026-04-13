import Header from '../components/header'
import './globals.css' // or wherever your global CSS is

export const metadata = {
  title: "Apollo Creations - საიტის დამზადება",
  description: "Best web development services for your business. We create stunning websites that drive results. Contact us today to get started!",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ backgroundColor: '#000005' }}>
      <body style={{ backgroundColor: '#000005', margin: 0, padding: 0 }}>
        <Header />
        <div>{children}</div>
      </body>
    </html>
  )
}