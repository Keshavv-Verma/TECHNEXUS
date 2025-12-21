// Razorpay Payment Gateway Integration - Test Mode
// Add your test key ID from https://dashboard.razorpay.com/app/keys

const RAZORPAY_KEY_ID = process.env.REACT_APP_RAZORPAY_KEY_ID;

/**
 * Load Razorpay script dynamically
 */
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Initialize Razorpay Payment - Test Mode
 * @param {Object} paymentData - Contains amount, orderId, customerEmail, customerPhone, customerName
 * @param {Function} onSuccess - Callback on successful payment
 * @param {Function} onError - Callback on payment error
 */
export const initiateRazorpayPayment = async (
  paymentData,
  onSuccess,
  onError
) => {
  try {
    // Check if key is configured
    if (!RAZORPAY_KEY_ID) {
      const setupGuide = `
Razorpay Test Mode Setup:

1. Go to https://dashboard.razorpay.com/app/keys
2. Copy your Test Key ID (starts with rzp_test_)
3. Create .env.local file with:
   REACT_APP_RAZORPAY_KEY_ID=your_test_key_id
4. Restart your React app (npm start)

For testing, use:
- Card: 4111 1111 1111 1111
- Expiry: 12/25
- CVV: 123
      `;
      console.error(setupGuide);
      onError('Razorpay Key not configured. Check console for setup instructions.');
      return;
    }

    // Load Razorpay script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      onError('Failed to load Razorpay script');
      return;
    }

    // Check if Razorpay is available
    if (!window.Razorpay) {
      onError('Razorpay is not available');
      return;
    }

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: Math.round(paymentData.amount * 100), // Amount in paise
      currency: 'INR',
      name: 'TechNexus',
      description: 'Product Purchase',
      
      handler: function (response) {
        console.log('Payment Success:', response);
        onSuccess({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: paymentData.orderId || `order_${Date.now()}`,
          razorpay_signature: response.razorpay_signature,
          amount: paymentData.amount,
          orderId: paymentData.orderId
        });
      },
      
      prefill: {
        name: paymentData.customerName || '',
        email: paymentData.customerEmail || '',
        contact: paymentData.customerPhone || ''
      },
      
      notes: {
        products: paymentData.productNames || 'Cart Items'
      },
      
      theme: {
        color: '#10b981'
      },
      
      modal: {
        ondismiss: function () {
          onError('Payment was cancelled');
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();

  } catch (error) {
    console.error('Payment error:', error);
    onError(`Error: ${error.message}`);
  }
};

/**
 * Create a mock order (in test mode, you'd call your backend)
 * In production, create order via your backend API
 */
export const createOrder = async (amount, customerId = null) => {
  try {
    // In test mode, generate a mock order ID
    // In production, make API call to backend to create order
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      success: true,
      orderId: orderId,
      amount: amount
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Verify payment signature (should be done on backend for security)
 * For now, this is a client-side verification for demo purposes
 */
export const verifyPaymentSignature = (paymentResponse) => {
  // In production, send this to backend for verification
  // Backend should verify using: crypto.createHmac('sha256', RAZORPAY_KEY_SECRET)
  console.log('Payment verification payload:', paymentResponse);
  
  // For test mode, we'll consider payment successful if we have all required fields
  return {
    verified: !!(
      paymentResponse.razorpay_payment_id &&
      paymentResponse.razorpay_order_id &&
      paymentResponse.razorpay_signature
    ),
    paymentId: paymentResponse.razorpay_payment_id,
    orderId: paymentResponse.razorpay_order_id
  };
};
