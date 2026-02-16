import { useState } from 'react';
import { useProducts } from '@/context/ProductContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Package, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const CATEGORIES = ['Leggins', 'Pattiyala', 'Laicra', 'Ankle Fit', 'Shimmer', 'Woolen', 'Other'];

const AdminProducts = () => {
  const { products, addProduct, deleteProduct } = useProducts();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', category: '', fabric: '', price: '', stock: '', minOrder: '', image: '', description: '' });

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      name: form.name,
      category: form.category,
      fabric: form.fabric,
      price: Number(form.price),
      stock: Number(form.stock),
      minOrder: Number(form.minOrder),
      image: form.image || 'https://images.unsplash.com/photo-1558769132-cb1aea1c8175?w=400',
      description: form.description,
    });
    setForm({ name: '', category: '', fabric: '', price: '', stock: '', minOrder: '', image: '', description: '' });
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground font-body mt-1">Manage your textile product catalog</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-body">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display">Add New Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label>Product Name</Label>
                  <Input placeholder="e.g., Premium Cotton Fabric" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Fabric Type</Label>
                  <Input placeholder="e.g., 100% Cotton" value={form.fabric} onChange={(e) => setForm({ ...form, fabric: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Price (₹/unit)</Label>
                  <Input type="number" placeholder="185" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Stock Qty</Label>
                  <Input type="number" placeholder="2500" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Min Order Qty</Label>
                  <Input type="number" placeholder="50" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })} required />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Image URL</Label>
                  <Input type="url" placeholder="https://example.com/image.jpg" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Product description..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-body">Add Product</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search products..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="shadow-card hover:shadow-elevated transition-all duration-200 overflow-hidden">
            {/* Product Image */}
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
              <div className="absolute top-2 right-2">
                <Button variant="destructive" size="icon" onClick={() => deleteProduct(product.id)} className="h-8 w-8 shadow-lg">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base font-display">{product.name}</CardTitle>
                  <Badge variant="secondary" className="mt-1 text-xs font-body">{product.category}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground font-body mb-3 line-clamp-2">{product.description}</p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2 rounded bg-muted/50">
                  <p className="text-lg font-bold font-display text-foreground">₹{product.price}</p>
                  <p className="text-xs text-muted-foreground font-body">Price</p>
                </div>
                <div className="p-2 rounded bg-muted/50">
                  <p className={`text-lg font-bold font-display ${product.stock < 700 ? 'text-destructive' : 'text-foreground'}`}>{product.stock}</p>
                  <p className="text-xs text-muted-foreground font-body">Stock</p>
                </div>
                <div className="p-2 rounded bg-muted/50">
                  <p className="text-lg font-bold font-display text-foreground">{product.minOrder}</p>
                  <p className="text-xs text-muted-foreground font-body">Min Qty</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;
