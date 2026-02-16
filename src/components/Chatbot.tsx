import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
}

const FAQ: { keywords: string[]; answer: string }[] = [
  { keywords: ['minimum', 'min', 'moq', 'order quantity'], answer: 'The minimum order quantity is 50 units per product. For bulk orders above 500 units, special discounts are available.' },
  { keywords: ['delivery', 'shipping', 'ship', 'deliver', 'time'], answer: 'Standard delivery takes 5-7 business days within Tamil Nadu. For other states, delivery takes 7-12 business days. Express delivery is available at additional cost.' },
  { keywords: ['payment', 'pay', 'upi', 'bank'], answer: 'We accept UPI, bank transfer (NEFT/RTGS), and cash on delivery for orders within Erode. Payment terms: 50% advance, 50% before dispatch.' },
  { keywords: ['return', 'exchange', 'refund'], answer: 'Returns accepted within 7 days for manufacturing defects only. Products must be unused and in original packaging. No refund on custom orders.' },
  { keywords: ['price', 'cost', 'rate', 'wholesale'], answer: 'All our prices are wholesale rates. Prices vary by product type and quantity. Check our product catalog for current pricing. Bulk discounts available for orders above ₹50,000.' },
  { keywords: ['contact', 'phone', 'call', 'number', 'reach'], answer: '📞 Call us: 96778-05533 / 86088-85389\n📍 Visit: 24/181, PTS Complex, 1st Floor, Sai Southern (opp) Brinda Street, Erode - 638 001' },
  { keywords: ['product', 'sell', 'available', 'stock', 'item', 'what'], answer: 'We specialize in wholesale garments: Leggins, Pattiyala 4way, Laicra, and Ankle Fit products. All available in multiple colors and sizes.' },
  { keywords: ['size', 'sizes', 'measurement'], answer: 'We carry sizes from S to 3XL. Free size options also available for leggings and pattiyala. Custom sizing available for bulk orders above 200 units.' },
  { keywords: ['color', 'colour', 'colors'], answer: 'We offer 15+ color options including all popular shades. Custom color matching available for orders above 300 units.' },
  { keywords: ['discount', 'offer', 'deal'], answer: 'Bulk discounts: 5% off on orders above ₹25,000, 10% off above ₹50,000, 15% off above ₹1,00,000. Festival season special offers available.' },
  { keywords: ['hello', 'hi', 'hey', 'vanakkam', 'good'], answer: 'Vanakkam! 🙏 Welcome to M.S. Garments. How can I help you today? You can ask about products, pricing, delivery, or minimum order quantities.' },
  { keywords: ['thank', 'thanks', 'ok', 'bye'], answer: 'Thank you for reaching out! 🙏 If you have more questions, feel free to ask. Happy to help!' },
];

function getBotResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const faq of FAQ) {
    if (faq.keywords.some(k => lower.includes(k))) {
      return faq.answer;
    }
  }
  return "I'm sorry, I didn't understand that. You can ask about:\n• Minimum order quantity\n• Delivery & shipping\n• Payment options\n• Products & sizes\n• Pricing & discounts\n• Contact info\n\nOr call us at 96778-05533 for direct assistance!";
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'bot', content: 'Vanakkam! 🙏 Welcome to M.S. Garments. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { role: 'user', content: input };
    const botResponse = getBotResponse(input);
    setMessages(prev => [...prev, userMsg, { role: 'bot', content: botResponse }]);
    setInput('');
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-gold flex items-center justify-center shadow-elevated hover:scale-105 transition-transform"
      >
        {isOpen ? <X className="h-6 w-6 text-secondary-foreground" /> : <MessageCircle className="h-6 w-6 text-secondary-foreground" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[480px] bg-card rounded-xl shadow-elevated border border-border flex flex-col overflow-hidden">
          {/* Header */}
          <div className="gradient-hero p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-secondary/20 flex items-center justify-center">
              <Bot className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h3 className="text-sm font-display font-semibold text-primary-foreground">M.S. Garments Support</h3>
              <p className="text-xs text-primary-foreground/60 font-body">Online • Usually replies instantly</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div className={`max-w-[75%] px-3 py-2 rounded-xl text-sm font-body whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                    : 'bg-muted text-foreground rounded-bl-sm'
                }`}>
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
                className="text-sm"
              />
              <Button type="submit" size="icon" className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
