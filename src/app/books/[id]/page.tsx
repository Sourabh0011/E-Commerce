"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { 
  BookOpen, 
  Star, 
  ShoppingCart, 
  ArrowLeftRight, 
  ChevronLeft, 
  ShieldCheck, 
  Truck, 
  RefreshCcw,
  User,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { useToast } from "@/hooks/use-toast";
import BuyDialog from "@/components/BuyDialog";

interface Book {
  _id: string;
  title: string;
  author: string;
  price: number | null;
  is_swap: boolean;
  condition: string;
  category: string;
  description: string;
  image_url: string;
  image_urls: string[];
  user: {
    _id: string;
    username: string;
    avatar_url?: string;
  };
  reviews: {
    _id: string;
    username: string;
    rating: number;
    comment: string;
    created_at: string;
  }[];
  created_at: string;
}

import { useCart } from "@/hooks/useCart";

export default function BookDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isSignedIn, user: clerkUser } = useUser();
  const { toast } = useToast();
  const { addToCart, cart } = useCart();
  
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [buyOpen, setBuyOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiUrl}/books/${id}`);
        if (!res.ok) throw new Error("Book not found");
        const data = await res.json();
        setBook(data);
        setSelectedImage(data.image_url);
      } catch (err) {
        console.error("Error fetching book:", err);
        toast({
          title: "Error",
          description: "Could not load book details.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBook();
  }, [id, toast]);

  const handleAddToCart = () => {
    if (!book) return;
    
    const existing = cart.find((item: any) => item._id === book._id);
    
    if (existing) {
      toast({ title: "Already in cart", description: "This book is already in your cart." });
    } else {
      addToCart({
        _id: book._id,
        title: book.title,
        price: book.price,
        image_url: book.image_url,
        is_swap: book.is_swap,
        author: book.author,
        sellerId: book.user?._id
      });
      toast({ title: "Added to cart", description: `${book.title} added to your cart.` });
    }
  };

  const handleBuyNow = () => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    setBuyOpen(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-muted mx-auto rounded"></div>
          <div className="h-96 w-full max-w-4xl bg-muted mx-auto rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Book Not Found</h1>
        <Button className="mt-4" onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link href="/">Home</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link href="/marketplace">Marketplace</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="max-w-[200px] truncate">{book.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Images */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border bg-muted shadow-lg">
            {selectedImage ? (
              <img src={selectedImage} alt={book.title} className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full"><BookOpen className="h-20 w-20 text-muted-foreground/20" /></div>
            )}
            {book.is_swap && (
              <Badge className="absolute top-4 left-4 bg-blue-600 px-4 py-1 text-sm">Swap Available</Badge>
            )}
          </div>
          
          {book.image_urls && book.image_urls.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {book.image_urls.map((url, i) => (
                <button 
                  key={i} 
                  onClick={() => setSelectedImage(url)}
                  className={`relative shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === url ? 'border-primary shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                  <img src={url} alt={`${book.title} ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="flex flex-col">
          <div className="space-y-2">
            <Badge variant="outline" className="text-primary font-bold">{book.category}</Badge>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground leading-tight">{book.title}</h1>
            <p className="text-xl text-muted-foreground font-medium">by <span className="text-foreground">{book.author}</span></p>
            
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-3 py-1 rounded-full">
                <Star className="h-4 w-4 fill-amber-500" />
                <span className="font-bold">4.8</span>
                <span className="text-xs text-amber-700/60 ml-1">({book.reviews?.length || 0} reviews)</span>
              </div>
              <Badge variant="secondary" className="px-3 py-1 rounded-full uppercase tracking-wider text-[10px] font-bold">
                Condition: {book.condition}
              </Badge>
            </div>
          </div>

          <div className="mt-8 p-6 rounded-3xl bg-accent/30 border border-accent">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-foreground">
                {book.is_swap ? "Trade Offer" : `₹${book.price}`}
              </span>
              {!book.is_swap && <span className="text-sm text-muted-foreground line-through">₹{(book.price! * 1.5).toFixed(0)}</span>}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Free delivery within city limits</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <Button 
                onClick={handleBuyNow}
                className={`h-14 rounded-2xl text-base font-bold shadow-lg transition-all active:scale-95 ${book.is_swap ? 'bg-blue-600 hover:bg-blue-700' : 'bg-primary hover:bg-primary/90'}`}
              >
                {book.is_swap ? <><ArrowLeftRight className="mr-2 h-5 w-5" /> Request Swap</> : <><ShoppingCart className="mr-2 h-5 w-5" /> Buy Now</>}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleAddToCart}
                className="h-14 rounded-2xl text-base font-bold border-2 hover:bg-accent transition-all active:scale-95"
              >
                Add to Cart
              </Button>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-green-100 p-2 rounded-lg"><ShieldCheck className="h-5 w-5 text-green-600" /></div>
              <div>
                <p className="font-bold text-sm">Quality Guaranteed</p>
                <p className="text-xs text-muted-foreground">Every book is inspected for quality before listing.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-blue-100 p-2 rounded-lg"><Truck className="h-5 w-5 text-blue-600" /></div>
              <div>
                <p className="font-bold text-sm">Secure Delivery</p>
                <p className="text-xs text-muted-foreground">Contactless delivery at your preferred location.</p>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="space-y-4">
            <h3 className="font-bold text-lg">Seller Information</h3>
            <div className="flex items-center gap-4 bg-card border rounded-2xl p-4">
              <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center overflow-hidden">
                {book.user?.avatar_url ? (
                  <img src={book.user.avatar_url} alt={book.user.username} className="w-full h-full object-cover" />
                ) : (
                  <User className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="font-bold">{book.user?.username || "Verified Seller"}</p>
                <p className="text-xs text-muted-foreground">Member since 2024 • 15+ Successful Trades</p>
              </div>
              <Button variant="ghost" size="sm" className="ml-auto rounded-full">View Profile</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Reviews */}
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Description</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {book.description || "No description provided for this book. Please contact the seller for more details."}
            </p>
          </section>

          <Separator />

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Reviews ({book.reviews?.length || 0})</h2>
              <Button variant="outline" size="sm" className="rounded-full">Write a Review</Button>
            </div>
            
            {book.reviews && book.reviews.length > 0 ? (
              <div className="space-y-6">
                {book.reviews.map((review) => (
                  <div key={review._id} className="bg-card border rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center"><User className="h-4 w-4" /></div>
                        <span className="font-bold text-sm">{review.username}</span>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-amber-500 text-amber-500' : 'text-muted'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground italic">"{review.comment}"</p>
                    <div className="mt-3 flex items-center text-[10px] text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(review.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-accent/20 rounded-3xl border border-dashed">
                <p className="text-muted-foreground">No reviews yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-card border rounded-3xl p-6 shadow-sm sticky top-24">
            <h3 className="font-bold text-lg mb-4">Why BookBazaar?</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">✓</div>
                <span>Safe & Secure Transactions</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">✓</div>
                <span>Environmentally Friendly</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">✓</div>
                <span>Community-Driven Platform</span>
              </li>
            </ul>
            <Button className="w-full mt-6 rounded-2xl font-bold" variant="outline">Learn More</Button>
          </div>
        </div>
      </div>

      {book && (
        <BuyDialog
          open={buyOpen}
          onOpenChange={setBuyOpen}
          book={{ 
            id: book._id, 
            title: book.title, 
            author: book.author, 
            price: book.price, 
            sellerId: book.user?._id 
          }}
        />
      )}
    </div>
  );
}
