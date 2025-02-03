import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Package } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome to Second Hand Marketplace</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Link
            to="/products"
            className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex flex-col items-center text-center">
              <ShoppingBag className="h-16 w-16 text-indigo-600 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Buy Items</h2>
              <p className="text-gray-600">Browse through a wide selection of second-hand items</p>
            </div>
          </Link>

          <Link
            to="/sell"
            className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex flex-col items-center text-center">
              <Package className="h-16 w-16 text-indigo-600 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Sell Items</h2>
              <p className="text-gray-600">List your items for sale on our marketplace</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}