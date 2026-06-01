import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_OUTFITS, MOCK_SHOPS } from '../data/mockData';
import {
  auth,
  db,
  storage,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  googleProvider,
  signInWithPopup,
} from '../firebase';
import { doc, getDoc, setDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AppContext = createContext();

// ── Haversine distance (km) ───────────────────────────────────────────────
function getHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export const AppProvider = ({ children }) => {
  const [outfits, setOutfits]                         = useState([]);
  const [shopsList, setShopsList]                     = useState([]);
  const [userLocation, setUserLocation]               = useState(null);
  const [userLocationLoading, setUserLocationLoading] = useState(false);
  const [authLoading, setAuthLoading]                 = useState(true);
  const [user, setUser]                               = useState(null);
  const [authError, setAuthError]                     = useState('');
  const [bookings, setBookings]                       = useState([]);

  // ── Firestore Seeding & Real-Time Sync Fallbacks ──────────────────────────
  useEffect(() => {
    const loadFirestoreData = async () => {
      try {
        // --- 1. FETCH SHOPS ---
        const shopsColRef = collection(db, 'shops');
        const shopsSnap = await getDocs(shopsColRef);
        
        let fetchedShops = [];
        shopsSnap.forEach((docSnap) => {
          const data = docSnap.data();
          fetchedShops.push({
            id: data.id || docSnap.id,
            ownerId: data.ownerId || null,
            name: data.name,
            description: data.description,
            address: data.address,
            rating: data.rating,
            reviews: data.reviewsCount || 0,
            coords: data.coords || { x: 45 + Math.random() * 10, y: 45 + Math.random() * 10 },
            latOffset: data.coordinates ? (data.coordinates.latitude - 28.6139) : 0,
            lngOffset: data.coordinates ? (data.coordinates.longitude - 77.2090) : 0,
          });
        });
        setShopsList(fetchedShops);

        // --- 2. FETCH OUTFITS ---
        const outfitsColRef = collection(db, 'outfits');
        const outfitsSnap = await getDocs(outfitsColRef);
        
        let fetchedOutfits = [];
        outfitsSnap.forEach((docSnap) => {
          const data = docSnap.data();
          fetchedOutfits.push({
            id: data.id || docSnap.id,
            shopId: data.shopId ? (parseInt(data.shopId.replace('shop_', '')) || data.shopId) : 101,
            shop: data.shopName || 'Boutique',
            title: data.title,
            description: data.description,
            price: data.price,
            size: data.size,
            gender: data.gender,
            occasion: data.occasion,
            image: data.image,
            specs: data.specs || [],
            status: data.status || 'Available',
            rating: data.rating || 5.0,
            reviewsCount: data.reviewsCount || 0,
            createdAt: data.createdAt,
          });
        });
        setOutfits(fetchedOutfits);

      } catch (err) {
        console.error("Error loading Firestore collections: ", err);
      }
    };

    loadFirestoreData();
  }, []);

  // ── Firestore Bookings Sync Listener ──────────────────────────────────────
  useEffect(() => {
    if (!user) {
      setBookings([]);
      return;
    }

    const loadBookings = async () => {
      try {
        const bookingsColRef = collection(db, 'bookings');
        
        let q;
        if (user.role === 'Shopkeeper') {
          q = query(bookingsColRef);
        } else {
          q = query(bookingsColRef, where('renterId', '==', user.uid));
        }

        const querySnap = await getDocs(q);
        const fetchedBookings = [];
        querySnap.forEach((docSnap) => {
          const data = docSnap.data();
          fetchedBookings.push({
            id: data.id || docSnap.id,
            outfitId: data.outfitId,
            outfitTitle: data.outfitTitle,
            outfitImage: data.outfitImage,
            price: data.totalPrice || data.price,
            shop: data.shopName,
            bookingDate: data.bookingDate,
            bookingTime: data.bookingTime,
            type: data.type,
            deliveryFee: data.deliveryFee,
            address: data.address,
            status: data.status,
          });
        });
        
        setBookings(fetchedBookings);
      } catch (err) {
        console.error("Error loading bookings from Firestore: ", err);
      }
    };

    loadBookings();
  }, [user]);

  // ── Firebase Auth state listener ─────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch from Firestore
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            setUser({
              uid:       firebaseUser.uid,
              name:      data.name || firebaseUser.displayName || firebaseUser.email.split('@')[0],
              email:     firebaseUser.email,
              role:      data.role || 'Renter',
              photoURL:  data.photoURL || firebaseUser.photoURL || null,
              createdAt: data.createdAt || new Date().toISOString(),
            });
          } else {
            // Safety fallback: set reactive local state but DO NOT write to Firestore
            // to avoid overwriting ongoing Shopkeeper signup/Google SSO registrations.
            setUser({
              uid:       firebaseUser.uid,
              name:      firebaseUser.displayName || firebaseUser.email.split('@')[0],
              email:     firebaseUser.email,
              role:      'Renter',
              photoURL:  firebaseUser.photoURL || null,
              createdAt: new Date().toISOString(),
            });
          }
        } catch (e) {
          console.error("Error fetching/setting user profile: ", e);
          // Set basic user state as absolute fallback
          setUser({
            uid:       firebaseUser.uid,
            name:      firebaseUser.displayName || firebaseUser.email.split('@')[0],
            email:     firebaseUser.email,
            role:      'Renter',
            photoURL:  firebaseUser.photoURL || null,
            createdAt: new Date().toISOString(),
          });
        }
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // ── Shop distance recalculation ──────────────────────────────────────────
  useEffect(() => {
    if (!userLocation) { setShopsList(MOCK_SHOPS); return; }
    const updatedShops = MOCK_SHOPS.map((shop) => {
      const shopLat = userLocation.lat + (shop.latOffset || 0);
      const shopLng = userLocation.lng + (shop.lngOffset || 0);
      const dist = getHaversineDistance(userLocation.lat, userLocation.lng, shopLat, shopLng);
      return { ...shop, distance: `${dist.toFixed(1)} km`, coords: shop.coords };
    });
    setShopsList([...updatedShops].sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance)));
  }, [userLocation]);

  // ── Geolocation ──────────────────────────────────────────────────────────
  const detectUserLocation = () => {
    if (!navigator.geolocation) { alert("Geolocation is not supported."); return; }
    setUserLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const res  = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const addr = data?.address || {};
          const name = addr.neighbourhood || addr.suburb || addr.city_district || addr.city || addr.town || 'Nearby';
          const cc   = addr.country_code ? addr.country_code.toUpperCase() : '';
          setUserLocation({ name: `${name}${cc ? ', ' + cc : ''}`, lat: latitude, lng: longitude });
        } catch {
          setUserLocation({ name: 'Location detected', lat: latitude, lng: longitude });
        } finally {
          setUserLocationLoading(false);
        }
      },
      () => {
        setUserLocationLoading(false);
        alert("Location access denied. Defaulting to Connaught Place, New Delhi.");
        setUserLocation({ name: "Connaught Place, IN", lat: 28.6139, lng: 77.2090 });
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // ── Firebase Auth actions ─────────────────────────────────────────────────

  /** Sign up: create account, set display name, store role. */
  /** Sign up: create account, set display name, store role in Firestore. */
  const signup = async (name, email, password, role) => {
    setAuthError('');
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    
    // Create Firestore user document
    const userDocRef = doc(db, 'users', cred.user.uid);
    const newProfile = {
      uid:       cred.user.uid,
      name:      name,
      email:     email,
      role:      role,
      photoURL:  cred.user.photoURL || null,
      createdAt: new Date().toISOString(),
    };
    await setDoc(userDocRef, newProfile);
    
    // Explicitly set state to bypass Auth state listener race conditions
    setUser(newProfile);
  };

  /** Log in with email + password, check Firestore role. */
  const login = async (email, password, selectedRole = 'Renter') => {
    setAuthError('');
    const cred = await signInWithEmailAndPassword(auth, email, password);
    
    // Fetch user profile from Firestore
    const userDocRef = doc(db, 'users', cred.user.uid);
    const userDocSnap = await getDoc(userDocRef);
    
    let storedRole = 'Renter';
    let profileData = null;
    if (userDocSnap.exists()) {
      const data = userDocSnap.data();
      storedRole = data.role || 'Renter';
      profileData = {
        uid:       cred.user.uid,
        name:      data.name || cred.user.displayName || email.split('@')[0],
        email:     cred.user.email,
        role:      storedRole,
        photoURL:  data.photoURL || cred.user.photoURL || null,
        createdAt: data.createdAt || new Date().toISOString(),
      };
    } else {
      // Auto-create document if it doesn't exist (safety fallback)
      profileData = {
        uid:       cred.user.uid,
        name:      cred.user.displayName || email.split('@')[0],
        email:     email,
        role:      selectedRole,
        photoURL:  cred.user.photoURL || null,
        createdAt: new Date().toISOString(),
      };
      await setDoc(userDocRef, profileData);
      storedRole = selectedRole;
    }

    // Explicitly set state to bypass Auth state listener race conditions
    setUser(profileData);
    return storedRole;
  };

  /** Log in or sign up with Google, check/set Firestore role. */
  const loginWithGoogle = async (selectedRole = 'Renter') => {
    setAuthError('');
    const cred = await signInWithPopup(auth, googleProvider);
    
    // Fetch/check/set user profile in Firestore
    const userDocRef = doc(db, 'users', cred.user.uid);
    const userDocSnap = await getDoc(userDocRef);
    
    let profileData = null;
    let storedRole = selectedRole;
    if (userDocSnap.exists()) {
      const data = userDocSnap.data();
      storedRole = data.role || 'Renter';
      profileData = {
        uid:       cred.user.uid,
        name:      data.name || cred.user.displayName || cred.user.email.split('@')[0],
        email:     cred.user.email,
        role:      storedRole,
        photoURL:  data.photoURL || cred.user.photoURL || null,
        createdAt: data.createdAt || new Date().toISOString(),
      };
    } else {
      // Auto-create document since this is a new Google SSO registration
      profileData = {
        uid:       cred.user.uid,
        name:      cred.user.displayName || cred.user.email.split('@')[0],
        email:     cred.user.email,
        role:      selectedRole,
        photoURL:  cred.user.photoURL || null,
        createdAt: new Date().toISOString(),
      };
      await setDoc(userDocRef, profileData);
    }

    // Explicitly set state to bypass Auth state listener race conditions
    setUser(profileData);
    return storedRole;
  };

  /** Log out. */
  const logout = async () => {
    await signOut(auth);
  };

  // ── Outfit / Booking helpers ──────────────────────────────────────────────
  const addOutfit = async (newOutfit) => {
    try {
      const outfitId = `outfit_${Date.now()}`;
      
      // Find user's registered shop
      const userShop = shopsList.find(s => s.ownerId === user?.uid);
      const shopId = userShop ? userShop.id : 'shop_103'; 
      const shopName = userShop ? userShop.name : (user ? `${user.name}'s Boutique` : 'The Thread & Tux');

      const mappedOutfit = {
        id: outfitId,
        shopId: shopId,
        shopName: shopName,
        title: newOutfit.title,
        description: newOutfit.description,
        price: Number(newOutfit.price),
        size: newOutfit.size || 'M',
        gender: newOutfit.gender || 'Unisex',
        occasion: newOutfit.occasion || 'Formal',
        image: newOutfit.image || 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80',
        specs: newOutfit.specs || [],
        status: 'Available',
        rating: 5.0,
        reviewsCount: 1,
        createdAt: new Date().toISOString(),
      };

      // Write to Firestore outfits collection
      const outfitDocRef = doc(db, 'outfits', outfitId);
      await setDoc(outfitDocRef, mappedOutfit);

      // Instantly sync local state for responsive UI feel
      setOutfits(prev => [{
        ...mappedOutfit,
        shopId: userShop ? (parseInt(userShop.id.replace('shop_', '')) || userShop.id) : 103,
        shop: shopName,
      }, ...prev]);

    } catch (err) {
      console.error("Error adding outfit to Firestore: ", err);
      alert("Failed to save outfit to Firestore database.");
    }
  };

  const addBooking = async (newBooking) => {
    try {
      const displayId = `DX-${Math.floor(1000 + Math.random() * 9000)}`;
      const docId = `booking_${Date.now()}`;

      const mappedBooking = {
        id: displayId,
        renterId: user ? user.uid : 'GUEST_USER',
        outfitId: String(newBooking.outfitId),
        outfitTitle: newBooking.outfitTitle,
        outfitImage: newBooking.outfitImage,
        shopId: String(newBooking.shopId || 'shop_103'),
        shopName: newBooking.shop || 'The Thread & Tux',
        bookingDate: newBooking.bookingDate,
        bookingTime: newBooking.bookingTime,
        type: newBooking.type,
        deliveryFee: Number(newBooking.deliveryFee || 0),
        totalPrice: Number(newBooking.price),
        address: newBooking.address,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      };

      // Write to Firestore bookings collection
      const bookingDocRef = doc(db, 'bookings', docId);
      await setDoc(bookingDocRef, mappedBooking);

      // Instantly sync local state for responsive UI feel
      setBookings(prev => [{
        id: displayId,
        outfitId: newBooking.outfitId,
        outfitTitle: newBooking.outfitTitle,
        outfitImage: newBooking.outfitImage,
        price: newBooking.price,
        shop: newBooking.shop,
        bookingDate: newBooking.bookingDate,
        bookingTime: newBooking.bookingTime,
        type: newBooking.type,
        deliveryFee: newBooking.deliveryFee,
        address: newBooking.address,
        status: 'Pending',
      }, ...prev]);

    } catch (err) {
      console.error("Error adding booking to Firestore: ", err);
      alert("Failed to save booking to Firestore database.");
    }
  };

  const registerShop = async (newShop) => {
    try {
      const shopId = `shop_${Date.now()}`;
      const mappedShop = {
        id: shopId,
        ownerId: user ? user.uid : 'UNKNOWN_OWNER',
        name: newShop.name,
        description: newShop.description,
        address: newShop.address,
        rating: 5.0,
        reviewsCount: 0,
        coords: newShop.coords || { x: 45, y: 55 },
        coordinates: {
          latitude: newShop.coords ? (28.6139 + (newShop.coords.y - 50) * 0.001) : 28.6139,
          longitude: newShop.coords ? (77.2090 + (newShop.coords.x - 50) * 0.001) : 77.2090
        },
        createdAt: new Date().toISOString(),
      };

      // Write to Firestore shops collection
      const shopDocRef = doc(db, 'shops', shopId);
      await setDoc(shopDocRef, mappedShop);

      // Instantly sync local state for responsive UI feel
      setShopsList(prev => [...prev, {
        id: shopId,
        ownerId: user ? user.uid : 'UNKNOWN_OWNER',
        name: newShop.name,
        description: newShop.description,
        address: newShop.address,
        rating: 5.0,
        reviews: 0,
        coords: newShop.coords || { x: 45, y: 55 },
        latOffset: newShop.coords ? ((28.6139 + (newShop.coords.y - 50) * 0.001) - 28.6139) : 0,
        lngOffset: newShop.coords ? ((77.2090 + (newShop.coords.x - 50) * 0.001) - 77.2090) : 0,
      }]);

    } catch (err) {
      console.error("Error registering shop to Firestore: ", err);
      alert("Failed to save shop details to Firestore database.");
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      const bookingsColRef = collection(db, 'bookings');
      const q = query(bookingsColRef, where('id', '==', bookingId));
      const querySnap = await getDocs(q);

      if (!querySnap.empty) {
        const docSnap = querySnap.docs[0];
        const docRef = doc(db, 'bookings', docSnap.id);
        await setDoc(docRef, { status: status }, { merge: true });
      }

      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: status } : b));
    } catch (err) {
      console.error("Error updating booking status in Firestore: ", err);
      alert("Failed to update booking status in database.");
    }
  };

  /** Upload outfit image to Firebase Storage and return download URL. */
  const uploadOutfitImage = async (file) => {
    try {
      const storageRef = ref(storage, `outfits/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (err) {
      console.error("Error uploading image to Firebase Storage: ", err);
      throw err;
    }
  };

  return (
    <AppContext.Provider value={{
      outfits,
      shops: shopsList,
      bookings,
      addOutfit,
      addBooking,
      registerShop,
      updateBookingStatus,
      uploadOutfitImage,
      user,
      authLoading,
      authError,
      setAuthError,
      login,
      signup,
      loginWithGoogle,
      logout,
      userLocation,
      userLocationLoading,
      detectUserLocation,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
