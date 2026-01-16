import Link from "next/link";

interface HelperLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function HelperLink({
  href,
  children,
  className = "",
}: HelperLinkProps) {
  return (
    <Link
      href={href}
      className={`
        text-sm text-blue-600 hover:text-blue-700 hover:underline
        transition-colors duration-200
        ${className}
      `}
    >
      {children}
    </Link>
  );
}
