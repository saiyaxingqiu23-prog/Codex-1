import Link from 'next/link';

const links = [
  { href: '/writing', label: 'Writing' },
  { href: '/conversation', label: 'Conversation' },
  { href: '/errors', label: 'Error Tracker' },
  { href: '/challenge', label: 'Daily Challenge' },
  { href: '/dashboard', label: 'Dashboard' }
];

export function Navigation() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold text-brand">
          FluentMind
        </Link>
        <ul className="flex gap-4 text-sm font-medium text-slate-700">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:text-brand-dark">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
