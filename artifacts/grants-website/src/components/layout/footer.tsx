import { Link } from "wouter";
import { GraduationCap, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground border-t border-primary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
          <div className="md:col-span-1 space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-serif text-xl font-bold tracking-tight text-white">
                  Hope Foundation
                </span>
                <span className="text-xs text-primary-foreground/60 uppercase tracking-wider">
                  Student Aid Resource Program
                </span>
              </div>
            </Link>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Empowering the next generation of scholars and innovators through
              targeted educational grant funding. Your academic future is our
              mission.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold mb-6 text-white">
              Quick Links
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/"
                  className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/apply"
                  className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                >
                  Apply for Grant
                </Link>
              </li>
              <li>
                <Link
                  href="/testimonials"
                  className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                >
                  Voices of Hope
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold mb-6 text-white">
              Grant Categories
            </h3>
            <ul className="space-y-4">
              <li className="text-primary-foreground/80 text-sm">
                Tuition & Enrollment Fees
              </li>
              <li className="text-primary-foreground/80 text-sm">
                Textbooks & Academic Supplies
              </li>
              <li className="text-primary-foreground/80 text-sm">
                Campus Housing & Meal Plans
              </li>
              <li className="text-primary-foreground/80 text-sm">
                Technology & Equipment
              </li>
              <li className="text-primary-foreground/80 text-sm">
                Research & Laboratory Fees
              </li>
              <li className="text-primary-foreground/80 text-sm">
                Study Abroad Programs
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold mb-6 text-white">
              Contact Info
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-primary-foreground/80 text-sm">
                <MapPin className="h-5 w-5 text-secondary shrink-0" />
                <span>
                  123 Hope Avenue, Suite 400
                  <br />
                  Washington, D.C. 20001
                </span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/80 text-sm">
                <Phone className="h-5 w-5 text-secondary shrink-0" />
                <span>1-539-304-9555</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/80 text-sm">
                <Mail className="h-5 w-5 text-secondary shrink-0" />
                <span>support@hopefoundations.us</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} Hope Foundation — Student Aid Resource
            Program. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-primary-foreground/60">
            <span className="hover:text-white cursor-pointer transition-colors">
              Privacy Policy
            </span>
            <span className="hover:text-white cursor-pointer transition-colors">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
