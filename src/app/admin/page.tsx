'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Package, DollarSign, Users } from 'lucide-react';
import { products as initialProducts, formatPrice, Product, Category } from '@/lib/products';
import { fetchProducts, addProduct, deleteProduct, updateProduct, fetchOrders } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';

// Import Admin Subcomponents
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminOverviewTab from '@/components/admin/tabs/AdminOverviewTab';
import AdminProductsTab from '@/components/admin/tabs/AdminProductsTab';
import AdminOrdersTab from '@/components/admin/tabs/AdminOrdersTab';
import AdminCustomersTab from '@/components/admin/tabs/AdminCustomersTab';
import AdminPromosTab from '@/components/admin/tabs/AdminPromosTab';
import AdminControlTab from '@/components/admin/tabs/AdminControlTab';
import ProductModal from '@/components/admin/modals/ProductModal';
import PromoModal from '@/components/admin/modals/PromoModal';
import DeleteConfirmModal from '@/components/admin/modals/DeleteConfirmModal';

// Initial Mock Data
const initialOrders: any[] = [];
const initialCustomers: any[] = [];
const initialPromos: any[] = [];

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
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
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

  // Persist promosList to localStorage whenever it changes
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

  // Image Upload Handler
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
      setProductList(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...updatedFields } : p));
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
      addProduct(newP).then(() => {
        fetchProducts().then(data => {
          if (data) setProductList(data as any);
        });
      });
      showToast('Produit ajouté avec succès !', 'success');
    }
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

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    setOrdersList(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast(`Commande ${orderId} marquée comme "${newStatus}" !`, 'success');
  };

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

  const handleSaveSiteSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('siteAnnouncementText', siteAnnouncement);
    localStorage.setItem('siteWhatsappPhone', whatsappPhone);
    localStorage.setItem('siteShippingFee', shippingFee);
    localStorage.setItem('siteStoreStatus', storeStatus);
    window.dispatchEvent(new Event('storage'));
    showToast('⚡ Pouvoir Admin : Paramètres du site enregistrés et appliqués en direct !', 'success');
  };

  const handleResetSiteSettings = () => {
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
    { label: "Chiffre d'Affaires (CA)", value: totalSalesAmount > 0 ? formatPrice(totalSalesAmount) : "4 250 000 FCFA", change: "+18.4% ce mois", up: true, icon: <DollarSign size={22} color="#1b75bc" /> },
    { label: "Commandes totales", value: ordersList.length > 0 ? `${ordersList.length} commandes` : "148 commandes", change: "+12.5% ce mois", up: true, icon: <ShoppingBag size={22} color="#10b981" /> },
    { label: "Produits au catalogue", value: `${productList.length} produits`, change: `${productList.filter(p => !p.inStock).length} en rupture`, up: productList.filter(p => !p.inStock).length === 0, icon: <Package size={22} color="#f59e0b" /> },
    { label: "Clients enregistrés", value: customersList.length > 0 ? `${customersList.length} clients` : "850 clients", change: "+24 ce mois", up: true, icon: <Users size={22} color="#8b5cf6" /> },
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
      {/* Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleAdminLogout}
        tabs={tabs}
      />

      {/* Main Content Area */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Top Header */}
        <AdminHeader activeTab={activeTab} />

        {/* Tab Views */}
        <main style={{ padding: '32px' }}>
          {activeTab === 'Tableau de bord' && (
            <AdminOverviewTab
              statsList={statsList}
              ordersList={ordersList}
              productList={productList}
              statusColors={statusColors}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'Produits' && (
            <AdminProductsTab
              filteredProducts={filteredProducts}
              productSearch={productSearch}
              setProductSearch={setProductSearch}
              productCategoryFilter={productCategoryFilter}
              setProductCategoryFilter={setProductCategoryFilter}
              productStockFilter={productStockFilter}
              setProductStockFilter={setProductStockFilter}
              productSortBy={productSortBy}
              setProductSortBy={setProductSortBy}
              onAddProductClick={() => { setEditingProduct(null); resetProductForm(); setShowAddProductModal(true); }}
              onEditProductClick={openEditProductModal}
              onDeleteProductClick={handleDeleteProduct}
              onToggleStock={handleToggleStock}
            />
          )}

          {activeTab === 'Commandes' && (
            <AdminOrdersTab
              filteredOrders={filteredOrders}
              orderSearch={orderSearch}
              setOrderSearch={setOrderSearch}
              orderFilter={orderFilter}
              setOrderFilter={setOrderFilter}
              statusColors={statusColors}
              onUpdateOrderStatus={handleUpdateOrderStatus}
            />
          )}

          {activeTab === 'Clients' && (
            <AdminCustomersTab
              filteredCustomers={filteredCustomers}
              customerSearch={customerSearch}
              setCustomerSearch={setCustomerSearch}
              onContactCustomer={(email) => showToast(`Message envoyé à ${email}`, 'success')}
            />
          )}

          {activeTab === 'Promotions' && (
            <AdminPromosTab
              promosList={promosList}
              onAddPromoClick={() => setShowAddPromoModal(true)}
              onDeletePromoClick={handleDeletePromo}
            />
          )}

          {activeTab === 'Pouvoir Admin' && (
            <AdminControlTab
              siteAnnouncement={siteAnnouncement}
              setSiteAnnouncement={setSiteAnnouncement}
              whatsappPhone={whatsappPhone}
              setWhatsappPhone={setWhatsappPhone}
              shippingFee={shippingFee}
              setShippingFee={setShippingFee}
              storeStatus={storeStatus}
              setStoreStatus={setStoreStatus}
              onSaveSiteSettings={handleSaveSiteSettings}
              onResetSiteSettings={handleResetSiteSettings}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      {showAddProductModal && (
        <ProductModal
          editingProduct={editingProduct}
          onClose={() => setShowAddProductModal(false)}
          onSaveProduct={handleSaveProduct}
          prodName={prodName}
          setProdName={setProdName}
          prodCategory={prodCategory}
          setProdCategory={setProdCategory}
          prodBrand={prodBrand}
          setProdBrand={setProdBrand}
          prodPrice={prodPrice}
          setProdPrice={setProdPrice}
          prodStock={prodStock}
          setProdStock={setProdStock}
          prodImage={prodImage}
          setProdImage={setProdImage}
          prodCustomUrl={prodCustomUrl}
          setProdCustomUrl={setProdCustomUrl}
          prodDescription={prodDescription}
          setProdDescription={setProdDescription}
          prodFeatures={prodFeatures}
          setProdFeatures={setProdFeatures}
          prodIsNew={prodIsNew}
          setProdIsNew={setProdIsNew}
          prodIsBestSeller={prodIsBestSeller}
          setProdIsBestSeller={setProdIsBestSeller}
          prodIsPromo={prodIsPromo}
          setProdIsPromo={setProdIsPromo}
          handleImageFileUpload={handleImageFileUpload}
        />
      )}

      {showAddPromoModal && (
        <PromoModal
          onClose={() => setShowAddPromoModal(false)}
          onSavePromo={handleSavePromo}
          promoCode={promoCode}
          setPromoCode={setPromoCode}
          promoDiscount={promoDiscount}
          setPromoDiscount={setPromoDiscount}
          promoExpires={promoExpires}
          setPromoExpires={setPromoExpires}
        />
      )}

      <DeleteConfirmModal
        deleteConfirm={deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirmDelete={confirmDelete}
      />
    </div>
  );
}
