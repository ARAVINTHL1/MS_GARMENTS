import { useProducts } from '@/context/ProductContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const AdminOrders = () => {
  const { orders, updateOrderStatus } = useProducts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground font-body mt-1">Manage and track all orders</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="shadow-card">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-display font-semibold text-foreground">{order.id}</h3>
                    <Badge variant={
                      order.status === 'delivered' ? 'default' :
                      order.status === 'shipped' ? 'secondary' : 'outline'
                    } className="font-body capitalize">
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground font-body">Buyer: {order.buyerName}</p>
                  <p className="text-sm text-muted-foreground font-body">Date: {order.createdAt}</p>
                  <div className="mt-2 space-y-1">
                    {order.products.map((item, i) => (
                      <p key={i} className="text-sm font-body text-foreground">
                        {item.productName} × {item.quantity} @ ₹{item.price}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="text-right space-y-3">
                  <p className="text-2xl font-display font-bold text-foreground">₹{order.total.toLocaleString()}</p>
                  <Select value={order.status} onValueChange={(v) => updateOrderStatus(order.id, v as any)}>
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;
