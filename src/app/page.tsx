import BestSellers from "@/components/home/BestSellers";
import HeroSection from "../components/home/HeroSection";
import LatestCollections from "../components/home/LatestCollections";
import FrontendLayout from "../components/layouts/FrontendLayout";
import ShopWithUs from "@/components/home/ShopWithUs";

export default function Home() {
  return (
    <FrontendLayout>
      <HeroSection />
      <LatestCollections />
      <BestSellers />
      <ShopWithUs />
    </FrontendLayout>
  );
}
