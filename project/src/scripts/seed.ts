import { supabase } from '../lib/supabase';

const sampleProducts = [
  {
    title: "Vintage Leather Jacket",
    description: "Classic brown leather jacket in excellent condition. Size M.",
    price: 89.99,
    image_url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80",
  },
  {
    title: "MacBook Pro 2019",
    description: "13-inch, 8GB RAM, 256GB SSD. Minor scratches but works perfectly.",
    price: 799.99,
    image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80",
  },
  {
    title: "Acoustic Guitar",
    description: "Yamaha FG800 with case. Great for beginners.",
    price: 150.00,
    image_url: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&q=80",
  },
  {
    title: "Canon DSLR Camera",
    description: "Canon EOS 700D with 18-55mm lens. Includes memory card and bag.",
    price: 349.99,
    image_url: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&q=80",
  },
  {
    title: "Vintage Record Player",
    description: "1970s turntable in working condition. Perfect for vinyl enthusiasts.",
    price: 199.99,
    image_url: "https://images.unsplash.com/photo-1461360228754-6e81c478b882?auto=format&fit=crop&q=80",
  },
  {
    title: "Mountain Bike",
    description: "Trek Marlin 5, excellent condition, recently serviced.",
    price: 450.00,
    image_url: "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&q=80",
  },
  {
    title: "Designer Sunglasses",
    description: "Ray-Ban Wayfarer, barely used, includes case.",
    price: 95.00,
    image_url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80",
  },
  {
    title: "Antique Watch",
    description: "1960s Omega Seamaster, recently serviced, keeps perfect time.",
    price: 1200.00,
    image_url: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80",
  }
];

export async function seedProducts() {
  try {
    // First, get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found. Please sign in first.');
      return null;
    }

    // Update the seller_id for all products
    const productsWithSeller = sampleProducts.map(product => ({
      ...product,
      seller_id: user.id
    }));

    // Insert the products
    const { data, error } = await supabase
      .from('products')
      .insert(productsWithSeller);

    if (error) {
      console.error('Error seeding products:', error);
      return null;
    }

    console.log('Successfully seeded products:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}