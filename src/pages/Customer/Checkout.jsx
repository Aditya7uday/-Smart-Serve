import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import { useToast } from '../../components/Toast';
import { orderService } from '../../services/menuService';
import { paymentService } from '../../services/paymentService';
import { FormInput } from '../../components/FormInput';
import { EmptyState } from '../../components/EmptyState';
import { ShoppingCart, CheckCircle2, Loader2, ChevronRight } from 'lucide-react';

const STEPS = ['Review Order', 'Your Details', 'Order Type', 'Payment', 'Confirmation'];

export function Checkout() {
  const { state: cartState, dispatch: cartDispatch } = useCart();
  const { state: authState } = useAuth();
  const { dispatch: orderDispatch } = useOrders();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [orderType, setOrderType] = useState('pickup');
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [paymentError, setPaymentError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [details, setDetails] = useState({ name: authState.user?.name || '', phone: '', address: '' });
  const [detailsErrors, setDetailsErrors] = useState({});

  const DELIVERY_FEE = 20;
  const PLATFORM_FEE = 5;
  const subtotal = cartState.total;
  const total = subtotal + DELIVERY_FEE + PLATFORM_FEE;

  if (cartState.items.length === 0 && step < 4) {
    return (
      <div className="py-12">
        <EmptyState icon={ShoppingCart} title="Your cart is empty" message="Add items first!" actionText="Explore Menu" actionHref="/customer/menu" />
      </div>
    );
  }

  const validateDetails = () => {
    const errs = {};
    if (!details.name.trim()) errs.name = 'Name is required';
    if (!details.phone.trim()) errs.phone = 'Phone is required';
    if (orderType === 'delivery' && !details.address.trim()) errs.address = 'Delivery address is required';
    setDetailsErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const finalizeOrder = async (extraFields) => {
    try {
      const order = await orderService.createOrder({
        customerId: authState.user?.id,
        customerName: authState.user?.name,
        items: cartState.items,
        total,
        type: orderType,
        status: 'Placed',
        ...extraFields,
      });
      setCreatedOrder(order);
      orderDispatch({ type: 'ADD_ORDER', payload: order });
      cartDispatch({ type: 'CLEAR_CART' });
      addToast('Order placed successfully! 🎉', 'success');
      setStep(4);
    } catch (err) {
      addToast(err.message || 'Failed to create order. Please retry.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    setPaymentError('');
    setIsProcessing(true);

    if (paymentMethod === 'cash') {
      await finalizeOrder({ paymentMethod: 'Cash' });
      return;
    }

    try {
      const rpOrder = await paymentService.createRazorpayOrder(total);
      const rzp = new window.Razorpay({
        key: rpOrder.key,
        amount: rpOrder.amount,
        currency: rpOrder.currency,
        order_id: rpOrder.orderId,
        name: 'Smart Serve',
        description: 'Canteen order payment',
        prefill: { name: details.name, contact: details.phone, email: authState.user?.email },
        theme: { color: '#FF7A00' },
        handler: (response) => finalizeOrder({
          paymentMethod: 'Razorpay',
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        }),
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setPaymentError('Payment cancelled.');
          },
        },
      });
      rzp.on('payment.failed', () => {
        setIsProcessing(false);
        setPaymentError('Payment failed. Please try again.');
      });
      rzp.open();
    } catch (err) {
      setIsProcessing(false);
      setPaymentError(err.message || 'Could not start payment. Please retry.');
    }
  };

  const stepClasses = (i) =>
    `flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all ${i < step ? 'bg-success-green text-white' : i === step ? 'bg-primary-orange text-white ring-4 ring-orange-100' : 'bg-gray-100 text-secondary-gray'}`;

  return (
    <div className="py-6 max-w-2xl mx-auto">
      {/* Step Indicator */}
      {step < 4 && (
        <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
          {STEPS.slice(0, 4).map((s, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center gap-1.5 min-w-max">
                <div className={stepClasses(i)}>
                  {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-xs font-medium ${i === step ? 'text-primary-orange' : 'text-secondary-gray'}`}>{s}</span>
              </div>
              {i < 3 && <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-success-green' : 'bg-gray-200'}`} />}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Step 0: Review Order */}
      {step === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-xl text-dark-text mb-4">Review Your Order</h2>
          <div className="space-y-3 mb-6">
            {cartState.items.map(item => (
              <div key={item.id} className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-dark-text">{item.name} × {item.quantity}</p>
                  {item.customizations?.length > 0 && <p className="text-xs text-secondary-gray">{item.customizations.join(', ')}</p>}
                </div>
                <span className="font-semibold text-dark-text">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-secondary-gray"><span>Subtotal</span><span>₹{subtotal}</span></div>
            <div className="flex justify-between text-secondary-gray"><span>Delivery fee</span><span>₹{DELIVERY_FEE}</span></div>
            <div className="flex justify-between text-secondary-gray"><span>Platform fee</span><span>₹{PLATFORM_FEE}</span></div>
            <div className="flex justify-between font-bold text-dark-text text-base pt-1 border-t border-gray-100"><span>Total</span><span>₹{total}</span></div>
          </div>
          <button onClick={() => setStep(1)} className="mt-6 w-full py-3 bg-primary-orange text-white rounded-xl font-bold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
            Continue <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Step 1: Details */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-xl text-dark-text mb-4">Your Details</h2>
          <div className="space-y-4">
            <FormInput label="Full Name" id="checkout-name" value={details.name} onChange={e => setDetails(p => ({ ...p, name: e.target.value }))} error={detailsErrors.name} required />
            <FormInput label="Phone Number" id="checkout-phone" type="tel" value={details.phone} onChange={e => setDetails(p => ({ ...p, phone: e.target.value }))} error={detailsErrors.phone} required />
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep(0)} className="flex-1 py-3 border border-gray-200 text-secondary-gray rounded-xl font-semibold hover:bg-gray-50">Back</button>
            <button onClick={() => { if(validateDetails()) setStep(2); }} className="flex-1 py-3 bg-primary-orange text-white rounded-xl font-bold hover:bg-orange-600 transition-colors">Continue</button>
          </div>
        </div>
      )}

      {/* Step 2: Order Type */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-xl text-dark-text mb-4">How would you like to receive your order?</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {['pickup', 'delivery'].map(type => (
              <label key={type} className={`border-2 rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer transition-all ${orderType === type ? 'border-primary-orange bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="orderType" value={type} checked={orderType === type} onChange={() => setOrderType(type)} className="sr-only" />
                <span className="text-2xl">{type === 'pickup' ? '🏪' : '🚚'}</span>
                <span className={`font-semibold capitalize ${orderType === type ? 'text-primary-orange' : 'text-dark-text'}`}>{type}</span>
                <span className="text-xs text-secondary-gray text-center">{type === 'pickup' ? 'Pick up from canteen counter' : 'Delivered to your location'}</span>
              </label>
            ))}
          </div>
          {orderType === 'delivery' && (
            <FormInput label="Delivery Address" id="checkout-address" value={details.address} onChange={e => setDetails(p => ({ ...p, address: e.target.value }))} error={detailsErrors.address} placeholder="Room no / Block / Hostel name" required />
          )}
          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep(1)} className="flex-1 py-3 border border-gray-200 text-secondary-gray rounded-xl font-semibold hover:bg-gray-50">Back</button>
            <button onClick={() => setStep(3)} className="flex-1 py-3 bg-primary-orange text-white rounded-xl font-bold hover:bg-orange-600">Continue</button>
          </div>
        </div>
      )}

      {/* Step 3: Payment */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-xl text-dark-text mb-2">Payment</h2>
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-2 rounded-lg mb-5">
            🧪 Razorpay Test Mode — use test cards/UPI, no real money is charged.
          </div>
          <div className="space-y-3 mb-6">
            {[
              { id: 'razorpay', label: 'UPI / Card / Netbanking', icon: '💳' },
              { id: 'cash', label: 'Cash at Canteen', icon: '💵' },
            ].map(method => (
              <label key={method.id} className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === method.id ? 'border-primary-orange bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="paymentMethod" value={method.id} checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id)} className="sr-only" />
                <span className="text-2xl">{method.icon}</span>
                <span className={`font-semibold ${paymentMethod === method.id ? 'text-primary-orange' : 'text-dark-text'}`}>{method.label}</span>
                {paymentMethod === method.id && <CheckCircle2 className="w-5 h-5 text-primary-orange ml-auto" />}
              </label>
            ))}
          </div>
          <p className="text-lg font-bold text-dark-text mb-4">Total to pay: ₹{total}</p>
          {paymentError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">{paymentError}</div>
          )}
          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="flex-1 py-3 border border-gray-200 text-secondary-gray rounded-xl font-semibold hover:bg-gray-50" disabled={isProcessing}>Back</button>
            <button onClick={handlePayment} disabled={isProcessing} className="flex-1 py-3 bg-primary-orange text-white rounded-xl font-bold hover:bg-orange-600 transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
              {isProcessing ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : paymentMethod === 'cash' ? 'Place Order' : 'Pay Now'}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && createdOrder && (
        <div className="text-center">
          <div className="w-20 h-20 bg-success-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-success-green" />
          </div>
          <h2 className="text-2xl font-bold text-dark-text mb-2">Order Confirmed!</h2>
          <p className="text-secondary-gray mb-6">Your order has been placed and is being prepared.</p>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-left mb-6">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-secondary-gray">Order ID</span><span className="font-bold text-dark-text">{createdOrder.id}</span></div>
              <div className="flex justify-between"><span className="text-secondary-gray">Order Type</span><span className="font-semibold capitalize text-dark-text">{createdOrder.type}</span></div>
              <div className="flex justify-between"><span className="text-secondary-gray">Payment</span><span className="font-semibold text-dark-text">{paymentMethod.toUpperCase()}</span></div>
              <div className="flex justify-between border-t pt-3"><span className="font-bold text-dark-text">Total Paid</span><span className="font-bold text-dark-text">₹{createdOrder.total}</span></div>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate(`/customer/orders/${createdOrder.id}`)} className="flex-1 py-3 bg-primary-orange text-white rounded-xl font-bold hover:bg-orange-600">Track Order</button>
            <button onClick={() => navigate('/customer/menu')} className="flex-1 py-3 border border-gray-200 text-dark-text rounded-xl font-semibold hover:bg-gray-50">Order More</button>
          </div>
        </div>
      )}
    </div>
  );
}
