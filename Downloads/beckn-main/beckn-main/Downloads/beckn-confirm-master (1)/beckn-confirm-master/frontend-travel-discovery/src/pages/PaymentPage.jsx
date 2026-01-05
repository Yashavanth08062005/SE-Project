import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Lock, Loader, AlertCircle, Smartphone, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { bookingData, item, type, searchOrigin, searchDestination } = location.state || {};

    const [processing, setProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('razorpay');
    const [error, setError] = useState('');
    const [scriptLoaded, setScriptLoaded] = useState(false);

    // Card payment state
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        cardHolder: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: ''
    });

    // UPI payment state
    const [upiId, setUpiId] = useState('');

    useEffect(() => {
        if (!bookingData || !item) {
            navigate('/');
            return;
        }

        // Load Razorpay Script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => setScriptLoaded(true);
        script.onerror = () => {
            console.error('Failed to load Razorpay script');
            setError('Failed to load payment gateway. Please refresh the page.');
        };
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, [bookingData, item, navigate]);

    const simulatePayment = () => {
        return new Promise((resolve) => {
            // Simulate payment processing delay
            setTimeout(() => {
                resolve({ success: true, transactionId: `TXN${Date.now()}` });
            }, 3000);
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Format card number with spaces
        if (name === 'cardNumber') {
            const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
            setCardDetails(prev => ({ ...prev, [name]: formatted }));
        } else {
            setCardDetails(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleCardPayment = async (e) => {
        e.preventDefault();
        setError('');
        setProcessing(true);

        try {
            // Validate card details
            if (!cardDetails.cardNumber || cardDetails.cardNumber.replace(/\s/g, '').length !== 16) {
                throw new Error('Please enter a valid 16-digit card number');
            }
            if (!cardDetails.cardHolder) {
                throw new Error('Please enter card holder name');
            }
            if (!cardDetails.expiryMonth || !cardDetails.expiryYear) {
                throw new Error('Please enter card expiry date');
            }
            if (!cardDetails.cvv || cardDetails.cvv.length !== 3) {
                throw new Error('Please enter a valid 3-digit CVV');
            }

            // Simulate payment processing
            const paymentResult = await simulatePayment();

            if (paymentResult.success) {
                // Navigate to payment success page
                navigate('/payment-success', {
                    state: {
                        transactionId: paymentResult.transactionId,
                        bookingData: bookingData,
                        item: item,
                        type: type,
                        searchOrigin: searchOrigin,
                        searchDestination: searchDestination
                    }
                });
            } else {
                throw new Error('Payment failed. Please try again.');
            }

        } catch (err) {
            setError(err.message || 'Payment failed. Please try again.');
            setProcessing(false);
        }
    };

    const handleRazorpayPayment = () => {
        setProcessing(true);
        setError('');

        if (typeof window.Razorpay === 'undefined') {
            setError('Razorpay SDK failed to load. Please check your connection.');
            setProcessing(false);
            return;
        }

        const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
        if (!razorpayKey) {
            console.error('Razorpay key is missing! Check .env file.');
            setError('Payment configuration missing. Please restart the app.');
            setProcessing(false);
            return;
        }

        try {
            const options = {
                key: razorpayKey,
                amount: (item.price * 100).toString(), // Razorpay expects amount in paise
                currency: "INR",
                name: "TravelHub",
                description: `Payment for ${type} booking`,
                prefill: {
                    name: bookingData.passenger_name,
                    email: bookingData.passenger_email,
                    contact: bookingData.passenger_phone,
                },
                theme: {
                    color: "#2563eb"
                },
                handler: function (response) {
                    console.log('Razorpay payment successful:', response.razorpay_payment_id);
                    
                    // Navigate to payment success page
                    navigate('/payment-success', {
                        state: {
                            transactionId: response.razorpay_payment_id,
                            bookingData: bookingData,
                            item: item,
                            type: type,
                            searchOrigin: searchOrigin,
                            searchDestination: searchDestination
                        }
                    });
                },
                modal: {
                    ondismiss: function () {
                        setProcessing(false);
                    }
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                setError(response.error.description || 'Payment failed. Please try again.');
                setProcessing(false);
            });
            rzp1.open();
        } catch (err) {
            console.error('Razorpay initialization failed:', err);
            setError('Failed to initialize payment. Please try again.');
            setProcessing(false);
        }
    };

    const handlePayPalPayment = async () => {
        setProcessing(true);
        setError('');

        try {
            // Simulate PayPal payment processing
            const paymentResult = await simulatePayment();

            if (paymentResult.success) {
                // Navigate to payment success page
                navigate('/payment-success', {
                    state: {
                        transactionId: paymentResult.transactionId,
                        bookingData: bookingData,
                        item: item,
                        type: type,
                        searchOrigin: searchOrigin,
                        searchDestination: searchDestination
                    }
                });
            } else {
                throw new Error('PayPal payment failed. Please try again.');
            }

        } catch (err) {
            setError(err.message || 'PayPal payment failed. Please try again.');
            setProcessing(false);
        }
    };

    const handleUpiPayment = async (e) => {
        e.preventDefault();
        setError('');
        setProcessing(true);

        try {
            // Validate UPI ID
            if (!upiId || !upiId.includes('@')) {
                throw new Error('Please enter a valid UPI ID');
            }

            // Simulate UPI payment processing
            const paymentResult = await simulatePayment();

            if (paymentResult.success) {
                // Navigate to payment success page
                navigate('/payment-success', {
                    state: {
                        transactionId: paymentResult.transactionId,
                        bookingData: bookingData,
                        item: item,
                        type: type,
                        searchOrigin: searchOrigin,
                        searchDestination: searchDestination
                    }
                });
            } else {
                throw new Error('UPI payment failed. Please try again.');
            }

        } catch (err) {
            setError(err.message || 'UPI payment failed. Please try again.');
            setProcessing(false);
        }
    };

    const handleWalletPayment = async (walletType) => {
        setProcessing(true);
        setError('');

        try {
            // Simulate wallet payment processing
            const paymentResult = await simulatePayment();

            if (paymentResult.success) {
                // Navigate to payment success page
                navigate('/payment-success', {
                    state: {
                        transactionId: paymentResult.transactionId,
                        bookingData: bookingData,
                        item: item,
                        type: type,
                        searchOrigin: searchOrigin,
                        searchDestination: searchDestination
                    }
                });
            } else {
                throw new Error(`${walletType} payment failed. Please try again.`);
            }

        } catch (err) {
            setError(err.message || 'Wallet payment failed. Please try again.');
            setProcessing(false);
        }
    };

    if (!bookingData || !item) {
        return null;
    }

    const totalAmount = item.price || 0;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Payment</h1>
                    <p className="text-gray-600 mt-2">Complete your booking for ₹{totalAmount.toLocaleString('en-IN')}</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    {/* Security Badge */}
                    <div className="flex items-center justify-center mb-6 p-4 bg-green-50 rounded-lg">
                        <Lock className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-sm text-green-800 font-medium">
                            Secure Payment Gateway
                        </span>
                    </div>

                    {error && (
                        <div className="flex items-center p-4 mb-6 bg-red-50 border border-red-200 rounded-lg">
                            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                            <span className="text-sm text-red-800">{error}</span>
                        </div>
                    )}

                    {/* Payment Method Selection */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={() => setPaymentMethod('razorpay')}
                                className={`p-4 border-2 rounded-lg flex items-center justify-center ${
                                    paymentMethod === 'razorpay' 
                                        ? 'border-blue-500 bg-blue-50' 
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <CreditCard className="h-5 w-5 mr-2" />
                                Razorpay (All Methods)
                            </button>
                            <button
                                onClick={() => setPaymentMethod('card')}
                                className={`p-4 border-2 rounded-lg flex items-center justify-center ${
                                    paymentMethod === 'card' 
                                        ? 'border-blue-500 bg-blue-50' 
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <CreditCard className="h-5 w-5 mr-2" />
                                Credit/Debit Card
                            </button>
                            <button
                                onClick={() => setPaymentMethod('upi')}
                                className={`p-4 border-2 rounded-lg flex items-center justify-center ${
                                    paymentMethod === 'upi' 
                                        ? 'border-blue-500 bg-blue-50' 
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <Smartphone className="h-5 w-5 mr-2" />
                                UPI
                            </button>
                            <button
                                onClick={() => setPaymentMethod('paypal')}
                                className={`p-4 border-2 rounded-lg flex items-center justify-center ${
                                    paymentMethod === 'paypal' 
                                        ? 'border-blue-500 bg-blue-50' 
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <Wallet className="h-5 w-5 mr-2" />
                                PayPal (Demo)
                            </button>
                        </div>
                    </div>

                    {/* Payment Forms */}
                    {paymentMethod === 'card' && (
                        <form onSubmit={handleCardPayment} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Card Number
                                </label>
                                <input
                                    type="text"
                                    name="cardNumber"
                                    value={cardDetails.cardNumber}
                                    onChange={handleInputChange}
                                    placeholder="1234 5678 9012 3456"
                                    maxLength="19"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Card Holder Name
                                </label>
                                <input
                                    type="text"
                                    name="cardHolder"
                                    value={cardDetails.cardHolder}
                                    onChange={handleInputChange}
                                    placeholder="John Doe"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Month
                                    </label>
                                    <select
                                        name="expiryMonth"
                                        value={cardDetails.expiryMonth}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">MM</option>
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                                                {String(i + 1).padStart(2, '0')}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Year
                                    </label>
                                    <select
                                        name="expiryYear"
                                        value={cardDetails.expiryYear}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">YY</option>
                                        {Array.from({ length: 10 }, (_, i) => (
                                            <option key={i} value={String(new Date().getFullYear() + i).slice(-2)}>
                                                {String(new Date().getFullYear() + i).slice(-2)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        CVV
                                    </label>
                                    <input
                                        type="text"
                                        name="cvv"
                                        value={cardDetails.cvv}
                                        onChange={handleInputChange}
                                        placeholder="123"
                                        maxLength="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-blue-600 text-white rounded-lg py-3 px-6 font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {processing ? (
                                    <>
                                        <Loader className="animate-spin h-5 w-5 mr-2" />
                                        Processing...
                                    </>
                                ) : (
                                    `Pay ₹${totalAmount.toLocaleString('en-IN')}`
                                )}
                            </button>
                        </form>
                    )}

                    {paymentMethod === 'upi' && (
                        <form onSubmit={handleUpiPayment} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    UPI ID
                                </label>
                                <input
                                    type="text"
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                    placeholder="yourname@paytm"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-blue-600 text-white rounded-lg py-3 px-6 font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {processing ? (
                                    <>
                                        <Loader className="animate-spin h-5 w-5 mr-2" />
                                        Processing...
                                    </>
                                ) : (
                                    `Pay ₹${totalAmount.toLocaleString('en-IN')}`
                                )}
                            </button>
                        </form>
                    )}

                    {paymentMethod === 'razorpay' && (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600">
                                Razorpay supports all payment methods including UPI, Cards, Net Banking, and Wallets.
                            </p>
                            <button
                                onClick={handleRazorpayPayment}
                                disabled={!scriptLoaded || processing}
                                className="w-full bg-blue-600 text-white rounded-lg py-3 px-6 font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {processing ? (
                                    <>
                                        <Loader className="animate-spin h-5 w-5 mr-2" />
                                        Processing...
                                    </>
                                ) : (
                                    `Pay ₹${totalAmount.toLocaleString('en-IN')} with Razorpay`
                                )}
                            </button>
                        </div>
                    )}

                    {paymentMethod === 'paypal' && (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600">
                                PayPal payment simulation (Demo mode only)
                            </p>
                            <button
                                onClick={handlePayPalPayment}
                                disabled={processing}
                                className="w-full bg-yellow-500 text-white rounded-lg py-3 px-6 font-semibold hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {processing ? (
                                    <>
                                        <Loader className="animate-spin h-5 w-5 mr-2" />
                                        Processing...
                                    </>
                                ) : (
                                    `Pay $${(totalAmount / 83).toFixed(2)} with PayPal`
                                )}
                            </button>
                        </div>
                    )}

                    {/* Wallet Options */}
                    {paymentMethod === 'wallet' && (
                        <div className="space-y-4">
                            <h4 className="text-md font-medium text-gray-900">Choose Wallet</h4>
                            <div className="grid grid-cols-2 gap-4">
                                {['Paytm', 'PhonePe', 'Google Pay', 'Amazon Pay'].map((wallet) => (
                                    <button
                                        key={wallet}
                                        onClick={() => handleWalletPayment(wallet)}
                                        disabled={processing}
                                        className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                    >
                                        {wallet}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-400">
                            By continuing, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;