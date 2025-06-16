
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import InventorySection from '@/components/InventorySection';
import FeaturesSection from '@/components/FeaturesSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <InventorySection />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Index;
