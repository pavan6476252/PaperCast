export default function PrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="print-only bg-white m-0 p-0 overflow-visible w-full h-full">
        {children}
      </body>
    </html>
  );
}
