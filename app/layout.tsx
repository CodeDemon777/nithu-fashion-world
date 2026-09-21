import type { Metadata } from "next";
import "./globals.css";
import { ShopProvider } from "@/context/ShopContext";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/modals/CartDrawer";
import { WishlistDrawer } from "@/components/modals/WishlistDrawer";
import { QuickViewModal } from "@/components/modals/QuickViewModal";
import { BookServiceModal } from "@/components/modals/BookServiceModal";
import { ToastNotification } from "@/components/ui/ToastNotification";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "NITHU FASHION WORLD | Luxury Sarees, Custom Tailoring, Aari Work & Crafts",
  description:
    "Discover handcrafted Kanchipuram sarees, custom designer bridal blouses, Aari embroidery work, kids party wear, and bespoke gifts from NITHU FASHION WORLD. Fast delivery across Tamil Nadu.",
  keywords: [
    "Nithu Fashion World",
    "Tailoring Komarapalayam",
    "Aari Work Blouses",
    "Kanchipuram Silk Sarees",
    "Custom Kids Wear",
    "Handmade Gifts Tamil Nadu",
    "Bridal Blouse Embroidery",
  ],
  authors: [{ name: "NITHU FASHION WORLD" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased min-h-screen flex flex-col bg-[#FFF7F0] text-[#24191A] selection:bg-burgundy selection:text-cream">
        <ShopProvider>
          {/* Top Announcement Bar */}
          <AnnouncementBar />

          {/* Sticky Navbar */}
          <Navbar />

          {/* Page Content */}
          <main className="flex-1">{children}</main>

          {/* Luxury Footer */}
          <Footer />

          {/* Global Interactive Modals & Drawers */}
          <CartDrawer />
          <WishlistDrawer />
          <QuickViewModal />
          <BookServiceModal />
          <ToastNotification />
        </ShopProvider>
      </body>
    </html>
  );
}
