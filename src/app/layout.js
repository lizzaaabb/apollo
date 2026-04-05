import Header from '../components/header'

export const metadata = {
  title: "Apollo Creations - საიტის დამზადება",
  description: "Best web development services for your business. We create stunning websites that drive results. Contact us today to get started!",
  themeColor: '#1a0f3a',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ backgroundColor: '#1a0f3a' }}>
      <body style={{ backgroundColor: '#1a0f3a' }}>
        <Header />
        <div>{children}</div>
      </body>
    </html>
  )
}