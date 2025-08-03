import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Shield, CheckCircle, Clock, Users, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

export default function Payment() {
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setProcessing(false);
    setPaymentSuccess(true);
    
    // Redirect to dashboard after success
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-12 max-w-md w-full"
          >
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Payment Successful!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Welcome to SkillUp! You now have lifetime access to all our courses.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Redirecting to your dashboard...
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8">
          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Complete Your Payment
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                One-time payment for lifetime access
              </p>
            </div>

            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  SkillUp Lifetime Access
                </span>
                <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  $10
                </span>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Access to all 500+ courses
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Lifetime updates and new content
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Certificates of completion
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Community access and support
                </li>
              </ul>
            </div>

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Card Number
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    CVC
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  defaultValue={user?.name || ''}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Shield className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Secure Payment
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Your payment information is encrypted and secure
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Pay $10 - Start Learning
                  </>
                )}
              </button>
            </form>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
              By completing this payment, you agree to our Terms of Service and Privacy Policy.
            </p>
          </motion.div>

          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                What You Get
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">500+ Courses</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Access to our entire library of technology courses
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Expert Support</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Get help from our community and instructors
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Lifetime Access</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Learn at your own pace, forever
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-2">Special Launch Price</h3>
              <p className="text-emerald-100 mb-4">
                Regular price: $99 <br />
                <span className="text-2xl font-bold">Your price: $10</span>
              </p>
              <p className="text-sm text-emerald-100">
                🎉 Limited time offer for early students
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}