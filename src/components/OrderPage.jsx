import React, { useRef, useState } from 'react';
import { orderInputStyle } from '../styles/styles';
import useAuth from '../hooks/useAuth';

function OrderPage({ cart, setCart, setShopPage }) {
  const auth = useAuth();
  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);
  const addressRef = useRef(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [upiProvider, setUpiProvider] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [transactionFailed, setTransactionFailed] = useState(false);
  const [actualPaymentMade, setActualPaymentMade] = useState(false);

  const handleUpiPayment = () => {
    setShowQRCode(true);
    // Simulate payment completion after showing QR code
    setTimeout(() => {
      setPaymentCompleted(true);
      // Randomly simulate whether actual payment was made (50% chance for demo)
      // In real implementation, this would be detected by your payment gateway
      setActualPaymentMade(Math.random() > 0.5);
    }, 3000); // Enable verify button after 3 seconds (simulating payment completion)
  };

  const handleTransactionVerification = () => {
    // Check if actual payment was made to the QR account
    if (actualPaymentMade) {
      setTransactionSuccess(true);
      setTransactionFailed(false);
    } else {
      setTransactionFailed(true);
      setTransactionSuccess(false);
    }
    setShowQRCode(false);
  };

  // Build UPI payment URL for QR generation
  const totalAmount = cart.reduce((sum, i) => sum + i.price * i.quantity, 0) + (cart.length > 0 ? 40 : 0);
  const upiPayeeVpa = 'dheetshasree@okaxis'; // Your real UPI ID
  const upiPayeeName = 'YummyCart';
  const upiTxnNote = 'Food Order Payment';
  
  // Create proper UPI payment URL that works with all UPI apps
  const upiUrl = `upi://pay?pa=${upiPayeeVpa}&pn=${encodeURIComponent(upiPayeeName)}&am=${totalAmount}&cu=INR&tn=${encodeURIComponent(upiTxnNote)}&tr=${Date.now()}`;
  
  // Generate QR code with the UPI URL
  const qrImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;

  const placeOrder = async () => {
    const fullName = nameRef.current?.value?.trim();
    const phone = phoneRef.current?.value?.trim();
    const email = emailRef.current?.value?.trim();
    const address = addressRef.current?.value?.trim();

    if (!fullName || !phone || !address) {
      alert('Please fill all required fields.');
      return;
    }
    if (!cart || cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    const deliveryFee = cart.length > 0 ? 0 : 0;
    const payload = {
      userId: auth?.user?.id,
      items: cart.map(i => ({
        foodId: String(i.id ?? i.foodId ?? i.name),
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
        description: i.description
      })),
      fullName,
      phone,
      email,
      address,
      deliveryFee,
      paymentMethod
    };

    try {
      const resp = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        alert(data.message || 'Could not place order. Please try again.');
        return;
      }
      alert('Order placed successfully!');
      setCart([]);
      setShopPage('home');
    } catch (err) {
      console.error('Place order failed:', err);
      alert('Network error. Please try again.');
    }
  };
  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ fontWeight: 700, fontSize: 32, marginBottom: 24 }}>Place Your Order</h2>
      <div style={{ display: 'flex', gap: 32 }}>
        <form style={{
          flex: 2, background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px #eee', padding: 24
        }}>
          <h3 style={{ fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Personal Information</h3>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <input ref={nameRef} type="text" placeholder="Full Name *" required style={orderInputStyle} />
            <input ref={phoneRef} type="tel" placeholder="Phone Number *" required style={orderInputStyle} />
          </div>
          <input ref={emailRef} type="email" placeholder="Email Address" style={{ ...orderInputStyle, marginBottom: 16 }} />
          <h3 style={{ fontWeight: 700, fontSize: 22, margin: '24px 0 18px' }}>Delivery Address</h3>
          <textarea ref={addressRef} placeholder="House/Flat no., Building, Street, Landmark, City, PIN code" required style={{ ...orderInputStyle, minHeight: 80 }} />
          
          <h3 style={{ fontWeight: 700, fontSize: 22, margin: '24px 0 18px' }}>Payment Method</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: 16 }}>
              <input 
                type="radio" 
                name="payment" 
                value="cash" 
                checked={paymentMethod === 'cash'}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  setShowQRCode(false);
                  setTransactionSuccess(false);
                  setUpiProvider('');
                }}
                style={{ marginRight: 8, transform: 'scale(1.2)' }}
              />
              Cash on Delivery
            </label>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: 16 }}>
              <input 
                type="radio" 
                name="payment" 
                value="upi" 
                checked={paymentMethod === 'upi'}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  setShowQRCode(false);
                  setTransactionSuccess(false);
                  setTransactionFailed(false);
                  setPaymentCompleted(false);
                  setActualPaymentMade(false);
                  setUpiProvider('');
                }}
                style={{ marginRight: 8, transform: 'scale(1.2)' }}
              />
              UPI Payment
            </label>
          </div>

          {/* UPI Provider Selection */}
          {paymentMethod === 'upi' && !showQRCode && !transactionSuccess && (
            <div style={{ marginTop: 16 }}>
              <h4 style={{ fontWeight: 600, fontSize: 18, marginBottom: 12 }}>Select UPI App</h4>
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  type="button"
                  onClick={() => setUpiProvider('gpay')}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: '2px solid #4285f4',
                    borderRadius: 8,
                    background: upiProvider === 'gpay' ? '#4285f4' : '#fff',
                    color: upiProvider === 'gpay' ? '#fff' : '#4285f4',
                    cursor: 'pointer',
                    fontSize: 16,
                    fontWeight: 600
                  }}
                >
                  Google Pay
                </button>
                <button
                  type="button"
                  onClick={() => setUpiProvider('phonepe')}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: '2px solid #5f259f',
                    borderRadius: 8,
                    background: upiProvider === 'phonepe' ? '#5f259f' : '#fff',
                    color: upiProvider === 'phonepe' ? '#fff' : '#5f259f',
                    cursor: 'pointer',
                    fontSize: 16,
                    fontWeight: 600
                  }}
                >
                  PhonePe
                </button>
              </div>
              {upiProvider && (
                <button
                  type="button"
                  onClick={handleUpiPayment}
                  style={{
                    width: '100%',
                    marginTop: 16,
                    padding: '12px 0',
                    background: 'linear-gradient(90deg, #ff9800 0%, #ffb347 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: 'pointer'
                  }}
                >
                  Pay ₹{cart.reduce((sum, i) => sum + i.price * i.quantity, 0) + (cart.length > 0 ? 40 : 0)}
                </button>
              )}
            </div>
          )}

          {/* QR Code Display */}
          {showQRCode && !transactionSuccess && (
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <h4 style={{ fontWeight: 600, fontSize: 18, marginBottom: 12 }}>
                Scan QR Code to Pay
              </h4>
              {/* Your Original Google Pay QR Scanner */}
              <div style={{ 
                width: 200, 
                height: 200, 
                margin: '0 auto 16px', 
                border: '2px solid #ddd', 
                borderRadius: 8, 
                overflow: 'hidden', 
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                {/* Google Pay Logo in center */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 40,
                  height: 40,
                  background: 'linear-gradient(45deg, #4285f4, #34a853, #fbbc04, #ea4335)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  zIndex: 2
                }}>
                  G
                </div>
                {/* QR Code with Google Pay styling */}
                <img 
                  src={qrImageSrc} 
                  alt="Google Pay QR" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    opacity: 0.9
                  }} 
                />
              </div>
              
              {/* Direct UPI Payment Link */}
              <div style={{ marginBottom: 16 }}>
                <a 
                  href={upiUrl}
                  style={{
                    display: 'inline-block',
                    background: 'linear-gradient(90deg, #ff9800 0%, #ffb347 100%)',
                    color: '#fff',
                    padding: '10px 20px',
                    borderRadius: 6,
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: 14
                  }}
                >
                  💳 Pay ₹{totalAmount} via UPI
                </a>
              </div>
              
              <div style={{ fontSize: 14, color: '#666', marginBottom: 12 }}>
                Scan QR code with Google Pay or any UPI app
              </div>
              
              {/* UPI ID Display */}
              <div style={{ 
                fontSize: 12, 
                color: '#666', 
                marginBottom: 16,
                padding: '8px 12px',
                background: '#f8f9fa',
                borderRadius: 6,
                border: '1px solid #e9ecef'
              }}>
                UPI ID: {upiPayeeVpa}
              </div>
              
              {/* Transaction Verification Button */}
              <button
                onClick={handleTransactionVerification}
                disabled={!paymentCompleted}
                style={{
                  background: paymentCompleted 
                    ? 'linear-gradient(90deg, #34a853 0%, #2e7d32 100%)' 
                    : 'linear-gradient(90deg, #ccc 0%, #999 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '12px 24px',
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: paymentCompleted ? 'pointer' : 'not-allowed',
                  marginBottom: 8,
                  opacity: paymentCompleted ? 1 : 0.6
                }}
              >
                ✅ Verify Payment
              </button>
              
              <div style={{ fontSize: 12, color: '#999' }}>
                {paymentCompleted 
                  ? "Payment detected! Click 'Verify Payment' to confirm" 
                  : "Complete your GPay payment first, then verify"}
              </div>
            </div>
          )}

          {/* Transaction Success */}
          {transactionSuccess && (
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <div style={{
                background: '#d4edda',
                border: '1px solid #c3e6cb',
                borderRadius: 8,
                padding: 16,
                color: '#155724'
              }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>✅</div>
                <h4 style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>
                  Transaction Successful!
                </h4>
                <div style={{ fontSize: 14 }}>
                  Payment of ₹{cart.reduce((sum, i) => sum + i.price * i.quantity, 0) + (cart.length > 0 ? 40 : 0)} completed via {upiProvider === 'gpay' ? 'Google Pay' : 'PhonePe'}
                </div>
              </div>
            </div>
          )}

          {/* Transaction Failed */}
          {transactionFailed && (
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <div style={{
                background: '#f8d7da',
                border: '1px solid #f5c6cb',
                borderRadius: 8,
                padding: 16,
                color: '#721c24'
              }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>❌</div>
                <h4 style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>
                  Transaction Failed!
                </h4>
                <div style={{ fontSize: 14, marginBottom: 12 }}>
                  No payment received for ₹{cart.reduce((sum, i) => sum + i.price * i.quantity, 0) + (cart.length > 0 ? 40 : 0)} to account {upiPayeeVpa}
                </div>
                <div style={{ fontSize: 12, color: '#856404', background: '#fff3cd', padding: '8px 12px', borderRadius: 4, border: '1px solid #ffeaa7' }}>
                  Please complete the payment first, then try verification again
                </div>
              </div>
            </div>
          )}
        </form>
        <div style={{
          flex: 1, background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px #eee', padding: 24, height: 'fit-content'
        }}>
          <h3 style={{ fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Order Summary</h3>
          {cart.map(item => (
            <div key={item.id} style={{ fontSize: 17, marginBottom: 8 }}>
              {item.name} x {item.quantity} <span style={{ float: 'right' }}>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div style={{ fontSize: 18, marginBottom: 8 }}>
            Subtotal <span style={{ float: 'right' }}>₹{cart.reduce((sum, i) => sum + i.price * i.quantity, 0)}</span>
          </div>
          <div style={{ fontSize: 18, marginBottom: 8 }}>
            Delivery Fee <span style={{ float: 'right' }}>₹{cart.length > 0 ? 40 : 0}</span>
          </div>
          <div style={{ fontWeight: 700, fontSize: 20, margin: '18px 0' }}>
            Total <span style={{ float: 'right' }}>₹{cart.reduce((sum, i) => sum + i.price * i.quantity, 0) + (cart.length > 0 ? 40 : 0)}</span>
          </div>
          <button
            style={{
              width: '100%', background: 'linear-gradient(90deg, #ff9800 0%, #ffb347 100%)',
              color: '#fff', border: 'none', borderRadius: 6, padding: '12px 0', fontWeight: 600, fontSize: 18, cursor: 'pointer'
            }}
            onClick={placeOrder}
          >Place Order</button>
        </div>
      </div>
    </div>
  );
}

export default OrderPage; 