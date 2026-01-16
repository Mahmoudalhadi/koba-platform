export default function AuthCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
      {children}
    </div>
  );
}
