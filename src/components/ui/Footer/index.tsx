"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Jangan tampilkan footer di admin pages
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">My Grocery</h3>
            <p className="text-gray-300 text-sm">
              Your trusted online grocery store for fresh and quality products
              delivered to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <Link href="#" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Products
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <Link href="#" className="hover:text-white transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <p className="text-gray-300 text-sm mb-2">
              Email: info@My Grocery.com
            </p>
            <p className="text-gray-300 text-sm mb-4">
              Phone: +62 812-3456-7890
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-amber-400 hover:text-amber-300">
                f
              </a>
              <a href="#" className="text-amber-400 hover:text-amber-300">
                𝕏
              </a>
              <a href="#" className="text-amber-400 hover:text-amber-300">
                in
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <p className="text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} My Grocery. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
