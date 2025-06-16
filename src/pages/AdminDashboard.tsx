
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Car, Users, MessageSquare, LogOut, Home, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardStats from '@/components/admin/DashboardStats';
import InventoryList from '@/components/admin/InventoryList';
import LeadsList from '@/components/admin/LeadsList';
import InquiriesList from '@/components/admin/InquiriesList';
import NotificationsList from '@/components/admin/NotificationsList';

const AdminDashboard = () => {
  const { user, profile, signOut, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">JB AUTOS Machines Admin</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {profile?.full_name || profile?.email}
              </span>
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/'}>
                <Home className="w-4 h-4 mr-2" />
                Main Site
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Home className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center space-x-2">
              <Car className="w-4 h-4" />
              <span>Inventory</span>
            </TabsTrigger>
            <TabsTrigger value="leads" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Leads</span>
            </TabsTrigger>
            <TabsTrigger value="inquiries" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Inquiries</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <DashboardStats />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setActiveTab('inventory')}
              >
                <div className="bg-white p-6 rounded-lg border">
                  <div className="flex items-center space-x-3 mb-4">
                    <Car className="w-8 h-8 text-green-600" />
                    <h3 className="text-lg font-semibold">Manage Inventory</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Add, edit, or remove cars from your inventory
                  </p>
                  <Button className="w-full" variant="outline">
                    View Inventory
                  </Button>
                </div>
              </div>
              
              <div 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setActiveTab('leads')}
              >
                <div className="bg-white p-6 rounded-lg border">
                  <div className="flex items-center space-x-3 mb-4">
                    <Users className="w-8 h-8 text-green-600" />
                    <h3 className="text-lg font-semibold">Customer Leads</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Track and manage customer inquiries and leads
                  </p>
                  <Button className="w-full" variant="outline">
                    View Leads
                  </Button>
                </div>
              </div>
              
              <div 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setActiveTab('inquiries')}
              >
                <div className="bg-white p-6 rounded-lg border">
                  <div className="flex items-center space-x-3 mb-4">
                    <MessageSquare className="w-8 h-8 text-green-600" />
                    <h3 className="text-lg font-semibold">Messages</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Respond to customer inquiries and messages
                  </p>
                  <Button className="w-full" variant="outline">
                    View Messages
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="inventory">
            <InventoryList />
          </TabsContent>

          <TabsContent value="leads">
            <LeadsList />
          </TabsContent>

          <TabsContent value="inquiries">
            <InquiriesList />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationsList />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
