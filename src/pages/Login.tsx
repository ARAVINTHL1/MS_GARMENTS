import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldCheck, ShoppingBag, Store, Phone, MapPin, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Login = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('admin');
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password, role);
      if (result.success) {
        navigate(role === 'admin' ? '/admin' : '/buyer');
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signup(name, email, password, phone, address);
      if (result.success) {
        navigate('/buyer');
      } else {
        setError(result.message || 'Signup failed');
      }
    } catch (err) {
      setError('An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full border border-primary-foreground/20" />
          <div className="absolute bottom-32 right-16 w-96 h-96 rounded-full border border-primary-foreground/10" />
        </div>
        <div className="relative z-10 text-center max-w-lg">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Store className="h-10 w-10 text-secondary" />
            <h1 className="text-5xl font-display font-bold text-primary-foreground">
              M.S. <span className="text-gradient-gold">Garments</span>
            </h1>
          </div>
          <p className="text-lg text-primary-foreground/80 font-body leading-relaxed">
            Only Wholesale
          </p>
          <p className="text-base text-primary-foreground/60 font-body mt-2">
            Leggin • Pattiyala 4way • Laicra • Ankle Fit
          </p>

          <div className="mt-10 space-y-3 text-left bg-primary-foreground/5 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-start gap-3 text-primary-foreground/70">
              <MapPin className="h-5 w-5 mt-0.5 text-secondary shrink-0" />
              <div className="text-sm font-body">
                <p className="font-medium text-primary-foreground/90">24/181, PTS Complex, 1st Floor</p>
                <p>Sai Southern (opp) Brinda Street</p>
                <p>Erode - 638 001</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-primary-foreground/70">
              <Phone className="h-5 w-5 text-secondary shrink-0" />
              <div className="text-sm font-body">
                <p>96778-05533 / 86088-85389</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex flex-col items-center gap-2 mb-8">
            <div className="flex items-center gap-2">
              <Store className="h-7 w-7 text-secondary" />
              <h1 className="text-3xl font-display font-bold text-foreground">
                M.S. <span className="text-secondary">Garments</span>
              </h1>
            </div>
            <p className="text-sm text-muted-foreground font-body">Only Wholesale • Erode</p>
          </div>

          <Card className="shadow-elevated border-border/50">
            <CardHeader className="text-center pb-2">
              <h2 className="text-2xl font-display font-semibold text-foreground">
                {isSignup ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-sm text-muted-foreground font-body">
                {isSignup ? 'Sign up as a buyer' : 'Sign in to your account'}
              </p>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {!isSignup ? (
                <>
                  <Tabs defaultValue="admin" onValueChange={(v) => setRole(v as UserRole)} className="mb-6">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="admin" className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        Admin
                      </TabsTrigger>
                      <TabsTrigger value="buyer" className="flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4" />
                        Buyer
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="admin">
                      <p className="text-xs text-muted-foreground mb-4">
                        Manage products, orders & view business analytics.
                      </p>
                    </TabsContent>
                    <TabsContent value="buyer">
                      <p className="text-xs text-muted-foreground mb-4">
                        Browse wholesale products, place orders & chat with support.
                      </p>
                    </TabsContent>
                  </Tabs>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder={role === 'admin' ? 'mohanms@gmail.com' : 'buyer@msgarments.com'}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-body font-semibold"
                      disabled={loading}
                    >
                      {loading ? 'Signing in...' : `Sign In as ${role === 'admin' ? 'Admin' : 'Buyer'}`}
                    </Button>
                  </form>

                  <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setIsSignup(true);
                          setError('');
                          setRole('buyer');
                        }}
                        className="text-primary hover:underline font-semibold"
                      >
                        Sign up as Buyer
                      </button>
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Name</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-phone">Phone (Optional)</Label>
                      <Input
                        id="signup-phone"
                        type="tel"
                        placeholder="Your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-address">Address (Optional)</Label>
                      <Input
                        id="signup-address"
                        type="text"
                        placeholder="Your address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-body font-semibold"
                      disabled={loading}
                    >
                      {loading ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                  </form>

                  <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setIsSignup(false);
                          setError('');
                        }}
                        className="text-primary hover:underline font-semibold"
                      >
                        Sign in
                      </button>
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
