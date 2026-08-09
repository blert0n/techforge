import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BrandLogo } from "@/components/layout/brand-logo";
import {
  faTwitter,
  faFacebook,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

const footerSections = [
  {
    title: "Products",
    links: ["PC Components", "Gaming Laptops", "Monitors", "Accessories"],
  },
  {
    title: "Support",
    links: [
      "Order Tracking",
      "Returns & Refunds",
      "Warranty Info",
      "Contact Us",
    ],
  },
  {
    title: "Company",
    links: ["Privacy Policy", "Terms of Service"],
  },
];

const socialIcons = [faTwitter, faFacebook, faInstagram, faYoutube];

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary pb-8 pt-16 text-secondary-foreground">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-2xl font-bold tracking-tight"
            >
              <BrandLogo markClassName="size-9" />
            </Link>

            <p className="max-w-sm text-sm">
              The ultimate destination for premium PC hardware, custom builds,
              and enthusiast technology. Upgrade your digital experience today.
            </p>

            <div className="flex gap-4 pt-2">
              {socialIcons.map((icon, index) => (
                <Link
                  key={index}
                  href="#"
                  className="transition-colors hover:text-foreground"
                >
                  <FontAwesomeIcon
                    icon={icon}
                    className="text-xl"
                    height={16}
                    width={16}
                  />
                </Link>
              ))}
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 font-semibold">{section.title}</h3>

              <ul className="space-y-2 text-sm">
                {section.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="transition-colors hover:text-primary"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs md:flex-row">
          <p>© {new Date().getFullYear()} TechForge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
