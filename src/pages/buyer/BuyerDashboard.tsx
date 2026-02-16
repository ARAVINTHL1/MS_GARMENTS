import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/context/ProductContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, ShoppingCart, IndianRupee, User, Phone, MapPin, Mail, ShoppingBag, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

const BuyerDashboard = () => {
  const { user } = useAuth();
  const { products, orders } = useProducts();
  
  // Filter orders for current user
  const myOrders = orders.filter(o => o.buyerId === user?.id);
  const totalSpent = myOrders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = myOrders.filter(o => o.status === 'pending').length;

  // Group products by category
  const categories = Array.from(new Set(products.map(p => p.category)));

  // Featured products for carousel (top 4 products)
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="gradient-hero rounded-lg p-8 text-sidebar-foreground">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Welcome back, {user?.name || 'Buyer'}!</h1>
            <p className="text-sidebar-foreground/80 font-body mt-2 text-lg">
              M.S. Garments — Your Trusted Wholesale Partner
            </p>
            <div className="flex items-center gap-2 mt-3 text-sidebar-foreground/70">
              <Mail className="h-4 w-4" />
              <span className="font-body">{user?.email}</span>
            </div>
          </div>
          <div className="bg-white/10 p-4 rounded-lg">
            <User className="h-12 w-12 text-secondary" />
          </div>
        </div>
      </div>

      {/* Featured Products Carousel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-secondary" />
            Featured Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 3000,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent>
              {featuredProducts.map((product) => (
                <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="border-2 hover:border-secondary transition-colors">
                      <CardContent className="p-4">
                        <div className="relative aspect-square mb-3 rounded-lg overflow-hidden bg-muted">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.src = `https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=400&fit=crop`;
                            }}
                          />
                          <div className="absolute top-2 right-2 bg-secondary text-white px-2 py-1 rounded text-xs font-semibold">
                            ₹{product.price}
                          </div>
                        </div>
                        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize mb-2">
                          {product.category} • {product.fabric}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Min: {product.minOrder} units
                          </span>
                          <span className="text-xs font-semibold text-green-600">
                            {product.stock} in stock
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">My Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myOrders.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {pendingOrders} pending orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalSpent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {myOrders.length} orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {categories.length} categories
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Shop Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-secondary" />
            About M.S. Garments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground font-body">
            Welcome to M.S. Garments, your trusted wholesale partner for quality textile products. 
            We specialize in providing premium leggings, churidars, and traditional wear at wholesale prices.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <MapPin className="h-4 w-4 text-secondary" />
                Our Location
              </h3>
              <p className="text-sm text-muted-foreground pl-6">
                24/181, PTS Complex, 1st Floor<br />
                Sai Southern, Erode - 638 001
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Phone className="h-4 w-4 text-secondary" />
                Contact Us
              </h3>
              <div className="text-sm text-muted-foreground pl-6">
                <p>96778-05533</p>
                <p>86088-85389</p>
              </div>
            </div>
          </div>

          <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4 mt-4">
            <p className="text-sm font-semibold text-foreground">
              🏪 Wholesale Only • Minimum Order: 50 Units
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              We offer competitive wholesale pricing for bulk orders. Contact us for special discounts on large quantities.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Product Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-secondary" />
            Our Product Range
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((category) => {
              const categoryProducts = products.filter(p => p.category === category);
              return (
                <div key={category} className="border rounded-lg p-4 hover:border-secondary transition-colors">
                  <h3 className="font-semibold capitalize">{category}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {categoryProducts.length} {categoryProducts.length === 1 ? 'product' : 'products'}
                  </p>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 flex justify-center">
            <Link to="/buyer/products">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90">
                <Package className="h-4 w-4 mr-2" />
                Browse All Products
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      {myOrders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-secondary" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myOrders.slice(0, 3).map((order) => (
                <div key={order.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div>
                    <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.products.length} {order.products.length === 1 ? 'item' : 'items'} • {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{order.total.toLocaleString()}</p>
                    <p className={`text-xs ${
                      order.status === 'delivered' ? 'text-green-600' : 
                      order.status === 'pending' ? 'text-yellow-600' : 'text-blue-600'
                    }`}>
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {myOrders.length > 3 && (
              <div className="mt-4 text-center">
                <Link to="/buyer/orders">
                  <Button variant="outline" size="sm">
                    View All Orders
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Empty State for No Orders */}
      {myOrders.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
            <p className="text-muted-foreground mb-6">
              Start shopping to place your first wholesale order!
            </p>
            <Link to="/buyer/products">
              <Button className="bg-secondary hover:bg-secondary/90">
                Start Shopping
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BuyerDashboard;
