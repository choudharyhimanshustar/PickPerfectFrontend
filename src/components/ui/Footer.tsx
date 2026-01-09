import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto w-full px-6 py-16 pb-0">
        {/* Top Section */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-semibold text-white">
              PickPerfect
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              AI-powered performance feedback for musicians who want to
              practice smarter — not longer.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">
              Product
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-white/60">
              <li>
                <Link href="#" className="hover:text-white transition">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Upload Video
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">
              Resources
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-white/60">
              <li>
                <Link href="#" className="hover:text-white transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Practice Guides
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">
              Get Started
            </h4>
            <p className="mt-4 text-sm text-white/60">
              Upload your performance and get instant,
              actionable feedback.
            </p>
            <Link
              href="#"
              className="mt-6 inline-flex items-center justify-center rounded-xl
                         bg-emerald-500 px-5 py-2.5 text-sm font-medium
                         text-black transition hover:bg-emerald-400"
            >
              Upload Performance
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 h-px bg-white/10" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} PickPerfect. All rights reserved.
          </p>

          <div className="flex gap-6 text-sm text-white/60">
            <Link href="#" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white transition">
              Terms
            </Link>
            <Link href="#" className="hover:text-white transition">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
