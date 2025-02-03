import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import type { CartItem } from '../types';
import { Trash2, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  async function fetchCartItems() {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          quantity,
          products (
            id,
            title,
            description,
            price,
            image_url,
            seller_id,
            created_at
          )
        `);

      if (error) throw error;

      const items: CartItem[] = data.map((item: any) => ({
        ...item.products,
        quantity: item.quantity,
      }));

      setCartItems(items);
    } catch (error) {
      toast.error('Error loading cart items');
    } finally {
      setLoading(false);
    }
  }

  async function removeFromCart(productId: string) {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('product_id', productId);

      if (error) throw error;

      setCartItems(cartItems.filter(item => item.id !== productId));
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Error removing item from cart');
    }
  }

  async function checkout() {
    if (!user) {
      toast.error('Please sign in to checkout');
      return;
    }

    setCheckingOut(true);
    try {
      const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      // Create the order with user_id
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{ 
          user_id: user.id,
          total_amount: totalAmount,
          status: 'pending'
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: orderData.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_time: item.price
      }));

      const { error: orderItemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (orderItemsError) throw orderItemsError;

      // Clear the cart
      const { error: cartError } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (cartError) throw cartError;

      setCartItems([]);
      toast.success('Order placed successfully!');
      navigate('/'); // Redirect to dashboard after successful checkout
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Error placing order. Please try again.');
    } finally {
      setCheckingOut(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading cart...</div>
      </div>
    );
  }

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-8">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-6">
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  )}
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900">{item.title}</h2>
                    <p className="text-gray-600 mt-1">{item.description}</p>
                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <span className="text-gray-600">Quantity: </span>
                        <span className="font-semibold">{item.quantity}</span>
                      </div>
                      <span className="text-xl font-bold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-6 w-6" />
                  </button>
                </div>
              </div>
            ))}

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xl font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
              <button
                onClick={checkout}
                disabled={checkingOut}
                className={`w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 flex items-center justify-center ${
                  checkingOut ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {checkingOut ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-6 w-6 mr-2" />
                    Checkout
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}