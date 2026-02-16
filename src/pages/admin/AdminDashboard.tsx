import { StatsCard } from '@/components/StatsCard';
import { useProducts } from '@/context/ProductContext';
import { Package, ShoppingCart, IndianRupee, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useMemo } from 'react';

const AdminDashboard = () => {
  const { products, orders } = useProducts();
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  // Calculate unique buyers
  const uniqueBuyers = useMemo(() => {
    const buyerIds = new Set(orders.map(o => o.buyerId));
    return buyerIds.size;
  }, [orders]);

  // Calculate monthly revenue from actual orders
  const salesData = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData: { [key: string]: number } = {};
    
    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      monthlyData[monthYear] = (monthlyData[monthYear] || 0) + order.total;
    });

    // Get last 6 months of data
    const result = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      result.push({
        month: monthNames[d.getMonth()],
        revenue: monthlyData[key] || 0
      });
    }
    
    return result;
  }, [orders]);

  // Calculate sales by category from actual products
  const categoryData = useMemo(() => {
    const categoryCounts: { [key: string]: number } = {};
    let total = 0;
    
    products.forEach(product => {
      categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
      total++;
    });

    const colors = [
      'hsl(222, 60%, 22%)',
      'hsl(45, 80%, 55%)',
      'hsl(152, 60%, 40%)',
      'hsl(38, 92%, 50%)',
      'hsl(200, 70%, 50%)',
      'hsl(280, 60%, 50%)',
    ];

    return Object.entries(categoryCounts).map(([name, count], index) => ({
      name,
      value: Math.round((count / total) * 100),
      fill: colors[index % colors.length]
    }));
  }, [products]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground font-body mt-1">M.S. Garments — Business Overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard title="Total Products" value={String(products.length)} change={`${products.length} items in catalog`} changeType="positive" icon={Package} />
        <StatsCard title="Total Orders" value={String(orders.length)} change={`${orders.filter(o => o.status === 'pending').length} pending`} changeType="positive" icon={ShoppingCart} />
        <StatsCard title="Revenue" value={`₹${(totalRevenue / 1000).toFixed(1)}K`} change={`from ${orders.length} orders`} changeType="positive" icon={IndianRupee} />
        <StatsCard title="Active Buyers" value={String(uniqueBuyers)} change={`${uniqueBuyers} unique customers`} changeType="positive" icon={Users} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 88%)" />
                <XAxis dataKey="month" stroke="hsl(220, 10%, 46%)" fontSize={12} />
                <YAxis stroke="hsl(220, 10%, 46%)" fontSize={12} tickFormatter={(v) => `₹${v/1000}K`} />
                <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="hsl(222, 60%, 22%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg">Sales by Category</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={100} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-display text-lg">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm font-medium font-body text-foreground">{order.id}</p>
                  <p className="text-xs text-muted-foreground font-body">{order.buyerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold font-body text-foreground">₹{order.total.toLocaleString()}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-body ${
                    order.status === 'delivered' ? 'bg-success/10 text-success' :
                    order.status === 'shipped' ? 'bg-primary/10 text-primary' :
                    order.status === 'confirmed' ? 'bg-secondary/30 text-secondary-foreground' :
                    'bg-warning/10 text-warning'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
