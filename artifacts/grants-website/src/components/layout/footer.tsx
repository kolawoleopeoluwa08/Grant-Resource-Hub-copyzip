import React from 'react';
import { Link } from 'wouter';
import { HeartHandshake, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground border-t border-primary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
          
          <div className="md:col-span-1 space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                HopeGrant
              </span>
            </Link>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Providing vital financial assistance to individuals and families during their most challenging times. A beacon of trust and community support.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/apply" className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm">
                  Apply for Aid
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm">
                  Stories of Hope
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold mb-6 text-white">Aid Types</h3>
            <ul className="space-y-4">
              <li className="text-primary-foreground/80 text-sm">Emergency Aid</li>
              <li className="text-primary-foreground/80 text-sm">Education Grants</li>
              <li className="text-primary-foreground/80 text-sm">Business Grants</li>
              <li className="text-primary-foreground/80 text-sm">Housing Assistance</li>
              <li className="text-primary-foreground/80 text-sm">Medical Aid</li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold mb-6 text-white">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-primary-foreground/80 text-sm">
                <MapPin className="h-5 w-5 text-secondary shrink-0" />
                <span>123 Hope Avenue, Suite 400<br/>San Francisco, CA 94103</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/80 text-sm">
                <Phone className="h-5 w-5 text-secondary shrink-0" />
                <span>1-800-555-HOPE</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/80 text-sm">
                <Mail className="h-5 w-5 text-secondary shrink-0" />
                <span>support@hopegrant.org</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} HopeGrant Foundation. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-primary-foreground/60">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
