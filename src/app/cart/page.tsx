"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useUser } from "@clerk/nextjs";
import { 
  Trash2, 
  ShoppingCart, 
  ArrowRight, 
  ChevronLeft, 
  ShoppingBag,
  CreditCard,
  Truck,
  ShieldCheck,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import CheckoutDialog from "@/components/CheckoutDialog";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, cartCount } = useCart();
  const { isSignedIn } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + (item.price || 0), 0);
  const shipping = cartCount > 0 ? 40 : 0;
  const total = subtotal + shipping;

  const handleCheckoutClick = () => {
    if (!isSignedIn) {
      router.push("/sign-in?redirect=/cart");
      return;
    }
    setCheckoutOpen(true);
  };

  const handleCheckoutSuccess = () => {
    clearCart();
    router.push("/dashboard");
  };

  if (cartCount === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="bg-accent/50 p-6 rounded-full">
            <ShoppingCart className="h-16 w-16 text-muted-foreground/40" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-display font-bold">Your Cart is Empty</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Looks like you haven't added any books to your cart yet. Explore our marketplace to find your next great read!
            </p>
          </div>
          <Link href="/marketplace">
            <Button size="lg" className="rounded-full px-8 font-bold">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="rounded-full">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <h1 className="text-3xl font-display font-bold">Your Cart ({cartCount})</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div 
              key={item._id} 
              className="flex flex-col sm:flex-row gap-4 bg-card border rounded-3xl p-4 shadow-sm transition-hover hover:shadow-md"
            >
              <div className="w-full sm:w-24 h-32 rounded-2xl overflow-hidden bg-accent shrink-0">
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex flex-col justify-between flex-1 py-1">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg leading-tight line-clamp-1">{item.title}</h3>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:bg-destructive/10 rounded-full"
                      onClick={() => removeFromCart(item._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">by {item.author || "Unknown Author"}</p>
                  <div className="flex gap-2 mt-2">
                    {item.is_swap && <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">Swap</Badge>}
                    <Badge variant="secondary" className="text-[10px] uppercase font-bold">Verified</Badge>
                  </div>
                </div>
                
                <div className="flex justify-between items-end mt-4">
                  <p className="font-bold text-xl">
                    {item.is_swap ? "Trade Only" : `₹${item.price}`}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between pt-4">
            <Link href="/marketplace">
              <Button variant="ghost" className="rounded-full text-primary font-bold">
                <Plus className="h-4 w-4 mr-2" /> Add More Books
              </Button>
            </Link>
            <Button variant="ghost" className="text-muted-foreground" onClick={clearCart}>
              Clear All
            </Button>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <div className="bg-card border rounded-3xl p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="text-foreground font-medium">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="text-foreground font-medium">₹{shipping}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax</span>
                <span className="text-foreground font-medium">₹0</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">₹{total}</span>
              </div>
            </div>

            <Button 
              className="w-full h-14 rounded-2xl mt-8 font-bold text-lg shadow-lg shadow-primary/20 transition-all active:scale-95"
              onClick={handleCheckoutClick}
            >
              Checkout <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                <span>Secure Payment Processing</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Truck className="h-4 w-4" />
                <span>Fast & Reliable Delivery</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4" />
                <span>Buyer Protection Enabled</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10">
            <p className="text-xs text-primary font-medium">
              Note: For swap items, the shipping fee still applies for our courier service. The trade will be finalized once both parties confirm.
            </p>
          </div>
        </div>
      </div>

      <CheckoutDialog 
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        cartItems={cart}
        onSuccess={handleCheckoutSuccess}
      />
    </div>
  );
}
