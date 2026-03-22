import { useState, useEffect } from "react";
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
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [form, setForm] = useState({
    address_line: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  // --- AUTO-SUGGEST CITY & STATE LOGIC ---
  useEffect(() => {
    const fetchLocation = async () => {
      if (form.pincode.length === 6) {
        setFetchingLocation(true);
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${form.pincode}`);
          const data = await res.json();

          if (data[0].Status === "Success") {
            const details = data[0].PostOffice[0];
            setForm((prev) => ({
              ...prev,
              city: details.District,
              state: details.State,
            }));
            toast({ 
                title: "Location Updated", 
                description: `${details.District}, ${details.State}` 
            });
          } else {
            toast({ 
                title: "Invalid Pincode", 
                description: "Could not find details for this pincode.", 
                variant: "destructive" 
            });
          }
        } catch (error) {
          console.error("Pincode API Error:", error);
        } finally {
          setFetchingLocation(false);
        }
      }
    };

    fetchLocation();
  }, [form.pincode, toast]);

  const handleChange = (field: string, value: string) => {
    if (field === "phone") {
      const cleaned = value.replace(/\D/g, "").slice(0, 10);
      setForm((prev) => ({ ...prev, [field]: cleaned }));
      return;
    }
    if (field === "pincode") {
      const cleaned = value.replace(/\D/g, "").slice(0, 6);
      setForm((prev) => ({ ...prev, [field]: cleaned }));
      return;
    }
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
        ...form
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

    if (!form.address_line || !form.city || !form.state || form.pincode.length !== 6 || form.phone.length !== 10) {
      toast({ 
        title: "Missing Information", 
        description: "Please ensure address, 6-digit pincode, and 10-digit phone are correct.", 
        variant: "destructive" 
      });
      return;
    }

    setSubmitting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      if (paymentMethod === "online") {
        const resScript = await loadRazorpayScript();
        if (!resScript) throw new Error("Razorpay SDK failed to load");

        const orderRes = await fetch(`${apiUrl}/payments/order`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-clerk-id": user.id },
          body: JSON.stringify({ amount: book.price || 0 }),
        });

        const orderData = await orderRes.json();

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "BookBazzar",
          order_id: orderData.id,
          handler: async function (response: any) {
            const verifyRes = await fetch(`${apiUrl}/payments/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json", "x-clerk-id": user.id },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              await createTransaction();
              toast({ title: "Order Placed! ✅" });
              onOpenChange(false);
              setForm({ address_line: "", city: "", state: "", pincode: "", phone: "" });
            }
            setSubmitting(false);
          },
          prefill: { contact: form.phone },
          modal: { ondismiss: () => setSubmitting(false) }
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();
      } else {
        await createTransaction();
        toast({ title: "Order Placed! ✅" });
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
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm text-foreground">Delivery Address</span>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <Label className="text-xs text-muted-foreground">Pincode</Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="6 digits"
                  value={form.pincode}
                  onChange={(e) => handleChange("pincode", e.target.value)}
                  className="rounded-xl pr-8"
                />
                {fetchingLocation && (
                    <Loader2 className="absolute right-2 bottom-2.5 h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Phone</Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="10 digits"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">State</Label>
                <Input
                  value={form.state}
                  readOnly
                  placeholder="Auto-filled"
                  className="rounded-xl bg-muted/50 cursor-not-allowed"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">City</Label>
                <Input
                  value={form.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="City"
                  className="rounded-xl"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Address Line</Label>
              <Input
                placeholder="Hostel, Street, Area..."
                value={form.address_line}
                onChange={(e) => handleChange("address_line", e.target.value)}
                className="rounded-xl"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3 mt-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm text-foreground">Payment Method</span>
            </div>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-2 gap-3">
              <label className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-all ${paymentMethod === "cash" ? "border-primary bg-accent" : "border-border"}`}>
                <RadioGroupItem value="cash" />
                <Banknote className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Cash</span>
              </label>
              <label className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-all ${paymentMethod === "online" ? "border-primary bg-accent" : "border-border"}`}>
                <RadioGroupItem value="online" />
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Online</span>
              </label>
            </RadioGroup>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={submitting || fetchingLocation}
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