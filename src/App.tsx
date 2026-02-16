import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ProductProvider } from "@/context/ProductContext";
import Login from "./pages/Login";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminPredictions from "./pages/admin/AdminPredictions";
import BuyerLayout from "./pages/buyer/BuyerLayout";
import BuyerDashboard from "./pages/buyer/BuyerDashboard";
import BuyerProducts from "./pages/buyer/BuyerProducts";
import BuyerOrders from "./pages/buyer/BuyerOrders";
import EmployeeLayout from "./pages/employee/EmployeeLayout";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import EmployeeInventory from "./pages/employee/EmployeeInventory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children, role }: { children: React.ReactNode; role: 'admin' | 'buyer' | 'employee' }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (user?.role !== role) {
    if (user?.role === 'admin') return <Navigate to="/admin" replace />;
    if (user?.role === 'employee') return <Navigate to="/employee" replace />;
    return <Navigate to="/buyer" replace />;
  }
  return <>{children}</>;
}

function AuthRedirect() {
  const { user, isAuthenticated } = useAuth();
  if (isAuthenticated) {
    if (user?.role === 'admin') return <Navigate to="/admin" replace />;
    if (user?.role === 'employee') return <Navigate to="/employee" replace />;
    return <Navigate to="/buyer" replace />;
  }
  return <Login />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <ProductProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AuthRedirect />} />
              <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="predictions" element={<AdminPredictions />} />
              </Route>
              <Route path="/buyer" element={<ProtectedRoute role="buyer"><BuyerLayout /></ProtectedRoute>}>
                <Route index element={<BuyerDashboard />} />
                <Route path="products" element={<BuyerProducts />} />
                <Route path="orders" element={<BuyerOrders />} />
              </Route>
              <Route path="/employee" element={<ProtectedRoute role="employee"><EmployeeLayout /></ProtectedRoute>}>
                <Route index element={<EmployeeDashboard />} />
                <Route path="inventory" element={<EmployeeInventory />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ProductProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
