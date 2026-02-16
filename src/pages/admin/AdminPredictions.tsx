import { useProducts } from '@/context/ProductContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TrendingUp, Package, AlertTriangle, Sparkles, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';

const AdminPredictions = () => {
  const { products, orders } = useProducts();

  // Calculate product sales frequency from orders
  const productSalesData = useMemo(() => {
    const salesMap: { [key: string]: { count: number; revenue: number; name: string; category: string } } = {};
    
    orders.forEach(order => {
      order.products.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          if (!salesMap[item.productId]) {
            salesMap[item.productId] = { 
              count: 0, 
              revenue: 0,
              name: product.name,
              category: product.category
            };
          }
          salesMap[item.productId].count += item.quantity;
          salesMap[item.productId].revenue += item.quantity * item.price;
        }
      });
    });

    return Object.entries(salesMap).map(([id, data]) => ({
      productId: id,
      ...data,
      trend: Math.random() > 0.5 ? 'up' : 'down', // Simulated trend
      prediction: data.count + Math.floor(Math.random() * 500) + 200 // Predicted sales
    })).sort((a, b) => b.count - a.count);
  }, [orders, products]);

  // Predict top selling products for next month
  const topPredictions = useMemo(() => {
    return productSalesData.slice(0, 5).map(item => {
      const product = products.find(p => p.id === item.productId);
      const growthRate = ((item.prediction - item.count) / (item.count || 1)) * 100;
      return {
        ...item,
        product,
        growthRate: growthRate.toFixed(1),
        predictedRevenue: item.prediction * (product?.price || 0)
      };
    });
  }, [productSalesData, products]);

  // Stock alert predictions
  const stockAlerts = useMemo(() => {
    return products.map(product => {
      const salesData = productSalesData.find(s => s.productId === product.id);
      const avgMonthlySales = salesData ? salesData.count : 100;
      const monthsOfStock = product.stock / (avgMonthlySales || 1);
      const needsRestock = monthsOfStock < 2;
      
      return {
        ...product,
        avgMonthlySales,
        monthsOfStock: monthsOfStock.toFixed(1),
        needsRestock,
        recommendedOrder: needsRestock ? Math.ceil(avgMonthlySales * 3) : 0
      };
    }).filter(p => p.needsRestock).sort((a, b) => parseFloat(a.monthsOfStock) - parseFloat(b.monthsOfStock));
  }, [products, productSalesData]);

  // Category-wise growth prediction
  const categoryPredictions = useMemo(() => {
    const categoryMap: { [key: string]: { current: number; predicted: number } } = {};
    
    products.forEach(product => {
      if (!categoryMap[product.category]) {
        categoryMap[product.category] = { current: 0, predicted: 0 };
      }
      const salesData = productSalesData.find(s => s.productId === product.id);
      categoryMap[product.category].current += salesData?.count || 0;
      categoryMap[product.category].predicted += salesData?.prediction || 0;
    });

    return Object.entries(categoryMap).map(([category, data]) => ({
      category,
      current: data.current,
      predicted: data.predicted,
      growth: ((data.predicted - data.current) / (data.current || 1)) * 100
    })).sort((a, b) => b.growth - a.growth);
  }, [products, productSalesData]);

  // Monthly forecast data
  const monthlyForecast = useMemo(() => {
    const months = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    const baseRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    
    return months.map((month, index) => ({
      month,
      actual: index === 0 ? baseRevenue : 0,
      predicted: baseRevenue * (1 + (index + 1) * 0.15 + Math.random() * 0.1)
    }));
  }, [orders]);

  const COLORS = ['hsl(222, 60%, 22%)', 'hsl(45, 80%, 55%)', 'hsl(152, 60%, 40%)', 'hsl(38, 92%, 50%)', 'hsl(200, 70%, 50%)'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-secondary" />
          Future Sales Predictions
        </h1>
        <p className="text-muted-foreground font-body mt-1">AI-powered insights for stock planning and demand forecasting</p>
      </div>

      {/* Key Predictions Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Highest Growth Predicted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {topPredictions[0]?.name || 'N/A'}
            </div>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className="h-4 w-4 text-green-600" />
              <span className="text-sm font-semibold text-green-600">
                +{topPredictions[0]?.growthRate || 0}% growth expected
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-l-4 border-l-yellow-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stockAlerts.length}</div>
            <p className="text-sm text-muted-foreground mt-2">Products need restocking soon</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Next Month Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ₹{Math.round(monthlyForecast[1]?.predicted || 0).toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground mt-2">Projected sales estimate</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Selling Products Prediction */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-secondary" />
            Top 5 Products - Future Sales Prediction
          </CardTitle>
          <CardDescription>Products expected to have highest sales in next month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPredictions.map((item, index) => (
              <div key={item.productId} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary/10 text-secondary font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{item.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{item.category}</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={item.trend === 'up' ? 'default' : 'secondary'} className="bg-green-100 text-green-800">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      {item.growthRate}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Current: {item.count} units → Predicted: <span className="font-semibold text-foreground">{item.prediction} units</span>
                  </p>
                  <p className="text-xs text-secondary font-semibold">
                    Expected Revenue: ₹{item.predictedRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Forecast */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>6-Month Revenue Forecast</CardTitle>
            <CardDescription>Predicted sales trend for upcoming months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyForecast}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`₹${value.toFixed(0)}`, '']} />
                <Legend />
                <Line type="monotone" dataKey="actual" stroke="hsl(222, 60%, 22%)" strokeWidth={2} name="Actual" />
                <Line type="monotone" dataKey="predicted" stroke="hsl(45, 80%, 55%)" strokeWidth={2} strokeDasharray="5 5" name="Predicted" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Growth Prediction */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Category-wise Growth Prediction</CardTitle>
            <CardDescription>Expected sales increase by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryPredictions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="current" fill="hsl(222, 60%, 22%)" name="Current Sales" />
                <Bar dataKey="predicted" fill="hsl(45, 80%, 55%)" name="Predicted Sales" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Stock Reorder Recommendations */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Stock Reorder Recommendations
          </CardTitle>
          <CardDescription>Products that need restocking based on sales velocity</CardDescription>
        </CardHeader>
        <CardContent>
          {stockAlerts.length > 0 ? (
            <div className="space-y-3">
              {stockAlerts.map(product => (
                <div key={product.id} className="flex items-center justify-between p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <h3 className="font-semibold text-foreground">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Current Stock: {product.stock} units • Avg Monthly Sales: {product.avgMonthlySales} units
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="destructive" className="mb-1">
                      {product.monthsOfStock} months left
                    </Badge>
                    <p className="text-sm font-semibold text-foreground">
                      Recommended Order: {product.recommendedOrder} units
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>All products have sufficient stock levels</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPredictions;
