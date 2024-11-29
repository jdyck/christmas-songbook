export default function PageDesign({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="max-w-screen-md border bg-white p-12 m-auto md:my-4">
      {children}
    </div>
  );
}
