import Header from '../components/header'

export const metadata = {
  title: "Apollo Creations - საიტის დამზადება",
  description: "Best web development services for your business. We create stunning websites that drive results. Contact us today to get started!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <div>{children}</div>
      </body>
    </html>
  );
}