import Link from 'next/link';
import { UserCheck } from 'lucide-react';

const footerLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/#services', label: 'Services' },
  { href: '/#products', label: 'Products' },
  { href: '/blog', label: 'Blog' },
  { href: '/#contact', label: 'Contact' },
];

const legalLinks = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms-and-conditions', label: 'Terms & Conditions' },
  { href: '/refund-policy', label: 'Refund Policy' },
];

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-semibold mb-4">
              <UserCheck className="h-8 w-8 text-primary" />
              <span className="text-xl font-headline">JRKE Contracting</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your trusted partner in electrical and civil engineering projects.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Admin Login */}
          <div>
            <h3 className="font-semibold mb-4">Admin Area</h3>
            <ul className="space-y-2">
                <li>
                    <Link href="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        Portal Login
                    </Link>
                </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} JRKE Labour Management Utility. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
