import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Trash2, Plus, Search, Upload, X, Image as ImageIcon, Video, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Tables, Enums } from '@/integrations/supabase/types';

type Car = Tables<'cars'>;
type CarStatus = Enums<'car_status'>;

interface MediaFile {
  file: File;
  preview: string;
  type: 'image' | 'video';
  id: string;
}

const InventoryList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | CarStatus>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState<number>(0);
  const [uploading, setUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    mileage: '',
    fuel_type: '',
    transmission: '',
    color: '',
    description: '',
    features: '',
    status: 'available' as CarStatus
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cars, isLoading } = useQuery({
    queryKey: ['cars', searchTerm, statusFilter],
    queryFn: async () => {
      let query = supabase.from('cars').select('*').order('created_at', { ascending: false });
      
      if (searchTerm) {
        query = query.or(`make.ilike.%${searchTerm}%,model.ilike.%${searchTerm}%`);
      }
      
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const uploadMediaFiles = async (files: MediaFile[]) => {
    const uploadedUrls: string[] = [];
    
    for (const mediaFile of files) {
      const fileExt = mediaFile.file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `car-media/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('car-images')
        .upload(filePath, mediaFile.file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Failed to upload ${mediaFile.file.name}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('car-images')
        .getPublicUrl(filePath);

      uploadedUrls.push(publicUrl);
    }
    
    return uploadedUrls;
  };

  const addCarMutation = useMutation({
    mutationFn: async (carData: any) => {
      setUploading(true);
      
      let imageUrls: string[] = [];
      if (mediaFiles.length > 0) {
        imageUrls = await uploadMediaFiles(mediaFiles);
      }

      const { error } = await supabase.from('cars').insert([{
        ...carData,
        features: carData.features ? carData.features.split(',').map((f: string) => f.trim()) : [],
        price: parseFloat(carData.price),
        mileage: carData.mileage ? parseInt(carData.mileage) : null,
        year: parseInt(carData.year),
        images: imageUrls
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      setShowAddDialog(false);
      resetForm();
      toast({ title: 'Car added successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to add car', description: error.message, variant: 'destructive' });
    },
    onSettled: () => {
      setUploading(false);
    }
  });

  const updateCarMutation = useMutation({
    mutationFn: async ({ id, carData }: { id: string; carData: any }) => {
      setUploading(true);
      
      let imageUrls: string[] = [];
      if (mediaFiles.length > 0) {
        imageUrls = await uploadMediaFiles(mediaFiles);
      }

      const updateData = {
        ...carData,
        features: carData.features ? carData.features.split(',').map((f: string) => f.trim()) : [],
        price: parseFloat(carData.price),
        mileage: carData.mileage ? parseInt(carData.mileage) : null,
        year: parseInt(carData.year),
        updated_at: new Date().toISOString()
      };

      if (imageUrls.length > 0) {
        updateData.images = imageUrls;
      }

      const { error } = await supabase.from('cars').update(updateData).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      setEditingCar(null);
      resetForm();
      toast({ title: 'Car updated successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to update car', description: error.message, variant: 'destructive' });
    },
    onSettled: () => {
      setUploading(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (carId: string) => {
      const { error } = await supabase.from('cars').delete().eq('id', carId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      toast({ title: 'Car deleted successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to delete car', description: error.message, variant: 'destructive' });
    },
  });

  const resetForm = () => {
    setFormData({
      make: '',
      model: '',
      year: new Date().getFullYear(),
      price: '',
      mileage: '',
      fuel_type: '',
      transmission: '',
      color: '',
      description: '',
      features: '',
      status: 'available'
    });
    setMediaFiles([]);
    setPrimaryImageIndex(0);
  };

  const handleEdit = (car: Car) => {
    setEditingCar(car);
    setFormData({
      make: car.make,
      model: car.model,
      year: car.year,
      price: car.price.toString(),
      mileage: car.mileage?.toString() || '',
      fuel_type: car.fuel_type || '',
      transmission: car.transmission || '',
      color: car.color || '',
      description: car.description || '',
      features: car.features?.join(', ') || '',
      status: car.status || 'available'
    });
    setMediaFiles([]);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      if (type === 'image' && !file.type.startsWith('image/')) {
        toast({ title: 'Invalid file type', description: 'Please select image files only', variant: 'destructive' });
        return;
      }
      
      if (type === 'video' && !file.type.startsWith('video/')) {
        toast({ title: 'Invalid file type', description: 'Please select video files only', variant: 'destructive' });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const newMediaFile: MediaFile = {
          file,
          preview: e.target?.result as string,
          type,
          id: Date.now().toString() + Math.random().toString(36)
        };
        
        setMediaFiles(prev => [...prev, newMediaFile]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    event.target.value = '';
  };

  const removeMediaFile = (id: string) => {
    setMediaFiles(prev => {
      const newFiles = prev.filter(f => f.id !== id);
      if (primaryImageIndex >= newFiles.length) {
        setPrimaryImageIndex(Math.max(0, newFiles.length - 1));
      }
      return newFiles;
    });
  };

  const setPrimaryImage = (index: number) => {
    setPrimaryImageIndex(index);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCar) {
      updateCarMutation.mutate({ id: editingCar.id, carData: formData });
    } else {
      addCarMutation.mutate(formData);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'sold': return 'bg-red-100 text-red-800';
      case 'reserved': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(price);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading inventory...</div>;
  }

  const imageFiles = mediaFiles.filter(f => f.type === 'image');
  const videoFiles = mediaFiles.filter(f => f.type === 'video');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Inventory Management</h2>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Car
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Car</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="make">Make *</Label>
                  <Input
                    id="make"
                    value={formData.make}
                    onChange={(e) => setFormData(prev => ({ ...prev, make: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price (₦) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="mileage">Mileage (km)</Label>
                  <Input
                    id="mileage"
                    type="number"
                    value={formData.mileage}
                    onChange={(e) => setFormData(prev => ({ ...prev, mileage: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fuel_type">Fuel Type</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, fuel_type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Petrol">Petrol</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="transmission">Transmission</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, transmission: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select transmission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manual">Manual</SelectItem>
                      <SelectItem value="Automatic">Automatic</SelectItem>
                      <SelectItem value="CVT">CVT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: CarStatus) => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Media Upload Section */}
              <div className="space-y-4">
                <div>
                  <Label className="text-lg font-semibold">Car Media</Label>
                  <p className="text-sm text-gray-600">Upload images and videos of the car</p>
                </div>

                {/* Upload Buttons */}
                <div className="flex gap-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileSelect(e, 'image')}
                    className="hidden"
                  />
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={(e) => handleFileSelect(e, 'video')}
                    className="hidden"
                  />
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Add Images
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => videoInputRef.current?.click()}
                    className="flex items-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    Add Videos
                  </Button>
                </div>

                {/* Media Preview */}
                {mediaFiles.length > 0 && (
                  <div className="space-y-4">
                    {/* Images */}
                    {imageFiles.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium">Images ({imageFiles.length})</Label>
                        <div className="grid grid-cols-4 gap-4 mt-2">
                          {imageFiles.map((file, index) => (
                            <div key={file.id} className="relative group">
                              <img
                                src={file.preview}
                                alt="Car preview"
                                className={`w-full h-24 object-cover rounded-lg border-2 cursor-pointer ${
                                  primaryImageIndex === index ? 'border-nigerian-green' : 'border-gray-200'
                                }`}
                                onClick={() => setPrimaryImage(index)}
                              />
                              <button
                                type="button"
                                onClick={() => removeMediaFile(file.id)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                              {primaryImageIndex === index && (
                                <div className="absolute bottom-1 left-1 bg-nigerian-green text-white text-xs px-1 rounded">
                                  Primary
                                </div>
                              )}
                              <button
                                type="button"
                                onClick={() => setPrimaryImage(index)}
                                className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                Set Primary
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Videos */}
                    {videoFiles.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium">Videos ({videoFiles.length})</Label>
                        <div className="grid grid-cols-3 gap-4 mt-2">
                          {videoFiles.map((file) => (
                            <div key={file.id} className="relative group">
                              <video
                                src={file.preview}
                                className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                controls={false}
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                                <Video className="w-6 h-6 text-white" />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeMediaFile(file.id)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="features">Features (comma-separated)</Label>
                <Input
                  id="features"
                  value={formData.features}
                  onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
                  placeholder="AC, Leather Seats, Navigation, etc."
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  type="submit" 
                  disabled={addCarMutation.isPending || uploading}
                  className="bg-gradient-nigerian hover:opacity-90"
                >
                  {uploading ? 'Uploading...' : addCarMutation.isPending ? 'Adding...' : 'Add Car'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by make or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(value: 'all' | CarStatus) => setStatusFilter(value)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="sold">Sold</SelectItem>
            <SelectItem value="reserved">Reserved</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars?.map((car) => (
          <Card key={car.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{car.year} {car.make} {car.model}</CardTitle>
                <Badge className={getStatusColor(car.status || 'available')}>
                  {car.status || 'available'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Car Image */}
              {car.images && car.images.length > 0 ? (
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={car.images[0]} 
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <Camera className="w-8 h-8 text-gray-400" />
                </div>
              )}
              
              <div className="text-2xl font-bold text-nigerian-green">
                {formatPrice(Number(car.price))}
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                {car.mileage && (
                  <div>Mileage: {car.mileage.toLocaleString()} km</div>
                )}
                {car.fuel_type && (
                  <div>Fuel: {car.fuel_type}</div>
                )}
                {car.transmission && (
                  <div>Transmission: {car.transmission}</div>
                )}
                {car.color && (
                  <div>Color: {car.color}</div>
                )}
              </div>

              {car.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {car.description}
                </p>
              )}

              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(car)}>
                  <Pencil className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => deleteMutation.mutate(car.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog - Similar structure but for editing */}
      <Dialog open={!!editingCar} onOpenChange={() => setEditingCar(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Car</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Same form structure as add dialog */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-make">Make *</Label>
                <Input
                  id="edit-make"
                  value={formData.make}
                  onChange={(e) => setFormData(prev => ({ ...prev, make: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-model">Model *</Label>
                <Input
                  id="edit-model"
                  value={formData.model}
                  onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-year">Year *</Label>
                <Input
                  id="edit-year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-price">Price (₦) *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-mileage">Mileage (km)</Label>
                <Input
                  id="edit-mileage"
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => setFormData(prev => ({ ...prev, mileage: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-fuel_type">Fuel Type</Label>
                <Select value={formData.fuel_type} onValueChange={(value) => setFormData(prev => ({ ...prev, fuel_type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Petrol">Petrol</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-transmission">Transmission</Label>
                <Select value={formData.transmission} onValueChange={(value) => setFormData(prev => ({ ...prev, transmission: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manual">Manual</SelectItem>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                    <SelectItem value="CVT">CVT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-color">Color</Label>
                <Input
                  id="edit-color"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value: CarStatus) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Media Upload Section for Edit */}
            <div className="space-y-4">
              <div>
                <Label className="text-lg font-semibold">Update Car Media</Label>
                <p className="text-sm text-gray-600">Add new images and videos (existing media will be replaced)</p>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <ImageIcon className="w-4 h-4" />
                  Add Images
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => videoInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  Add Videos
                </Button>
              </div>

              {/* Show existing images */}
              {editingCar?.images && editingCar.images.length > 0 && mediaFiles.length === 0 && (
                <div>
                  <Label className="text-sm font-medium">Current Images</Label>
                  <div className="grid grid-cols-4 gap-4 mt-2">
                    {editingCar.images.map((imageUrl, index) => (
                      <div key={index} className="relative">
                        <img
                          src={imageUrl}
                          alt={`${editingCar.make} ${editingCar.model}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Show new media preview */}
              {mediaFiles.length > 0 && (
                <div className="space-y-4">
                  {imageFiles.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium">New Images ({imageFiles.length})</Label>
                      <div className="grid grid-cols-4 gap-4 mt-2">
                        {imageFiles.map((file, index) => (
                          <div key={file.id} className="relative group">
                            <img
                              src={file.preview}
                              alt="Car preview"
                              className={`w-full h-24 object-cover rounded-lg border-2 cursor-pointer ${
                                primaryImageIndex === index ? 'border-nigerian-green' : 'border-gray-200'
                              }`}
                              onClick={() => setPrimaryImage(index)}
                            />
                            <button
                              type="button"
                              onClick={() => removeMediaFile(file.id)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {videoFiles.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium">New Videos ({videoFiles.length})</Label>
                      <div className="grid grid-cols-3 gap-4 mt-2">
                        {videoFiles.map((file) => (
                          <div key={file.id} className="relative group">
                            <video
                              src={file.preview}
                              className="w-full h-24 object-cover rounded-lg border border-gray-200"
                              controls={false}
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                              <Video className="w-6 h-6 text-white" />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeMediaFile(file.id)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="edit-features">Features (comma-separated)</Label>
              <Input
                id="edit-features"
                value={formData.features}
                onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
                placeholder="AC, Leather Seats, Navigation, etc."
              />
            </div>

            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                type="submit" 
                disabled={updateCarMutation.isPending || uploading}
                className="bg-gradient-nigerian hover:opacity-90"
              >
                {uploading ? 'Uploading...' : updateCarMutation.isPending ? 'Updating...' : 'Update Car'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setEditingCar(null)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {cars?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No cars found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default InventoryList;