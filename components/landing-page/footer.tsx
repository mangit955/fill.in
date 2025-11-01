"use client";

import Link from "next/link";
import { Facebook, Twitter, Github, Instagram, Linkedin } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-neutral-800 border-[0.5px] mt-10 items-center flex ">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-40">
        {/* Left Section */}
        <div className="space-y-4 max-w-sm">
          <Link href="/" className="flex items-center gap-2 ">
            <Image
              src="/logo.svg" // or /logo.png — put your file inside the public/ folder
              alt="Fill.in logo"
              width={150} // adjust as needed
              height={150}
              className="rounded-sm" // optional: or remove
            />
          </Link>
          <p className="text-md font-semibold text-gray-900">
            Made and hosted by Manas 🇮🇳
          </p>
          <div className=" text-md text-gray-600 ">
            © {new Date().getFullYear()} fill.in
          </div>
          <div className="flex gap-4">
            <Link href="https://twitter.com" target="_blank">
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground transition" />
            </Link>
            <Link href="https://facebook.com" target="_blank">
              <Facebook className="h-5 w-5 text-muted-foreground hover:text-foreground transition" />
            </Link>
            <Link href="https://github.com" target="_blank">
              <Github className="h-5 w-5 text-muted-foreground hover:text-foreground transition" />
            </Link>
            <Link href="https://instagram.com" target="_blank">
              <Instagram className="h-5 w-5 text-muted-foreground hover:text-foreground transition" />
            </Link>
            <Link href="https://linkedin.com" target="_blank">
              <Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground transition" />
            </Link>
          </div>
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-md">
          <div>
            <h4 className="font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-gray-600 ">
              <li>
                <Link
                  href="/features"
                  className="hover:underline underline-offset-4"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:underline underline-offset-4"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/customers"
                  className="hover:underline underline-offset-4"
                >
                  Customers
                </Link>
              </li>
              <li>
                <Link
                  href="/whatsnew"
                  className="hover:underline underline-offset-4"
                >
                  What's new
                </Link>
              </li>
              <li>
                <Link
                  href="/roadmap"
                  className="hover:underline underline-offset-4"
                >
                  Roadmap
                </Link>
              </li>
              <li>
                <Link
                  href="/featurereq"
                  className="hover:underline underline-offset-4"
                >
                  Feature request
                </Link>
              </li>
              <li>
                <Link
                  href="/templates"
                  className="hover:underline underline-offset-4"
                >
                  Templates
                </Link>
              </li>
              <li>
                <Link
                  href="/integrations"
                  className="hover:underline underline-offset-4"
                >
                  Integrations
                </Link>
              </li>
              <li>
                <Link
                  href="/wfou"
                  className="hover:underline underline-offset-4"
                >
                  Words from our users
                </Link>
              </li>
              <li>
                <Link href="/status">Status</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Help</h4>
            <ul className="space-y-2 text-gray-600">
              <li>
                <Link
                  href="/about"
                  className="hover:underline underline-offset-4"
                >
                  Get started
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:underline underline-offset-4"
                >
                  How-to guides
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="hover:underline underline-offset-4"
                >
                  Help center
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="hover:underline underline-offset-4"
                >
                  Contact support
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="hover:underline underline-offset-4"
                >
                  Hire an expert
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="hover:underline underline-offset-4"
                >
                  Report abuse
                </Link>
              </li>
            </ul>
            <h4 className="font-semibold mb-3 pt-10">Company</h4>
            <ul className="space-y-2 text-gray-600">
              <li>
                <Link
                  href="/about"
                  className="hover:underline underline-offset-4"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:underline underline-offset-4"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="hover:underline underline-offset-4"
                >
                  Media kit
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-gray-600">
              <li>
                <Link
                  href="/help"
                  className="hover:underline underline-offset-4"
                >
                  Join the community
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:underline underline-offset-4"
                >
                  Developers
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:underline underline-offset-4"
                >
                  Referral Program
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:underline underline-offset-4"
                >
                  Fair use policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:underline underline-offset-4"
                >
                  GDPR
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:underline underline-offset-4"
                >
                  Terms & Privacy
                </Link>
              </li>
            </ul>
            <h4 className="font-semibold mb-3 pt-10">Compare</h4>
            <ul className="space-y-2 text-gray-600">
              <li>
                <Link
                  href="/about"
                  className="hover:underline underline-offset-4"
                >
                  Type form alternative
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:underline underline-offset-4"
                >
                  Jotform alternative
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="hover:underline underline-offset-4"
                >
                  Google Forms alternative
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="hover:underline underline-offset-4"
                >
                  Best free online form builder
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
