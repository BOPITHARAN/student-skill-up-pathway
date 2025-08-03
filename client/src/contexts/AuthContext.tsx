@@ .. @@
 import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
+import { authAPI } from '../lib/api';

 interface User {
@@ .. @@
 export function AuthProvider({ children }: { children: ReactNode }) {
   const [user, setUser] = useState<User | null>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
-    // Check if user is logged in from localStorage
-    const savedUser = localStorage.getItem('user');
-    if (savedUser) {
-      setUser(JSON.parse(savedUser));
+    // Check if user is logged in and verify token
+    const initAuth = async () => {
+      const token = localStorage.getItem('token');
+      const savedUser = localStorage.getItem('user');
+      
+      if (token && savedUser) {
+        try {
+          // Verify token with backend
+          const response = await authAPI.verifyToken();
+          if (response.success) {
+            setUser(response.data.user);
+          } else {
+            // Token invalid, clear storage
+            localStorage.removeItem('token');
+            localStorage.removeItem('user');
+          }
+        } catch (error) {
+          // Token invalid or expired
+          localStorage.removeItem('token');
+          localStorage.removeItem('user');
+        }
+      }
+      setLoading(false);
+    };
+    
+    initAuth();
-    setLoading(false);
   }, []);

   const login = async (email: string, password: string): Promise<boolean> => {
     setLoading(true);
-    // Mock authentication
-    await new Promise(resolve => setTimeout(resolve, 1000));
-    
-    const foundUser = mockUsers.find(u => u.email === email);
-    if (foundUser && password === 'password') {
-      setUser(foundUser);
-      localStorage.setItem('user', JSON.stringify(foundUser));
+    
+    try {
+      const response = await authAPI.login(email, password);
+      
+      if (response.success) {
+        const { user, token } = response.data;
+        setUser(user);
+        localStorage.setItem('token', token);
+        localStorage.setItem('user', JSON.stringify(user));
+        setLoading(false);
+        return true;
+      }
+    } catch (error) {
+      console.error('Login error:', error);
+    }
+    
-      setLoading(false);
-      return true;
-    }
-    
     setLoading(false);
     return false;
   };

   const register = async (name: string, email: string, password: string): Promise<boolean> => {
     setLoading(true);
-    // Mock registration
-    await new Promise(resolve => setTimeout(resolve, 1000));
-    
-    const newUser: User = {
-      id: Date.now().toString(),
-      name,
-      email,
-      role: 'student',
-      paid: false,
-      avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
-    };
-    
-    setUser(newUser);
-    localStorage.setItem('user', JSON.stringify(newUser));
+    
+    try {
+      const response = await authAPI.register(name, email, password);
+      
+      if (response.success) {
+        const { user, token } = response.data;
+        setUser(user);
+        localStorage.setItem('token', token);
+        localStorage.setItem('user', JSON.stringify(user));
+        setLoading(false);
+        return true;
+      }
+    } catch (error) {
+      console.error('Registration error:', error);
+    }
+    
     setLoading(false);
-    return true;
+    return false;
   };

   const logout = () => {
     setUser(null);
+    localStorage.removeItem('token');
     localStorage.removeItem('user');
   };