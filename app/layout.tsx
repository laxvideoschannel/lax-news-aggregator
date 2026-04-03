export const metadata = {
  title: 'Lacrosse News Hub',
  description: 'Automated Lacrosse News Aggregator',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
