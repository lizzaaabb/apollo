import Header from '../components/header'

export const metadata = {
  title: "Apollo Creations - საიტის დამზადება",
  description: "Best web development services for your business. We create stunning websites that drive results. Contact us today to get started!",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ backgroundColor: '#1a0f3a' }}>
      <head>
        <meta name="theme-color" content="#1a0f3a" />
        <style dangerouslySetInnerHTML={{ __html: `
          html, body { background: #1a0f3a !important; margin: 0; padding: 0; }
        `}} />
      </head>
      <body style={{ backgroundColor: '#1a0f3a', margin: 0 }}>
        <Header />
        <div>{children}</div>
      </body>
    </html>
  )
}