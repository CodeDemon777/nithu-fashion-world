import { Hero } from "@/components/home/Hero";
import { CategorySection } from "@/components/home/CategorySection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { FeaturedCollection } from "@/components/home/FeaturedCollection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Testimonials } from "@/components/home/Testimonials";
import { InstagramSection } from "@/components/home/InstagramSection";

export default function Home() {
  return (
    <div id="home" className="relative flex flex-col w-full overflow-hidden">
      {/* 1. Hero Section with Trust Strip */}
      <Hero />

      {/* 2. Shop by Category */}
      <CategorySection />

      {/* 3. Our Services & Bespoke CTA */}
      <ServicesSection />

      {/* 4. Featured Collection */}
      <FeaturedCollection />

      {/* 5. How It Works */}
      <HowItWorks />

      {/* 6. Customer Testimonials */}
      <Testimonials />

      {/* 7. Instagram Showcase */}
      <InstagramSection />
    </div>
  );
}
