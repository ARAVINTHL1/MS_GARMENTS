import { Outlet } from 'react-router-dom';
import { BuyerNavbar } from '@/components/BuyerNavbar';
import { Chatbot } from '@/components/Chatbot';
import { Phone, MapPin, Mail } from 'lucide-react';

const BuyerLayout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <BuyerNavbar />
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="border-t border-sidebar-border gradient-hero mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About */}
            <div>
              <h3 className="font-display font-semibold text-sidebar-foreground mb-3">M.S. Garments</h3>
              <p className="text-sm text-sidebar-foreground/70 font-body mb-2">
                Your trusted wholesale partner for quality textile products since years.
              </p>
              <p className="text-sm text-secondary font-body font-medium">
                Only Wholesale • Minimum 50 Units
              </p>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-display font-semibold text-sidebar-foreground mb-3">Contact Us</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm font-body">
                  <Phone className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                  <div className="text-sidebar-foreground/70">
                    <p>96778-05533</p>
                    <p>86088-85389</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm font-body">
                  <MapPin className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                  <p className="text-sidebar-foreground/70">
                    24/181, PTS Complex, 1st Floor<br />
                    Sai Southern, Erode - 638 001
                  </p>
                </div>
              </div>
            </div>

            {/* Products */}
            <div>
              <h3 className="font-display font-semibold text-sidebar-foreground mb-3">Our Products</h3>
              <ul className="space-y-1 text-sm text-sidebar-foreground/70 font-body">
                <li>• Cotton Leggings</li>
                <li>• Pattiyala 4way</li>
                <li>• Laicra Churidar</li>
                <li>• Ankle Fit Leggings</li>
                <li>• Shimmer & Woolen Varieties</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-sidebar-border mt-8 pt-6 text-center text-sm text-sidebar-foreground/60 font-body">
            <p>&copy; {new Date().getFullYear()} M.S. Garments. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      <Chatbot />
    </div>
  );
};

export default BuyerLayout;
