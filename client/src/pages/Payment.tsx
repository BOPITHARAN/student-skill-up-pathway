@@ .. @@
 import { CreditCard, Shield, CheckCircle, Clock, Users, BookOpen } from 'lucide-react';
 import { useAuth } from '../contexts/AuthContext';
+import { paymentAPI } from '../lib/api';
 import Navbar from '../components/Navbar';

@@ .. @@
   const handlePayment = async () => {
     setProcessing(true);
     
-    // Simulate payment processing
-    await new Promise(resolve => setTimeout(resolve, 3000));
-    
-    setProcessing(false);
-    setPaymentSuccess(true);
-    
-    // Redirect to dashboard after success
-    setTimeout(() => {
-      navigate('/dashboard');
-    }, 2000);
+    try {
+      // Create payment intent
+      const paymentResponse = await paymentAPI.createPayment(10);
+      
+      if (paymentResponse.success) {
+        // Simulate payment processing (in real app, integrate with Stripe)
+        await new Promise(resolve => setTimeout(resolve, 2000));
+        
+        // Confirm payment
+        const confirmResponse = await paymentAPI.confirmPayment(
+          paymentResponse.data.paymentId,
+          paymentResponse.data.paymentIntent.id
+        );
+        
+        if (confirmResponse.success) {
+          setProcessing(false);
+          setPaymentSuccess(true);
+          
+          // Update user's paid status in context
+          if (user) {
+            const updatedUser = { ...user, paid: true };
+            localStorage.setItem('user', JSON.stringify(updatedUser));
+          }
+          
+          // Redirect to dashboard after success
+          setTimeout(() => {
+            navigate('/dashboard');
+          }, 2000);
+        } else {
+          throw new Error('Payment confirmation failed');
+        }
+      } else {
+        throw new Error('Payment creation failed');
+      }
+    } catch (error) {
+      console.error('Payment error:', error);
+      setProcessing(false);
+      // Handle payment error (show error message)
+    }
   };