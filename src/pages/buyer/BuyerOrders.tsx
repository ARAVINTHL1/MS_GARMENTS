import { useProducts } from '@/context/ProductContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BuyerOrders = () => {
  const { orders } = useProducts();
  const { user } = useAuth();

  const myOrders = orders.filter(o => o.buyerId === user?.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">My Orders</h1>
        <p className="text-muted-foreground font-body mt-1">Track your order history and status</p>
      </div>

      {/* Contact Support Banner */}
      {myOrders.length > 0 && (
        <Card className="shadow-card bg-secondary/5 border-secondary/20">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-secondary shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-medium font-body text-foreground">Need help with your order?</p>
                  <p className="text-xs text-muted-foreground font-body mt-0.5">Contact us at 96778-05533 / 86088-85389</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="font-body" onClick={() => window.open('tel:9677805533')}>
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {myOrders.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="py-16 text-center">
            <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-lg text-foreground">No orders yet</h3>
            <p className="text-sm text-muted-foreground font-body mt-1">Browse products and place your first order!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {myOrders.map((order) => (
            <Card key={order.id} className="shadow-card">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-display font-semibold text-foreground">{order.id}</h3>
                      <Badge variant={
                        order.status === 'delivered' ? 'default' :
                        order.status === 'shipped' ? 'secondary' : 'outline'
                      } className="font-body capitalize">
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground font-body">Placed: {order.createdAt}</p>
                    <div className="mt-2 space-y-1">
                      {order.products.map((item, i) => (
                        <p key={i} className="text-sm font-body text-foreground">
                          {item.productName} × {item.quantity} @ ₹{item.price}
                        </p>
                      ))}
                    </div>
                  </div>
                  <p className="text-2xl font-display font-bold text-foreground">₹{order.total.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyerOrders;
