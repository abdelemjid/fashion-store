import Link from "next/link";

const footerLinks = [
  { link: "/terms", label: "Terms" },
  { link: "/privacy-policy", label: "Privacy Policy" },
  { link: "/cookies", label: "Cookies" },
];

export default function Footer() {
  return (
    <footer>
      <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border p-10 text-sm text-muted-foreground md:flex-row">
        {/* Rights */}
        <p className="">
          &copy; {new Date().getFullYear()} Fashion. All Rights Reserved.
        </p>

        {/* Quick Links */}
        <div className="flex gap-6">
          {footerLinks.map((link) => (
            <Link href={link.link} key={link.label}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
