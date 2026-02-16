import { useState } from 'react';
import { useProducts } from '@/context/ProductContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, ShoppingCart, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const BuyerProducts = () => {
  const { products, placeOrder } = useProducts();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [qty, setQty] = useState('');

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleOrder = () => {
    if (!selectedProduct || !user) return;
    const quantity = Number(qty);
    if (quantity < selectedProduct.minOrder) {
      toast.error(`Minimum order quantity is ${selectedProduct.minOrder} units`);
      return;
    }
    if (quantity > selectedProduct.stock) {
      toast.error('Insufficient stock');
      return;
    }
    placeOrder({
      buyerId: user.id,
      buyerName: user.name,
      products: [{
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        quantity,
        price: selectedProduct.price,
      }],
      total: quantity * selectedProduct.price,
    });
    toast.success('Order placed successfully!');
    setSelectedProduct(null);
    setQty('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground font-body mt-1">Browse our textile catalog and place orders</p>
        </div>
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search products..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="shadow-card hover:shadow-elevated transition-all duration-200 overflow-hidden">
            <div className="relative h-48 w-full overflow-hidden bg-muted">
              <img 
                src={product.image || 'https://images.unsplash.com/photo-1558769132-cb1aea1c8175?w=400'} 
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1558769132-cb1aea1c8175?w=400';
                }}
              />
              <Badge className="absolute top-3 right-3 bg-secondary text-secondary-foreground font-body shadow-lg">{product.category}</Badge>
            </div>
            <CardContent className="p-5">
              <h3 className="font-display font-semibold text-foreground text-lg">{product.name}</h3>
              <p className="text-xs text-muted-foreground font-body mt-1 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between mt-4">
                <div>
                  <p className="text-2xl font-display font-bold text-foreground">₹{product.price}</p>
                  <p className="text-xs text-muted-foreground font-body">per unit • Min: {product.minOrder}</p>
                </div>
                <Button
                  onClick={() => { setSelectedProduct(product); setQty(String(product.minOrder)); }}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-body"
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Order
                </Button>
              </div>
              {product.stock < 700 && (
                <p className="text-xs text-destructive mt-2 font-body">⚠ Limited stock available</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Place Order</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="relative h-48 w-full overflow-hidden rounded-lg bg-muted">
                <img 
                  src={selectedProduct.image || 'https://images.unsplash.com/photo-1558769132-cb1aea1c8175?w=400'} 
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1558769132-cb1aea1c8175?w=400';
                  }}
                />
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <h3 className="font-display font-semibold text-foreground">{selectedProduct.name}</h3>
                <p className="text-sm text-muted-foreground font-body">₹{selectedProduct.price}/unit • Stock: {selectedProduct.stock}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium font-body text-foreground">Quantity (min: {selectedProduct.minOrder})</label>
                <Input type="number" value={qty} onChange={(e) => setQty(e.target.value)} min={selectedProduct.minOrder} max={selectedProduct.stock} />
              </div>
              {qty && Number(qty) >= selectedProduct.minOrder && (
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground">Total Amount</span>
                    <span className="font-bold text-foreground text-lg">₹{(Number(qty) * selectedProduct.price).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-secondary">
                    <Sparkles className="h-3 w-3" />
                    <span className="font-body">ML Suggested Price: ₹{Math.round(selectedProduct.price * 1.05)}/unit</span>
                  </div>
                </div>
              )}
              <Button onClick={handleOrder} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-body font-semibold">
                Confirm Order
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BuyerProducts;
