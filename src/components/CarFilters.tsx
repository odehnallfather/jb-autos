
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search, Filter } from 'lucide-react';

interface CarFiltersProps {
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const CarFilters = ({
  categoryFilter,
  setCategoryFilter,
  priceRange,
  setPriceRange,
  searchTerm,
  setSearchTerm,
}: CarFiltersProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search */}
          <div>
            <Label htmlFor="search">Search Cars</Label>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="search"
                placeholder="Search by make, model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cars</SelectItem>
                <SelectItem value="brand-new">Brand New</SelectItem>
                <SelectItem value="toks">Toks</SelectItem>
                <SelectItem value="grade-a">Grade-A</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div>
            <Label>Price Range</Label>
            <div className="mt-4 space-y-4">
              <Slider
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                max={50000000}
                min={0}
                step={500000}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{formatPrice(priceRange[0])}</span>
                <span>{formatPrice(priceRange[1])}</span>
              </div>
            </div>
          </div>

          {/* Reset Filters */}
          <Button
            variant="outline"
            onClick={() => {
              setCategoryFilter('all');
              setPriceRange([0, 50000000]);
              setSearchTerm('');
            }}
            className="w-full"
          >
            Reset Filters
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CarFilters;
