'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingBag, Users, Tag,
  Edit, Trash2, Plus, Search, Bell, X, ShieldCheck, Zap, Sliders,
  Settings, ChevronRight, DollarSign, Box, ShoppingCart, LogOut, Mail, RefreshCw, Upload, CheckSquare, Square, AlertTriangle
} from 'lucide-react';
import { products as initialProducts, formatPrice, Product, Category } from '@/lib/products';
import { fetchProducts, addProduct, deleteProduct, updateProduct, fetchOrders } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';

// Initial Mock Data
const initialOrders = [
  { id: '#CMD-2847', customer: 'Amadou Diallo', email: 'amadou.d@gmail.com', product: 'Chargeur GaN 65W', amount: 15900, status: 'Livré', date: '16 Jul 2026' },
  { id: '#CMD-2846', customer: 'Fatou Sow', email: 'fatou.sow@yahoo.fr', product: 'Écouteurs TWS Pro X1', amount: 24900, status: 'En cours', date: '16 Jul 2026' },
  { id: '#CMD-2845', customer: 'Ibrahima Bah', email: 'ibrahima.bah@gmail.com', product: 'Montre Connectée Series 8', amount: 59900, status: 'En attente', date: '15 Jul 2026' },
  { id: '#CMD-2844', customer: 'Mariama Koné', email: 'mariama.kone@hotmail.com', product: 'Power Bank 20000mAh', amount: 19900, status: 'Livré', date: '15 Jul 2026' },
  { id: '#CMD-2843', customer: 'Oumar Traoré', email: 'oumar.traore@gmail.com', product: 'Casque Audio NC Pro', amount: 45900, status: 'Livré', date: '14 Jul 2026' },
  { id: '#CMD-2842', customer: 'Khady Ndiaye', email: 'khady.n@gmail.com', product: 'Support Téléphone MagSafe', amount: 8900, status: 'Annulé', date: '14 Jul 2026' },
];

const initialCustomers = [
  { id: 'CUST-001', name: 'Amadou Diallo', email: 'amadou.d@gmail.com', city: 'Dakar', ordersCount: 5, totalSpent: 89500, type: 'VIP' },
  { id: 'CUST-002', name: 'Fatou Sow', email: 'fatou.sow@yahoo.fr', city: 'Saint-Louis', ordersCount: 3, totalSpent: 48900, type: 'Régulier' },
  { id: 'CUST-003', name: 'Ibrahima Bah', email: 'ibrahima.bah@gmail.com', city: 'Thiès', ordersCount: 2, totalSpent: 74800, type: 'Régulier' },
  { id: 'CUST-004', name: 'Mariama Koné', email: 'mariama.kone@hotmail.com', city: 'Dakar', ordersCount: 6, totalSpent: 112000, type: 'VIP' },
  { id: 'CUST-005', name: 'Oumar Traoré', email: 'oumar.traore@gmail.com', city: 'Touba', ordersCount: 1, totalSpent: 45900, type: 'Nouveau' },
  { id: 'CUST-006', name: 'Khady Ndiaye', email: 'khady.n@gmail.com', city: 'Ziguinchor', ordersCount: 4, totalSpent: 52400, type: 'Régulier' },
];

const initialPromos = [
  { code: 'SENTECH20', discount: '20%', type: 'Pourcentage', uses: 142, status: 'Actif', expires: '31 Aug 2026' },
  { code: 'BIENVENUE10', discount: '10%', type: 'Pourcentage', uses: 389, status: 'Actif', expires: '31 Dec 2026' },
  { code: 'FREESHIP', discount: 'Livraison Gratuite', type: 'Offert', uses: 95, status: 'Actif', expires: '15 Aug 2026' },
  { code: 'GAMING15', discount: '15%', type: 'Pourcentage', uses: 64, status: 'Actif', expires: '20 Jul 2026' },
  { code: 'PROMO30', discount: '30%', type: 'Pourcentage', uses: 50, status: 'Expiré', expires: '01 Jul 2026' },
];

const statusColors: Record<string, string> = {
  'Livré': '#10b981',
  'En cours': '#1b75bc',
  'En attente': '#f59e0b',
  'Annulé': '#ef4444',
};

const tabs = ['Tableau de bord', 'Produits', 'Commandes', 'Clients', 'Promotions', 'Pouvoir Admin'];

export default function AdminPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('Tableau de bord');
  const [authorized, setAuthorized] = useState(false);

  // States for live data management
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [deleteConfirm, setDeleteConfirm] = useState<{id: string, name: string} | null>(null);
  const [ordersList, setOrdersList] = useState(initialOrders);
  const [customersList] = useState(initialCustomers);
  const [promosList, setPromosList] = useState(initialPromos);

  // Filters and search states
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState('Tous');
  const [customerSearch, setCustomerSearch] = useState('');

  // Product Filter & Sorting States
  const [productCategoryFilter, setProductCategoryFilter] = useState('Toutes');
  const [productStockFilter, setProductStockFilter] = useState('Tous');
  const [productSortBy, setProductSortBy] = useState('default');

  // Modals state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddPromoModal, setShowAddPromoModal] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // New product form state
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<Category>('Chargeurs Rapides');
  const [prodBrand, setProdBrand] = useState('SenTech');
  const [prodPrice, setProdPrice] = useState('');
  const [prodStock, setProdStock] = useState('15');
  const [prodImage, setProdImage] = useState('/charger.jpg');
  const [prodCustomUrl, setProdCustomUrl] = useState('');
  const [prodDescription, setProdDescription] = useState('Accessoire high-tech premium SenTech Plus.');
  const [prodFeatures, setProdFeatures] = useState('Garantie 12 mois, Livraison Express Dakar, Qualité certifiée');
  const [prodIsNew, setProdIsNew] = useState(true);
  const [prodIsBestSeller, setProdIsBestSeller] = useState(false);
  const [prodIsPromo, setProdIsPromo] = useState(false);

  // New promo form state
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState('15%');
  const [promoExpires, setPromoExpires] = useState('31 Aug 2026');

  // Pouvoir Admin Site Control States
  const [siteAnnouncement, setSiteAnnouncement] = useState('⚡ LIVRAISON EXPRESS À DAKAR EN 24H · -20% AVEC CODE: SENTECH20');
  const [whatsappPhone, setWhatsappPhone] = useState('+221 77 000 00 00');
  const [shippingFee, setShippingFee] = useState('1500');
  const [storeStatus, setStoreStatus] = useState('En ligne');

  useEffect(() => {
    const loggedIn = localStorage.getItem('isAdminLoggedIn');
    if (loggedIn !== 'true') {
      router.replace('/admin/login');
    } else {
      setTimeout(() => {
        setAuthorized(true);
        const savedAnn = localStorage.getItem('siteAnnouncementText');
        if (savedAnn) setSiteAnnouncement(savedAnn);
        const savedPhone = localStorage.getItem('siteWhatsappPhone');
        if (savedPhone) setWhatsappPhone(savedPhone);
        const savedFee = localStorage.getItem('siteShippingFee');
        if (savedFee) setShippingFee(savedFee);
        // Load products from Supabase
        fetchProducts().then(data => {
          if (data && data.length > 0) setProductList(data as any);
        });
        // Load orders from Supabase
        fetchOrders().then(({ data }) => {
          if (data && data.length > 0) {
            // Map supabase columns
            const formattedOrders = data.map(o => ({
              id: o.id.substring(0, 8),
              customer: o.customer_name,
              email: o.customer_email,
              product: o.items?.[0]?.name || 'Produits multiples',
              amount: o.total_amount,
              status: o.status,
              date: new Date(o.created_at).toLocaleDateString()
            }));
            setOrdersList(formattedOrders as any);
          }
        });
        // Restore persisted promo list
        try {
          const savedPromos = localStorage.getItem('adminPromosList');
          if (savedPromos) {
            const parsed = JSON.parse(savedPromos);
            if (Array.isArray(parsed) && parsed.length > 0) setPromosList(parsed);
          }
        } catch {}
      }, 0);
    }
  }, [router]);

  // Products are now fetched from Supabase, so we don't need to persist them to localStorage
  // But we still persist promosList


  // Persist promosList to localStorage whenever it changes (after auth)
  useEffect(() => {
    if (!authorized) return;
    try {
      localStorage.setItem('adminPromosList', JSON.stringify(promosList));
    } catch {}
  }, [promosList, authorized]);

  const handleAdminLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    showToast('Déconnexion de la session administrateur', 'info');
    router.replace('/admin/login');
  };

  // Image Upload Handler from PC
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProdImage(reader.result);
          showToast('Image importée avec succès !', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Product actions
  const handleDeleteProduct = (id: string, name: string) => {
    setDeleteConfirm({ id, name });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    setProductList(prev => prev.filter(p => p.id !== deleteConfirm.id));
    await deleteProduct(deleteConfirm.id);
    showToast(`Produit "${deleteConfirm.name}" supprimé avec succès.`, 'success');
    setDeleteConfirm(null);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim() || !prodPrice) {
      showToast('Veuillez remplir les champs obligatoires.', 'error');
      return;
    }

    const priceNum = Number(prodPrice);
    const stockNum = Number(prodStock);
    const finalImage = prodCustomUrl.trim() ? prodCustomUrl.trim() : prodImage;
    const featuresArray = prodFeatures.split(',').map(f => f.trim()).filter(Boolean);

    if (editingProduct) {
      const updatedFields = {
        name: prodName,
        category: prodCategory,
        brand: prodBrand || 'SenTech',
        price: priceNum,
        oldPrice: priceNum * 1.2,
        image: finalImage,
        images: [finalImage],
        inStock: stockNum > 0,
        stockCount: stockNum,
        description: prodDescription,
        features: featuresArray,
        isNew: prodIsNew,
        isBestSeller: prodIsBestSeller,
        isPromo: prodIsPromo,
        badge: prodIsPromo ? 'PROMO' : prodIsBestSeller ? 'BEST SELLER' : prodIsNew ? 'NEW' : '',
      };
      // Mise à jour locale
      setProductList(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...updatedFields } : p));
      // Mise à jour Supabase
      updateProduct(editingProduct.id, updatedFields).then(({ error }) => {
        if (error) console.error('Erreur update Supabase:', error);
      });
      showToast('Produit mis à jour avec succès !', 'success');
    } else {
      const newP = {
        name: prodName,
        category: prodCategory,
        brand: prodBrand || 'SenTech',
        price: priceNum,
        oldPrice: priceNum * 1.2,
        image: finalImage,
        images: [finalImage],
        inStock: stockNum > 0,
        stockCount: stockNum,
        description: prodDescription,
        features: featuresArray,
        isNew: prodIsNew,
        isBestSeller: prodIsBestSeller,
        isPromo: prodIsPromo,
        badge: prodIsPromo ? 'PROMO' : prodIsBestSeller ? 'BEST SELLER' : prodIsNew ? 'NEW' : '',
      };
      // Sauvegarde dans Supabase
      addProduct(newP).then(() => {
        // Recharge la liste
        fetchProducts().then(data => {
          if (data) setProductList(data as any);
        });
      });
      showToast('Produit ajouté avec succès !', 'success');
    }
    setShowAddProductModal(false);
    setShowAddProductModal(false);
    setEditingProduct(null);
    resetProductForm();
  };

  const openEditProductModal = (prod: Product) => {
    setEditingProduct(prod);
    setProdName(prod.name);
    setProdCategory(prod.category);
    setProdBrand(prod.brand || 'SenTech');
    setProdPrice(String(prod.price));
    setProdStock(String(prod.stockCount));
    setProdImage(prod.image);
    setProdCustomUrl(prod.image.startsWith('http') ? prod.image : '');
    setProdDescription(prod.description || 'Accessoire high-tech premium SenTech Plus.');
    setProdFeatures(prod.features ? prod.features.join(', ') : 'Garantie 12 mois, Livraison Express Dakar');
    setProdIsNew(prod.isNew ?? true);
    setProdIsBestSeller(prod.isBestSeller ?? false);
    setProdIsPromo(prod.isPromo ?? false);
    setShowAddProductModal(true);
  };

  const resetProductForm = () => {
    setProdName('');
    setProdCategory('Chargeurs Rapides');
    setProdBrand('SenTech');
    setProdPrice('');
    setProdStock('15');
    setProdImage('/charger.jpg');
    setProdCustomUrl('');
    setProdDescription('Accessoire high-tech premium SenTech Plus.');
    setProdFeatures('Garantie 12 mois, Livraison Express Dakar, Qualité certifiée');
    setProdIsNew(true);
    setProdIsBestSeller(false);
    setProdIsPromo(false);
  };

  // Order status update
  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    setOrdersList(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast(`Commande ${orderId} marquée comme "${newStatus}" !`, 'success');
  };

  // Promo code creation
  const handleSavePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) {
      showToast('Entrez un code promo valide.', 'error');
      return;
    }
    const newPromo = {
      code: promoCode.toUpperCase().trim(),
      discount: promoDiscount,
      type: 'Pourcentage',
      uses: 0,
      status: 'Actif',
      expires: promoExpires,
    };
    setPromosList(prev => [newPromo, ...prev]);
    showToast(`Code promo "${newPromo.code}" créé !`, 'success');
    setShowAddPromoModal(false);
    setPromoCode('');
  };

  const handleDeletePromo = (code: string) => {
    setPromosList(prev => prev.filter(p => p.code !== code));
    showToast(`Code promo "${code}" désactivé !`, 'info');
  };

  const handleToggleStock = (id: string) => {
    setProductList(prev => prev.map(p => {
      if (p.id === id) {
        const nextInStock = !p.inStock;
        const nextStockCount = nextInStock ? (p.stockCount > 0 ? p.stockCount : 10) : 0;
        showToast(`Statut stock de "${p.name}" : ${nextInStock ? 'En stock' : 'Rupture'}`, 'info');
        return { ...p, inStock: nextInStock, stockCount: nextStockCount };
      }
      return p;
    }));
  };

  // Save Site Global Power Settings
  const handleSaveSiteSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('siteAnnouncementText', siteAnnouncement);
    localStorage.setItem('siteWhatsappPhone', whatsappPhone);
    localStorage.setItem('siteShippingFee', shippingFee);
    localStorage.setItem('siteStoreStatus', storeStatus);
    window.dispatchEvent(new Event('storage'));
    showToast('⚡ Pouvoir Admin : Paramètres du site enregistrés et appliqués en direct !', 'success');
  };

  // Filtered lists
  const filteredProducts = productList
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(productSearch.toLowerCase());
      const matchesCat = productCategoryFilter === 'Toutes' || p.category === productCategoryFilter;
      const matchesStock = productStockFilter === 'Tous' ||
        (productStockFilter === 'instock' && p.inStock) ||
        (productStockFilter === 'outstock' && !p.inStock);
      return matchesSearch && matchesCat && matchesStock;
    })
    .sort((a, b) => {
      if (productSortBy === 'price-asc') return a.price - b.price;
      if (productSortBy === 'price-desc') return b.price - a.price;
      if (productSortBy === 'stock-desc') return b.stockCount - a.stockCount;
      if (productSortBy === 'rating-desc') return b.rating - a.rating;
      if (productSortBy === 'name-asc') return a.name.localeCompare(b.name);
      return 0;
    });

  const filteredOrders = ordersList.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.product.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesFilter = orderFilter === 'Tous' || o.status === orderFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredCustomers = customersList.filter(c =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.city.toLowerCase().includes(customerSearch.toLowerCase())
  );

  // Stats calculate
  const totalSalesAmount = ordersList
    .filter(o => o.status === 'Livré' || o.status === 'En cours')
    .reduce((sum, o) => sum + o.amount, 0);

  const statsList = [
    { label: 'Ventes cumulées', value: formatPrice(totalSalesAmount + 2450000), change: '+18%', up: true, icon: <DollarSign size={20} color="#1b75bc" /> },
    { label: 'Commandes totales', value: String(ordersList.length + 137), change: '+12%', up: true, icon: <Box size={20} color="#1b75bc" /> },
    { label: 'Clients enregistrés', value: String(customersList.length + 886), change: '+8%', up: true, icon: <Users size={20} color="#1b75bc" /> },
    { label: 'Produits au catalogue', value: String(productList.length), change: 'Stock OK', up: true, icon: <ShoppingCart size={20} color="#1b75bc" /> },
  ];

  if (!authorized) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-background)' }}>
        <p style={{ color: 'var(--color-sentech-muted)', fontSize: '0.95rem' }}>Chargement du panneau d&apos;administration...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background)', display: 'flex' }} className="admin-layout">
      {/* Sidebar */}
      <div style={{
        width: '240px', background: 'var(--color-sentech-card)', borderRight: '1px solid var(--color-sentech-border)',
        padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0,
      }} className="admin-sidebar">
        <div style={{ padding: '12px', marginBottom: '16px' }}>
          <div style={{ position: 'relative', width: '130px', height: '32px', marginBottom: '4px' }}>
            <Image
              src="/logo_horizontal_v2.png"
              alt="SenTech Plus Admin"
              fill
              sizes="130px"
              style={{ objectFit: 'contain', filter: 'invert(1) hue-rotate(180deg)' }}
              priority
            />
          </div>
          <div style={{ fontSize: '0.65rem', color: '#1b75bc', letterSpacing: '2px', paddingLeft: '2px', fontWeight: 800 }}>SUPER ADMIN 1000%</div>
        </div>

        {tabs.map(tab => {
          const icons = {
            'Tableau de bord': <LayoutDashboard size={18} />,
            'Produits': <Package size={18} />,
            'Commandes': <ShoppingBag size={18} />,
            'Clients': <Users size={18} />,
            'Promotions': <Tag size={18} />,
            'Pouvoir Admin': <ShieldCheck size={18} color="#1b75bc" />,
          };
          return (
            <button
              key={tab}
              id={`admin-tab-${tab.toLowerCase().replace(/ /g, '-')}`}
              onClick={() => setActiveTab(tab)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                background: activeTab === tab ? 'rgba(27,117,188,0.08)' : 'transparent',
                color: activeTab === tab ? '#1b75bc' : 'var(--color-sentech-muted)',
                fontSize: '0.875rem', fontWeight: activeTab === tab ? 600 : 500,
                textAlign: 'left', width: '100%',
                borderLeft: activeTab === tab ? '3px solid #1b75bc' : '3px solid transparent',
                transition: 'all 0.2s ease',
              }}
            >
              {icons[tab as keyof typeof icons]}
              {tab}
            </button>
          );
        })}

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: '20px', borderTop: '1px solid var(--color-sentech-border)' }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer',
            background: 'transparent', color: '#475569', fontSize: '0.875rem', width: '100%', textAlign: 'left',
          }}>
            <Settings size={18} /> Paramètres
          </button>
          <button
            onClick={handleAdminLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              background: 'transparent', color: '#ef4444', fontSize: '0.875rem', width: '100%', textAlign: 'left',
            }}
          >
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Top Header */}
        <header style={{
          padding: '20px 32px', borderBottom: '1px solid var(--color-sentech-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--color-sentech-card)',
        }}>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-foreground)', fontFamily: 'Outfit, sans-serif' }}>{activeTab}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button
                aria-label="Notifications"
                onClick={() => setNotificationsOpen(o => !o)}
                style={{
                  position: 'relative', background: 'var(--color-sentech-dark)', border: '1px solid var(--color-sentech-border)',
                  borderRadius: '8px', padding: '8px', cursor: 'pointer', color: 'var(--color-foreground)',
                  display: 'flex', alignItems: 'center', transition: 'all 0.2s ease',
                }}
              >
                <Bell size={18} />
                <span style={{
                  position: 'absolute', top: '-4px', right: '-4px', width: '16px', height: '16px',
                  background: '#ef4444', borderRadius: '50%', fontSize: '0.6rem', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
                }}>3</span>
              </button>

              {notificationsOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: '100%', marginTop: '8px', width: '300px',
                  background: 'var(--color-sentech-card)', border: '1px solid var(--color-sentech-border)',
                  borderRadius: '12px', padding: '12px', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.1)',
                  zIndex: 200, animation: 'slide-down 0.2s ease-out',
                }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px', color: 'var(--color-foreground)' }}>Notifications Récentes</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
                    <div style={{ padding: '8px', borderRadius: '6px', background: 'rgba(27,117,188,0.06)', color: 'var(--color-foreground)' }}>
                      <strong>🎉 Nouvelle commande</strong> #CMD-2847 reçue de Amadou Diallo (15,900 FCFA).
                    </div>
                    <div style={{ padding: '8px', borderRadius: '6px', background: 'rgba(245,158,11,0.06)', color: 'var(--color-foreground)' }}>
                      <strong>⚠️ Stock faible</strong> pour &quot;Câble USB-C Tressé&quot; (reste 4 dispos).
                    </div>
                    <div style={{ padding: '8px', borderRadius: '6px', background: 'rgba(16,185,129,0.06)', color: 'var(--color-foreground)' }}>
                      <strong>👤 Nouveau client</strong> inscrit : Mariama Koné.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile Badge */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '6px 12px', borderRadius: '10px',
              background: 'var(--color-sentech-dark)', border: '1px solid var(--color-sentech-border)',
            }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #1b75bc, #0d528c)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, color: 'white', fontSize: '0.8rem',
              }}>A</div>
              <span style={{ color: 'var(--color-foreground)', fontSize: '0.875rem', fontWeight: 600 }}>Super Admin</span>
            </div>
          </div>
        </header>

        {/* View Tabs Content */}
        <main style={{ padding: '32px' }}>
          {/* TAB 1: TABLEAU DE BORD */}
          {activeTab === 'Tableau de bord' && (
            <div>
              {/* Stats Grid */}
              <div className="stats-grid-4" style={{ marginBottom: '32px' }}>
                {statsList.map(s => (
                  <div key={s.label} style={{
                    padding: '24px', borderRadius: '16px',
                    background: 'var(--color-sentech-card)', border: '1px solid var(--color-sentech-border)',
                    boxShadow: '0 4px 20px rgba(15, 23, 42, 0.02)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div style={{
                        width: '42px', height: '42px', borderRadius: '10px',
                        background: 'rgba(27,117,188,0.08)', border: '1px solid rgba(27,117,188,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {s.icon}
                      </div>
                      <span style={{
                        padding: '3px 8px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600,
                        background: s.up ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                        color: s.up ? '#10b981' : '#ef4444',
                      }}>
                        {s.up ? '↑' : '↓'} {s.change}
                      </span>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-foreground)', fontFamily: 'Outfit, sans-serif', marginBottom: '4px' }}>
                      {s.value}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-sentech-muted)' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Quick Actions & Recent Orders Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                <div style={{
                  background: 'var(--color-sentech-card)', border: '1px solid var(--color-sentech-border)',
                  borderRadius: '16px', overflow: 'hidden',
                }}>
                  <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-sentech-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-foreground)', fontFamily: 'Outfit, sans-serif' }}>Commandes Récentes</h2>
                    <button onClick={() => setActiveTab('Commandes')} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                      Gestion complète <ChevronRight size={14} />
                    </button>
                  </div>
                  <div className="admin-table-wrap">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: 'var(--color-sentech-dark)' }}>
                          {['Commande', 'Client', 'Produit', 'Montant', 'Statut', 'Date'].map(h => (
                            <th key={h} style={{
                              padding: '12px 20px', textAlign: 'left',
                              fontSize: '0.75rem', color: 'var(--color-sentech-muted)', textTransform: 'uppercase', letterSpacing: '1px',
                              fontWeight: 600,
                            }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {ordersList.slice(0, 5).map(order => (
                          <tr key={order.id} style={{ borderTop: '1px solid var(--color-sentech-border)' }}>
                            <td style={{ padding: '16px 20px', color: '#1b75bc', fontSize: '0.875rem', fontWeight: 600 }}>{order.id}</td>
                            <td style={{ padding: '16px 20px', color: 'var(--color-foreground)', fontSize: '0.875rem', fontWeight: 500 }}>{order.customer}</td>
                            <td style={{ padding: '16px 20px', color: 'var(--color-sentech-muted)', fontSize: '0.875rem' }}>{order.product}</td>
                            <td style={{ padding: '16px 20px', color: 'var(--color-foreground)', fontSize: '0.875rem', fontWeight: 600 }}>{formatPrice(order.amount)}</td>
                            <td style={{ padding: '16px 20px' }}>
                              <span style={{
                                padding: '3px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600,
                                background: `${statusColors[order.status]}15`,
                                color: statusColors[order.status],
                                border: `1px solid ${statusColors[order.status]}40`,
                              }}>
                                {order.status}
                              </span>
                            </td>
                            <td style={{ padding: '16px 20px', color: '#475569', fontSize: '0.875rem' }}>{order.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUITS */}
          {activeTab === 'Produits' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '280px', flexWrap: 'wrap' }}>
                  {/* Search Input */}
                  <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                    <label htmlFor="admin-search-input" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
                      Rechercher un produit
                    </label>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} aria-hidden="true" />
                    <input
                      id="admin-search-input"
                      type="text"
                      placeholder="Rechercher par nom..."
                      value={productSearch}
                      onChange={e => setProductSearch(e.target.value)}
                      className="sentech-input"
                      style={{ paddingLeft: '38px', fontSize: '0.875rem' }}
                    />
                  </div>

                  {/* Category Filter Dropdown */}
                  <select
                    value={productCategoryFilter}
                    onChange={e => setProductCategoryFilter(e.target.value)}
                    style={{
                      padding: '10px 12px', borderRadius: '10px',
                      border: '1px solid var(--color-sentech-border)',
                      background: 'var(--color-sentech-dark)', color: 'var(--color-foreground)',
                      fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer',
                    }}
                  >
                    <option value="Toutes">Toutes les catégories</option>
                    <option value="Chargeurs Rapides">Chargeurs Rapides</option>
                    <option value="Câbles Premium">Câbles Premium</option>
                    <option value="Supports Téléphone">Supports Téléphone</option>
                    <option value="Écouteurs Bluetooth">Écouteurs Bluetooth</option>
                    <option value="Casques Audio">Casques Audio</option>
                    <option value="Montres Connectées">Montres Connectées</option>
                    <option value="Batteries Externes">Batteries Externes</option>
                    <option value="Accessoires PC">Accessoires PC</option>
                    <option value="Gaming">Gaming</option>
                  </select>

                  {/* Stock Filter Dropdown */}
                  <select
                    value={productStockFilter}
                    onChange={e => setProductStockFilter(e.target.value)}
                    style={{
                      padding: '10px 12px', borderRadius: '10px',
                      border: '1px solid var(--color-sentech-border)',
                      background: 'var(--color-sentech-dark)', color: 'var(--color-foreground)',
                      fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer',
                    }}
                  >
                    <option value="Tous">Tous les stocks</option>
                    <option value="instock">En stock uniquement</option>
                    <option value="outstock">Rupture de stock</option>
                  </select>

                  {/* Sort By Dropdown */}
                  <select
                    value={productSortBy}
                    onChange={e => setProductSortBy(e.target.value)}
                    style={{
                      padding: '10px 12px', borderRadius: '10px',
                      border: '1px solid var(--color-sentech-border)',
                      background: 'var(--color-sentech-dark)', color: 'var(--color-foreground)',
                      fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer',
                    }}
                  >
                    <option value="default">Tri : Défaut</option>
                    <option value="name-asc">Nom (A-Z)</option>
                    <option value="price-asc">Prix croissant</option>
                    <option value="price-desc">Prix décroissant</option>
                    <option value="stock-desc">Stock le plus élevé</option>
                    <option value="rating-desc">Meilleures notes</option>
                  </select>
                </div>

                <button
                  id="admin-add-product"
                  onClick={() => { setEditingProduct(null); resetProductForm(); setShowAddProductModal(true); }}
                  className="btn-primary"
                  style={{ padding: '10px 18px', fontSize: '0.875rem' }}
                >
                  <Plus size={16} /> Ajouter un produit
                </button>
              </div>

              <div style={{ background: 'var(--color-sentech-card)', border: '1px solid var(--color-sentech-border)', borderRadius: '16px', overflow: 'hidden' }}>
                <div className="admin-table-wrap">
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'var(--color-sentech-dark)' }}>
                        {['Produit', 'Catégorie', 'Prix', 'Stock', 'Badges', 'Actions'].map(h => (
                          <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.75rem', color: 'var(--color-sentech-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map(p => (
                        <tr key={p.id} style={{ borderTop: '1px solid var(--color-sentech-border)' }}>
                          <td style={{ padding: '14px 20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--color-sentech-dark)', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                                <Image
                                  src={p.image}
                                  alt={p.name}
                                  fill
                                  sizes="40px"
                                  style={{ objectFit: 'cover' }}
                                />
                              </div>
                              <div>
                                <span style={{ color: 'var(--color-foreground)', fontSize: '0.875rem', fontWeight: 600, display: 'block' }}>{p.name}</span>
                                <span style={{ color: '#475569', fontSize: '0.75rem' }}>{p.brand || 'SenTech'}</span>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '14px 20px', color: 'var(--color-sentech-muted)', fontSize: '0.85rem' }}>{p.category}</td>
                          <td style={{ padding: '14px 20px', color: 'var(--color-foreground)', fontSize: '0.875rem', fontWeight: 700 }}>{formatPrice(p.price)}</td>
                          <td style={{ padding: '14px 20px' }}>
                            <span style={{
                              padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600,
                              background: p.inStock ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                              color: p.inStock ? '#10b981' : '#ef4444',
                            }}>
                              {p.inStock ? `${p.stockCount} en stock` : 'Rupture'}
                            </span>
                          </td>
                          <td style={{ padding: '14px 20px' }}>
                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                              {p.isNew && <span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(27,117,188,0.1)', color: '#1b75bc', fontWeight: 600 }}>Nouveau</span>}
                              {p.isBestSeller && <span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', fontWeight: 600 }}>Best-Seller</span>}
                              {p.isPromo && <span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontWeight: 600 }}>Promo</span>}
                            </div>
                          </td>
                          <td style={{ padding: '14px 20px' }}>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                onClick={() => handleToggleStock(p.id)}
                                title={p.inStock ? 'Passer en rupture' : 'Remettre en stock'}
                                style={{
                                  background: p.inStock ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                                  border: p.inStock ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(239,68,68,0.2)',
                                  borderRadius: '6px', padding: '6px 8px', cursor: 'pointer',
                                  color: p.inStock ? '#10b981' : '#ef4444',
                                  fontSize: '0.75rem', fontWeight: 600,
                                }}
                              >
                                {p.inStock ? 'Stock OK' : 'Rupture'}
                              </button>
                              <button
                                onClick={() => openEditProductModal(p)}
                                aria-label={`Modifier ${p.name}`}
                                style={{
                                  background: 'rgba(27,117,188,0.08)', border: '1px solid rgba(27,117,188,0.2)',
                                  borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', color: '#1b75bc',
                                  display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', fontWeight: 600,
                                }}
                              >
                                <Edit size={13} /> Modifier
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                aria-label={`Supprimer ${p.name}`}
                                style={{
                                  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                                  borderRadius: '6px', padding: '6px 8px', cursor: 'pointer', color: '#ef4444',
                                  display: 'flex', alignItems: 'center',
                                }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COMMANDES */}
          {activeTab === 'Commandes' && (
            <div>
              {/* Controls & Search */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '400px', width: '100%' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                  <input
                    type="text"
                    placeholder="Rechercher par ID, client ou produit..."
                    value={orderSearch}
                    onChange={e => setOrderSearch(e.target.value)}
                    className="sentech-input"
                    style={{ paddingLeft: '38px', fontSize: '0.875rem' }}
                  />
                </div>

                {/* Status Filter Tabs */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {['Tous', 'En cours', 'Livré', 'En attente', 'Annulé'].map(st => (
                    <button
                      key={st}
                      onClick={() => setOrderFilter(st)}
                      style={{
                        padding: '8px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                        background: orderFilter === st ? '#1b75bc' : 'var(--color-sentech-dark)',
                        color: orderFilter === st ? 'white' : 'var(--color-sentech-muted)',
                        fontSize: '0.82rem', fontWeight: 600, transition: 'all 0.2s ease',
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ background: 'var(--color-sentech-card)', border: '1px solid var(--color-sentech-border)', borderRadius: '16px', overflow: 'hidden' }}>
                <div className="admin-table-wrap">
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'var(--color-sentech-dark)' }}>
                        {['N° Commande', 'Client', 'Article', 'Montant', 'Statut Actuel', 'Mettre à jour le statut', 'Date'].map(h => (
                          <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.75rem', color: 'var(--color-sentech-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map(order => (
                        <tr key={order.id} style={{ borderTop: '1px solid var(--color-sentech-border)' }}>
                          <td style={{ padding: '16px 20px', color: '#1b75bc', fontSize: '0.875rem', fontWeight: 700 }}>{order.id}</td>
                          <td style={{ padding: '16px 20px' }}>
                            <div style={{ color: 'var(--color-foreground)', fontSize: '0.875rem', fontWeight: 600 }}>{order.customer}</div>
                            <div style={{ color: '#475569', fontSize: '0.75rem' }}>{order.email}</div>
                          </td>
                          <td style={{ padding: '16px 20px', color: 'var(--color-foreground)', fontSize: '0.875rem' }}>{order.product}</td>
                          <td style={{ padding: '16px 20px', color: 'var(--color-foreground)', fontSize: '0.875rem', fontWeight: 700 }}>{formatPrice(order.amount)}</td>
                          <td style={{ padding: '16px 20px' }}>
                            <span style={{
                              padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600,
                              background: `${statusColors[order.status]}15`,
                              color: statusColors[order.status],
                              border: `1px solid ${statusColors[order.status]}40`,
                            }}>
                              {order.status}
                            </span>
                          </td>
                          <td style={{ padding: '16px 20px' }}>
                            <select
                              value={order.status}
                              onChange={e => handleUpdateOrderStatus(order.id, e.target.value)}
                              style={{
                                padding: '6px 10px', borderRadius: '8px',
                                border: '1px solid var(--color-sentech-border)',
                                background: 'var(--color-sentech-dark)',
                                color: 'var(--color-foreground)',
                                fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer',
                              }}
                            >
                              <option value="En attente">En attente</option>
                              <option value="En cours">En cours</option>
                              <option value="Livré">Livré</option>
                              <option value="Annulé">Annulé</option>
                            </select>
                          </td>
                          <td style={{ padding: '16px 20px', color: '#475569', fontSize: '0.85rem' }}>{order.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CLIENTS */}
          {activeTab === 'Clients' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '400px', width: '100%' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, email ou ville..."
                    value={customerSearch}
                    onChange={e => setCustomerSearch(e.target.value)}
                    className="sentech-input"
                    style={{ paddingLeft: '38px', fontSize: '0.875rem' }}
                  />
                </div>
              </div>

              <div style={{ background: 'var(--color-sentech-card)', border: '1px solid var(--color-sentech-border)', borderRadius: '16px', overflow: 'hidden' }}>
                <div className="admin-table-wrap">
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'var(--color-sentech-dark)' }}>
                        {['Réf', 'Nom complet', 'Email', 'Ville', 'Commandes', 'Total Dépensé', 'Statut Client', 'Actions'].map(h => (
                          <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.75rem', color: 'var(--color-sentech-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.map(cust => (
                        <tr key={cust.id} style={{ borderTop: '1px solid var(--color-sentech-border)' }}>
                          <td style={{ padding: '16px 20px', color: '#475569', fontSize: '0.8rem', fontWeight: 600 }}>{cust.id}</td>
                          <td style={{ padding: '16px 20px', color: 'var(--color-foreground)', fontSize: '0.875rem', fontWeight: 600 }}>{cust.name}</td>
                          <td style={{ padding: '16px 20px', color: '#475569', fontSize: '0.85rem' }}>{cust.email}</td>
                          <td style={{ padding: '16px 20px', color: 'var(--color-foreground)', fontSize: '0.85rem' }}>{cust.city}</td>
                          <td style={{ padding: '16px 20px', color: 'var(--color-foreground)', fontSize: '0.875rem', fontWeight: 600 }}>{cust.ordersCount} cmd</td>
                          <td style={{ padding: '16px 20px', color: '#1b75bc', fontSize: '0.875rem', fontWeight: 700 }}>{formatPrice(cust.totalSpent)}</td>
                          <td style={{ padding: '16px 20px' }}>
                            <span style={{
                              padding: '3px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600,
                              background: cust.type === 'VIP' ? 'rgba(168,85,247,0.1)' : 'rgba(27,117,188,0.1)',
                              color: cust.type === 'VIP' ? '#a855f7' : '#1b75bc',
                            }}>
                              {cust.type}
                            </span>
                          </td>
                          <td style={{ padding: '16px 20px' }}>
                            <button
                              onClick={() => showToast(`Message envoyé à ${cust.email}`, 'success')}
                              style={{
                                background: 'rgba(27,117,188,0.08)', border: '1px solid rgba(27,117,188,0.2)',
                                borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', color: '#1b75bc',
                                display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 600,
                              }}
                            >
                              <Mail size={13} /> Contacter
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PROMOTIONS */}
          {activeTab === 'Promotions' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-foreground)', fontFamily: 'Outfit, sans-serif' }}>Codes Promo & Réductions</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-sentech-muted)' }}>Gérez les coupons et réductions actifs sur la boutique.</p>
                </div>
                <button
                  onClick={() => setShowAddPromoModal(true)}
                  className="btn-primary"
                  style={{ padding: '10px 18px', fontSize: '0.875rem' }}
                >
                  <Plus size={16} /> Créer un code promo
                </button>
              </div>

              <div style={{ background: 'var(--color-sentech-card)', border: '1px solid var(--color-sentech-border)', borderRadius: '16px', overflow: 'hidden' }}>
                <div className="admin-table-wrap">
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'var(--color-sentech-dark)' }}>
                        {['Code Promo', 'Réduction', 'Type', 'Utilisations', 'Statut', 'Expiration', 'Actions'].map(h => (
                          <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.75rem', color: 'var(--color-sentech-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {promosList.map(promo => (
                        <tr key={promo.code} style={{ borderTop: '1px solid var(--color-sentech-border)' }}>
                          <td style={{ padding: '16px 20px', color: '#1b75bc', fontSize: '0.95rem', fontWeight: 800, fontFamily: 'monospace' }}>{promo.code}</td>
                          <td style={{ padding: '16px 20px', color: 'var(--color-foreground)', fontSize: '0.875rem', fontWeight: 700 }}>{promo.discount}</td>
                          <td style={{ padding: '16px 20px', color: 'var(--color-sentech-muted)', fontSize: '0.85rem' }}>{promo.type}</td>
                          <td style={{ padding: '16px 20px', color: 'var(--color-foreground)', fontSize: '0.875rem', fontWeight: 600 }}>{promo.uses} fois</td>
                          <td style={{ padding: '16px 20px' }}>
                            <span style={{
                              padding: '3px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600,
                              background: promo.status === 'Actif' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                              color: promo.status === 'Actif' ? '#10b981' : '#ef4444',
                            }}>
                              {promo.status}
                            </span>
                          </td>
                          <td style={{ padding: '16px 20px', color: '#475569', fontSize: '0.85rem' }}>{promo.expires}</td>
                          <td style={{ padding: '16px 20px' }}>
                            <button
                              onClick={() => handleDeletePromo(promo.code)}
                              aria-label={`Supprimer ${promo.code}`}
                              style={{
                                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                                borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', color: '#ef4444',
                                display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem',
                              }}
                            >
                              <Trash2 size={13} /> Désactiver
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: POUVOIR ADMIN (SUPER SITE CONTROL) */}
          {activeTab === 'Pouvoir Admin' && (
            <div style={{ maxWidth: '800px' }}>
              <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '100px', background: 'rgba(27,117,188,0.1)', color: '#1b75bc', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                  <Zap size={14} color="#1b75bc" /> Contrôle Total 1000%
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-foreground)', fontFamily: 'Outfit, sans-serif' }}>
                  Pouvoir Administrateur Globale du Site
                </h2>
                <p style={{ color: 'var(--color-sentech-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
                  Prenez le contrôle direct sur la bande d&apos;annonce supérieure, le statut général de la boutique, la livraison et les numéros clients en direct.
                </p>
              </div>

              <form onSubmit={handleSaveSiteSettings} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* 1. Bande d'annonce supérieure */}
                <div style={{
                  padding: '24px', borderRadius: '16px', background: 'var(--color-sentech-card)',
                  border: '1px solid var(--color-sentech-border)', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.02)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <Sliders size={20} color="#1b75bc" />
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-foreground)', fontFamily: 'Outfit, sans-serif' }}>
                      Bande d&apos;Annonce Supérieure (Top Banner)
                    </h3>
                  </div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-sentech-muted)', marginBottom: '8px' }}>
                    Texte affiché tout en haut de la barre de navigation sur toutes les pages :
                  </label>
                  <input
                    type="text"
                    value={siteAnnouncement}
                    onChange={e => setSiteAnnouncement(e.target.value)}
                    className="sentech-input"
                    style={{ fontSize: '0.9rem', fontWeight: 600 }}
                  />
                </div>

                {/* 2. Paramètres de Boutique & WhatsApp */}
                <div style={{
                  padding: '24px', borderRadius: '16px', background: 'var(--color-sentech-card)',
                  border: '1px solid var(--color-sentech-border)', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.02)',
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px',
                }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '8px' }}>
                      Numéro WhatsApp Client
                    </label>
                    <input
                      type="text"
                      value={whatsappPhone}
                      onChange={e => setWhatsappPhone(e.target.value)}
                      className="sentech-input"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '8px' }}>
                      Frais de Livraison (FCFA)
                    </label>
                    <input
                      type="number"
                      value={shippingFee}
                      onChange={e => setShippingFee(e.target.value)}
                      className="sentech-input"
                    />
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '8px' }}>
                      Statut Général de la Boutique
                    </label>
                    <select
                      value={storeStatus}
                      onChange={e => setStoreStatus(e.target.value)}
                      style={{
                        width: '100%', padding: '12px', borderRadius: '10px',
                        border: '1px solid var(--color-sentech-border)',
                        background: 'var(--color-sentech-dark)', color: 'var(--color-foreground)',
                        fontSize: '0.9rem', fontWeight: 600,
                      }}
                    >
                      <option value="En ligne">🟢 En ligne (Boutique active 24h/7j)</option>
                      <option value="Promo Flash">🔥 Mode Grandes Promotions (Bannière spéciale)</option>
                      <option value="Maintenance">🟠 Mode Maintenance (Accès restreint)</option>
                    </select>
                  </div>
                </div>

                {/* Save Button */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <button type="submit" className="btn-primary" style={{ padding: '14px 28px', fontSize: '0.95rem' }}>
                    <Zap size={18} /> Appliquer les changements 1000%
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem('siteAnnouncementText');
                      localStorage.removeItem('siteWhatsappPhone');
                      localStorage.removeItem('siteShippingFee');
                      localStorage.removeItem('siteStoreStatus');
                      setSiteAnnouncement('⚡ LIVRAISON EXPRESS À DAKAR EN 24H · -20% AVEC CODE: SENTECH20');
                      setWhatsappPhone('+221 77 000 00 00');
                      setShippingFee('1500');
                      setStoreStatus('En ligne');
                      window.dispatchEvent(new Event('storage'));
                      showToast('Paramètres réinitialisés aux valeurs par défaut.', 'info');
                    }}
                    className="btn-secondary"
                    style={{ padding: '14px 20px', fontSize: '0.875rem' }}
                  >
                    <RefreshCw size={16} /> Réinitialiser
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* MODAL COMPLET: AJOUTER / MODIFIER UN PRODUIT */}
      {showAddProductModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowAddProductModal(false); }}>
          <div className="modal-content" style={{ maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-foreground)', fontFamily: 'Outfit, sans-serif' }}>
                {editingProduct ? 'Modifier le Produit' : 'Ajouter un Produit au Catalogue'}
              </h2>
              <button
                onClick={() => setShowAddProductModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-sentech-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* SECTION 1: INFOS GÉNÉRALES */}
              <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--color-sentech-dark)', border: '1px solid var(--color-sentech-border)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1b75bc', textTransform: 'uppercase', letterSpacing: '0.5px' }}>1. Informations Générales</div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '6px' }}>
                    Nom du produit *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Chargeur GaN 100W Ultra-Rapide"
                    value={prodName}
                    onChange={e => setProdName(e.target.value)}
                    className="sentech-input"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '6px' }}>
                      Catégorie *
                    </label>
                    <select
                      value={prodCategory}
                      onChange={e => setProdCategory(e.target.value as Category)}
                      style={{
                        width: '100%', padding: '12px', borderRadius: '10px',
                        border: '1px solid var(--color-sentech-border)',
                        background: 'var(--color-sentech-card)', color: 'var(--color-foreground)',
                        fontSize: '0.875rem', fontWeight: 500,
                      }}
                    >
                      <option value="Chargeurs Rapides">⚡ Chargeurs Rapides</option>
                      <option value="Câbles Premium">🔌 Câbles Premium</option>
                      <option value="Supports Téléphone">📱 Supports Téléphone</option>
                      <option value="Écouteurs Bluetooth">🎧 Écouteurs Bluetooth</option>
                      <option value="Casques Audio">🎵 Casques Audio</option>
                      <option value="Montres Connectées">⌚ Montres Connectées</option>
                      <option value="Batteries Externes">🔋 Batteries Externes</option>
                      <option value="Accessoires PC">💻 Accessoires PC</option>
                      <option value="Gaming">🎮 Gaming</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '6px' }}>
                      Marque
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: SenTech, Anker, Apple"
                      value={prodBrand}
                      onChange={e => setProdBrand(e.target.value)}
                      className="sentech-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '6px' }}>
                      Prix (FCFA) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="19900"
                      value={prodPrice}
                      onChange={e => setProdPrice(e.target.value)}
                      className="sentech-input"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '6px' }}>
                      Quantité en Stock
                    </label>
                    <input
                      type="number"
                      value={prodStock}
                      onChange={e => setProdStock(e.target.value)}
                      className="sentech-input"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: IMPORTATION & CHOIX D'IMAGE */}
              <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--color-sentech-dark)', border: '1px solid var(--color-sentech-border)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1b75bc', textTransform: 'uppercase', letterSpacing: '0.5px' }}>2. Importation & Image du Produit</div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  {/* Image Preview Box */}
                  <div style={{
                    width: '70px', height: '70px', borderRadius: '12px',
                    background: 'var(--color-sentech-card)', border: '1px solid var(--color-sentech-border)',
                    overflow: 'hidden', position: 'relative', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Image
                      src={prodCustomUrl.trim() ? prodCustomUrl.trim() : prodImage}
                      alt="Aperçu du produit"
                      fill
                      sizes="70px"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      padding: '10px 16px', borderRadius: '100px', background: 'rgba(27,117,188,0.1)',
                      color: '#1b75bc', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                      border: '1px solid rgba(27,117,188,0.2)', width: 'fit-content',
                    }}>
                      <Upload size={15} /> Importer depuis votre ordinateur
                      <input type="file" accept="image/*" onChange={handleImageFileUpload} style={{ display: 'none' }} />
                    </label>
                    <span style={{ fontSize: '0.75rem', color: '#475569' }}>Formats acceptés: JPG, PNG, WebP</span>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '6px' }}>
                    Ou saisir l&apos;URL personnalisée de l&apos;image :
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={prodCustomUrl}
                    onChange={e => setProdCustomUrl(e.target.value)}
                    className="sentech-input"
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '6px' }}>
                    Ou choisir dans la banque d&apos;images par défaut :
                  </label>
                  <select
                    value={prodImage}
                    onChange={e => { setProdImage(e.target.value); setProdCustomUrl(''); }}
                    style={{
                      width: '100%', padding: '12px', borderRadius: '10px',
                      border: '1px solid var(--color-sentech-border)',
                      background: 'var(--color-sentech-card)', color: 'var(--color-foreground)',
                      fontSize: '0.875rem', fontWeight: 500,
                    }}
                  >
                    <option value="/charger.jpg">🔌 Chargeur Rapide GaN</option>
                    <option value="/earbuds.jpg">🎧 Écouteurs TWS Bluetooth</option>
                    <option value="/smartwatch.jpg">⌚ Montre Connectée Pro</option>
                    <option value="/powerbank.jpg">🔋 Power Bank 20000mAh</option>
                    <option value="/headphones.jpg">🎵 Casque Audio NC</option>
                    <option value="/stand.jpg">📱 Support Téléphone MagSafe</option>
                  </select>
                </div>
              </div>

              {/* SECTION 3: DESCRIPTION & SPÉCIFICATIONS */}
              <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--color-sentech-dark)', border: '1px solid var(--color-sentech-border)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1b75bc', textTransform: 'uppercase', letterSpacing: '0.5px' }}>3. Description & Spécifications</div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '6px' }}>
                    Description complète du produit
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Description détaillée du produit et avantages..."
                    value={prodDescription}
                    onChange={e => setProdDescription(e.target.value)}
                    className="sentech-input"
                    style={{ fontSize: '0.85rem', lineHeight: '1.5' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '6px' }}>
                    Caractéristiques clés (séparées par une virgule)
                  </label>
                  <input
                    type="text"
                    placeholder="Garantie 12 mois, Livraison 24h, Puce intelligente"
                    value={prodFeatures}
                    onChange={e => setProdFeatures(e.target.value)}
                    className="sentech-input"
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* SECTION 4: BADGES DE MISE EN AVANT */}
              <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--color-sentech-dark)', border: '1px solid var(--color-sentech-border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1b75bc', textTransform: 'uppercase', letterSpacing: '0.5px' }}>4. Badges & Classement de Mise en Avant</div>

                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setProdIsNew(v => !v)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '10px 14px', borderRadius: '10px', cursor: 'pointer',
                      background: prodIsNew ? 'rgba(27,117,188,0.12)' : 'var(--color-sentech-card)',
                      border: prodIsNew ? '1px solid #1b75bc' : '1px solid var(--color-sentech-border)',
                      color: prodIsNew ? '#1b75bc' : 'var(--color-sentech-muted)',
                      fontSize: '0.82rem', fontWeight: 600,
                    }}
                  >
                    {prodIsNew ? <CheckSquare size={16} color="#1b75bc" /> : <Square size={16} />}
                    ✨ Nouveauté
                  </button>

                  <button
                    type="button"
                    onClick={() => setProdIsBestSeller(v => !v)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '10px 14px', borderRadius: '10px', cursor: 'pointer',
                      background: prodIsBestSeller ? 'rgba(245,158,11,0.12)' : 'var(--color-sentech-card)',
                      border: prodIsBestSeller ? '1px solid #f59e0b' : '1px solid var(--color-sentech-border)',
                      color: prodIsBestSeller ? '#f59e0b' : 'var(--color-sentech-muted)',
                      fontSize: '0.82rem', fontWeight: 600,
                    }}
                  >
                    {prodIsBestSeller ? <CheckSquare size={16} color="#f59e0b" /> : <Square size={16} />}
                    🔥 Meilleure Vente
                  </button>

                  <button
                    type="button"
                    onClick={() => setProdIsPromo(v => !v)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '10px 14px', borderRadius: '10px', cursor: 'pointer',
                      background: prodIsPromo ? 'rgba(239,68,68,0.12)' : 'var(--color-sentech-card)',
                      border: prodIsPromo ? '1px solid #ef4444' : '1px solid var(--color-sentech-border)',
                      color: prodIsPromo ? '#ef4444' : 'var(--color-sentech-muted)',
                      fontSize: '0.82rem', fontWeight: 600,
                    }}
                  >
                    {prodIsPromo ? <CheckSquare size={16} color="#ef4444" /> : <Square size={16} />}
                    🏷️ En Promotion
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '12px', justifyContent: 'center' }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1, padding: '12px', justifyContent: 'center' }}
                >
                  Enregistrer le Produit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AJOUTER UN CODE PROMO */}
      {showAddPromoModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowAddPromoModal(false); }}>
          <div className="modal-content" style={{ maxWidth: '440px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-foreground)', fontFamily: 'Outfit, sans-serif' }}>
                Créer un Code Promo
              </h2>
              <button
                onClick={() => setShowAddPromoModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-sentech-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSavePromo} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '6px' }}>
                  Code Promo (ex: REDUC25) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="SENTECH25"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                  className="sentech-input"
                  style={{ textTransform: 'uppercase', fontFamily: 'monospace', fontWeight: 700 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '6px' }}>
                  Valeur de la réduction
                </label>
                <input
                  type="text"
                  placeholder="25% ou 5000 FCFA"
                  value={promoDiscount}
                  onChange={e => setPromoDiscount(e.target.value)}
                  className="sentech-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '6px' }}>
                  Date d&apos;expiration
                </label>
                <input
                  type="text"
                  value={promoExpires}
                  onChange={e => setPromoExpires(e.target.value)}
                  className="sentech-input"
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddPromoModal(false)}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '12px', justifyContent: 'center' }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1, padding: '12px', justifyContent: 'center' }}
                >
                  Créer le Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '24px',
        }}>
          <div style={{
            background: 'var(--color-sentech-card)', borderRadius: '24px', width: '100%', maxWidth: '400px',
            boxShadow: '0 24px 48px rgba(0,0,0,0.2)', border: '1px solid var(--color-sentech-border)',
            padding: '32px', textAlign: 'center',
          }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)',
              border: '2px solid rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#ef4444', fontSize: '24px', margin: '0 auto 20px',
            }}>
              <AlertTriangle size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-foreground)', marginBottom: '12px' }}>
              Confirmer la suppression
            </h3>
            <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '32px', lineHeight: 1.5 }}>
              Voulez-vous vraiment supprimer le produit <strong>&quot;{deleteConfirm.name}&quot;</strong> ? Cette action est irréversible.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="btn-secondary"
                style={{ flex: 1, padding: '14px', justifyContent: 'center' }}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="btn-primary"
                style={{ flex: 1, padding: '14px', justifyContent: 'center', background: '#ef4444', borderColor: '#ef4444', color: 'white' }}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
