import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CarCard from '@/components/CarCard';
import CarFilters from '@/components/CarFilters';
import { Button } from '@/components/ui/button';
import { Car, MapPin } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type CarData = Tables<'cars'>;

const Cars = () => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000]);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: cars, isLoading } = useQuery({
    queryKey: ['cars', categoryFilter, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('cars')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`make.ilike.%${searchTerm}%,model.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as CarData[];
    },
  });

  const filteredCars = cars?.filter(car => {
    const matchesPrice = Number(car.price) >= priceRange[0] && Number(car.price) <= priceRange[1];
    if (categoryFilter === 'all') return matchesPrice;
    
    // Map categories to car types (you can adjust this logic based on your data structure)
    const carCategory = car.description?.toLowerCase().includes('brand new') ? 'brand-new' :
                       car.description?.toLowerCase().includes('toks') ? 'toks' : 'grade-a';
    
    return categoryFilter === carCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-nigerian text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Available Cars at JB AUTOS
          </h1>
          <p className="text-xl opacity-90 mb-6">
            Quality vehicles from Brand New to Grade-A Nigerian used cars
          </p>
          <div className="flex items-center justify-center gap-2 text-lg">
            <MapPin className="w-5 h-5" />
            <span>Ikate, Lekki-Epe Expressway, Lagos</span>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <CarFilters
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>

          {/* Cars Grid */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {filteredCars?.length || 0} Cars Available
              </h2>
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                    <div className="bg-gray-300 h-48 rounded mb-4"></div>
                    <div className="space-y-2">
                      <div className="bg-gray-300 h-4 rounded w-3/4"></div>
                      <div className="bg-gray-300 h-4 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredCars?.length === 0 ? (
              <div className="text-center py-12">
                <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No cars found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCars?.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cars;