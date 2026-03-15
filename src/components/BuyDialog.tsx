import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MapPin, CreditCard, Banknote, Loader2 } from "lucide-react";
import { loadRazorpayScript } from "@/lib/razorpay";

interface BuyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book: {
    id: string;
    title: string;
    author: string;
    price: number | null;
    sellerId: string;
  };
}

const BuyDialog = ({ open, onOpenChange, book }: BuyDialogProps) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [form, setForm] = useState({
    address_line: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const createTransaction = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const res = await fetch(`${apiUrl}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-clerk-id": user?.id || "",
      },
      body: JSON.stringify({
        bookId: book.id,
        sellerId: book.sellerId,
        type: "purchase",
        paymentMethod,
        address_line: form.address_line,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        phone: form.phone,
      }),
    });

    if (!res.ok) throw new Error("Failed to place order");
    return res.json();
  };

  const handleSubmit = async () => {
    if (!isLoaded || !isSignedIn || !user) {
      router.push("/sign-in");
      return;
    }

    if (!form.address_line || !form.city || !form.state || !form.pincode || !form.phone) {
      toast({ title: "Missing fields", description: "Please fill all address fields.", variant: "destructive" });
      return;
    }

    setSubmitting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      if (paymentMethod === "online") {
        const resScript = await loadRazorpayScript();

        if (!resScript) {
          toast({ title: "Razorpay SDK failed to load", variant: "destructive" });
          setSubmitting(false);
          return;
        }

        // Create Order on Backend
        const orderRes = await fetch(`${apiUrl}/payments/order`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "x-clerk-id": user.id 
          },
          body: JSON.stringify({ amount: book.price || 0 }),
        });

        if (!orderRes.ok) {
          const errorData = await orderRes.json();
          throw new Error(errorData.message || "Failed to create Razorpay order");
        }

        const orderData = await orderRes.json();

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_SOmxxpTgaLdsdy",
          amount: orderData.amount,
          currency: orderData.currency,
          name: "BookBazzar",
          description: `Payment for "${book.title}"`,
          order_id: orderData.id,
          handler: async function (response: any) {
            // Verify Payment on Backend
            const verifyRes = await fetch(`${apiUrl}/payments/verify`, {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
                "x-clerk-id": user.id 
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              await createTransaction();
              toast({ title: "Order Placed! ✅", description: "Payment successful and seller notified." });
              onOpenChange(false);
              setForm({ address_line: "", city: "", state: "", pincode: "", phone: "" });
            } else {
              toast({ title: "Payment Verification Failed", variant: "destructive" });
            }
            setSubmitting(false);
          },
          prefill: {
            name: user.fullName || "",
            email: user.primaryEmailAddress?.emailAddress || "",
            contact: form.phone,
          },
          theme: { color: "#3b82f6" },
          modal: {
            ondismiss: function() {
              setSubmitting(false);
            }
          }
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();
      } else {
        // Cash on Delivery
        await createTransaction();
        toast({ title: "Order Placed! ✅", description: "The seller has been notified. You'll hear back soon." });
        onOpenChange(false);
        setForm({ address_line: "", city: "", state: "", pincode: "", phone: "" });
        setSubmitting(false);
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Buy "{book.title}"</DialogTitle>
          <p className="text-sm text-muted-foreground">by {book.author} · ₹{book.price}</p>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm text-foreground">Delivery Address</span>
            </div>
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">Address Line</Label>
                <Input
                  placeholder="Hostel name, Room no..."
                  value={form.address_line}
                  onChange={(e) => handleChange("address_line", e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">City</Label>
                  <Input
                    placeholder="City"
                    value={form.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">State</Label>
                  <Input
                    placeholder="State"
                    value={form.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Pincode</Label>
                  <Input
                    placeholder="Pincode"
                    value={form.pincode}
                    onChange={(e) => handleChange("pincode", e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Phone</Label>
                  <Input
                    placeholder="Phone number"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm text-foreground">Payment Method</span>
            </div>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-all ${
                  paymentMethod === "cash" ? "border-primary bg-accent" : "border-border"
                }`}
              >
                <RadioGroupItem value="cash" />
                <Banknote className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Cash</span>
              </label>
              <label
                className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-all ${
                  paymentMethod === "online" ? "border-primary bg-accent" : "border-border"
                }`}
              >
                <RadioGroupItem value="online" />
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Online</span>
              </label>
            </RadioGroup>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full rounded-full bg-primary text-primary-foreground font-semibold"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Place Order"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BuyDialog;
