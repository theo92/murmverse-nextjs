export const metadata = { title: "Murmverse" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: 'black', color: 'white' }}>{children}</body>
    </html>
  );
}