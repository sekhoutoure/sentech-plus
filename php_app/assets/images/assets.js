import gs_logo from "./gs_logo.jpg"
import happy_store from "./happy_store.webp"
import upload_area from "./upload_area.svg"
import hero_model_img from "./hero_model_img.png"
import hero_product_img1 from "./hero_product_img1.png"
import hero_product_img2 from "./hero_product_img2.png"
import sentech_logo from "./sentech_logo.png"
import product_img1 from "./product_img1.png"
import product_img2 from "./product_img2.png"
import product_img3 from "./product_img3.png"
import product_img4 from "./product_img4.png"
import product_img5 from "./product_img5.png"
import product_img6 from "./product_img6.png"
import product_img7 from "./product_img7.png"
import product_img8 from "./product_img8.png"
import product_img9 from "./product_img9.png"
import product_img10 from "./product_img10.png"
import product_img11 from "./product_img11.png"
import product_img12 from "./product_img12.png"
import product_img13 from "./product_img13.png"
import product_img14 from "./product_img14.png"
import product_img15 from "./product_img15.png"
import product_img16 from "./product_img16.png"
import { ClockFadingIcon, HeadsetIcon, SendIcon } from "lucide-react";
import profile_pic1 from "./profile_pic1.jpg"
import profile_pic2 from "./profile_pic2.jpg"
import profile_pic3 from "./profile_pic3.jpg"

export const assets = {
    upload_area, hero_model_img,
    hero_product_img1, hero_product_img2, gs_logo, sentech_logo,
    product_img1, product_img2, product_img3, product_img4, product_img5, product_img6,
    product_img7, product_img8, product_img9, product_img10, product_img11, product_img12,
    product_img13, product_img14, product_img15, product_img16,
}

export const categories = ["Casques", "Enceintes", "Montres", "Écouteurs", "Souris", "Décoration"];

export const ourSpecsData = [
    { title: "Livraison gratuite", description: "Profitez d'une livraison rapide et gratuite sur toutes vos commandes directement à votre porte.", icon: SendIcon, accent: '#05DF72' },
    { title: "Retours faciles sous 7 jours", description: "Vous avez changé d'avis ? Pas de soucis, retournez tout article sous 7 jours.", icon: ClockFadingIcon, accent: '#FF8904' },
    { title: "Service client 24/7", description: "Nous sommes là pour vous. Bénéficiez d'une assistance réactive à tout moment.", icon: HeadsetIcon, accent: '#A684FF' }
]

export const clientRatingsData = [
    { id: "rat_1", rating: 5.0, review: "Qualité audio exceptionnelle et réduction de bruit très efficace. Livraison reçue à Dakar en moins de 2h comme promis !", user: { name: 'Moussa Ndiaye', image: profile_pic1 }, productId: "prod_1", createdAt: '2026-02-15T14:50:00.000Z', product: { name: 'Écouteurs Pro ANC', category:'Audio', id:'prod_1'} },
    { id: "rat_2", rating: 5.0, review: "Super produit, batterie qui tient toute la journée. Très satisfait du service client sur WhatsApp.", user: { name: 'Aminata Diallo', image: profile_pic2 }, productId: "prod_2", createdAt: '2026-02-16T10:15:00.000Z', product: { name: 'Montre Connectée Sport', category:'Montres', id:'prod_2'} },
    { id: "rat_3", rating: 4.8, review: "Chargeur GaN 65W ultra rapide pour mon MacBook et iPhone. Compact et chauffe très peu.", user: { name: 'Ibrahima Sarr', image: profile_pic3 }, productId: "prod_3", createdAt: '2026-02-18T16:20:00.000Z', product: { name: 'Chargeur GaN 65W', category:'Accessoires', id:'prod_3'} },
    { id: "rat_4", rating: 5.0, review: "Enceinte Bluetooth avec un son puissant et des basses profondes. Parfait pour la maison et les sorties.", user: { name: 'Fatou Sow', image: profile_pic1 }, productId: "prod_4", createdAt: '2026-02-20T11:00:00.000Z', product: { name: 'Enceinte HD 360', category:'Audio', id:'prod_4'} }
]

export const officialStoreData = {
    id: "store_sentech_main",
    userId: "user_admin",
    name: "SenTechPLUS Boutique Officielle",
    description: "Boutique certifiée officielle spécialisée dans les équipements et accessoires high-tech originaux à Dakar, Sénégal.",
    username: "sentech-officiel",
    address: "Avenue Léopold Sédar Senghor, Plateau, Dakar, Sénégal",
    status: "approved",
    isActive: true,
    logo: sentech_logo,
    email: "contact@sentechplus.com",
    contact: "+221 78 131 64 97",
    createdAt: "2026-01-01T00:00:00.000Z",
    user: {
        id: "user_admin",
        name: "SenTechPLUS",
        email: "contact@sentechplus.com",
        image: sentech_icon,
    }
}

export const productDummyData = [
    {
        id: "prod_1",
        name: "Écouteurs Pro ANC Premium",
        description: "Écouteurs sans fil à réduction active de bruit, autonomie 50 heures, mode transparence et basses immersives.",
        mrp: 45000,
        price: 29000,
        images: [product_img1, product_img2, product_img3, product_img4],
        category: "Écouteurs",
        storeId: "seller_1",
        inStock: true,
        stock: 15,
        salesCount: 142,
        store: dummyStoreData,
        rating: dummyRatingsData,
        createdAt: '2026-02-01T10:00:00.000Z',
        updatedAt: '2026-02-01T10:00:00.000Z',
    },
    {
        id: "prod_2",
        name: "Enceinte Bluetooth Smart Gray",
        description: "Enceinte nomade haute fidélité avec assistant vocal intégré et résistance à l'eau IPX7.",
        mrp: 50000,
        price: 35000,
        images: [product_img2],
        storeId: "seller_1",
        inStock: true,
        stock: 22,
        salesCount: 118,
        store: dummyStoreData,
        category: "Enceintes",
        rating: dummyRatingsData,
        createdAt: '2026-01-28T14:30:00.000Z',
        updatedAt: '2026-01-28T14:30:00.000Z',
    },
    {
        id: "prod_3",
        name: "Montre Connectée Sport White Edition",
        description: "Écran AMOLED HD, capteur de fréquence cardiaque, suivi sommeil et 7 jours d'autonomie.",
        mrp: 65000,
        price: 49000,
        images: [product_img3],
        storeId: "seller_1",
        inStock: true,
        stock: 8,
        salesCount: 95,
        store: dummyStoreData,
        category: "Montres",
        rating: dummyRatingsData,
        createdAt: '2026-01-25T09:15:00.000Z',
        updatedAt: '2026-01-25T09:15:00.000Z',
    },
    {
        id: "prod_4",
        name: "Casque Bluetooth Over-Ear Studio",
        description: "Casque circum-aural réducteur de bruit ambiant, coussinets mémoire de forme et réponse en fréquence ultra-large.",
        mrp: 120000,
        price: 89000,
        images: [product_img4],
        storeId: "seller_1",
        inStock: true,
        stock: 12,
        salesCount: 84,
        store: dummyStoreData,
        category: "Casques",
        rating: dummyRatingsData,
        createdAt: '2026-01-20T16:45:00.000Z',
        updatedAt: '2026-01-20T16:45:00.000Z',
    },
    {
        id: "prod_5",
        name: "Montre Connectée Black Ultra",
        description: "Châssis renforcé en titane, GPS bi-fréquence, étanchéité 50m et appels Bluetooth.",
        mrp: 75000,
        price: 55000,
        images: [product_img5],
        storeId: "seller_1",
        inStock: true,
        stock: 19,
        salesCount: 76,
        store: dummyStoreData,
        category: "Montres",
        rating: [...dummyRatingsData,...dummyRatingsData],
        createdAt: '2026-01-18T11:20:00.000Z',
        updatedAt: '2026-01-18T11:20:00.000Z',
    },
    {
        id: "prod_6",
        name: "Caméra de Sécurité 4K Vision Nocturne",
        description: "Caméra intelligente avec détection humaine IA, audio bidirectionnel et stockage cloud sécurisé.",
        mrp: 60000,
        price: 42000,
        images: [product_img6],
        storeId: "seller_1",
        inStock: true,
        stock: 14,
        salesCount: 65,
        store: dummyStoreData,
        category: "Maison",
        rating: [...dummyRatingsData,...dummyRatingsData],
        createdAt: '2026-01-15T08:00:00.000Z',
        updatedAt: '2026-01-15T08:00:00.000Z',
    },
    {
        id: "prod_7",
        name: "Stylet Intelligent Pro pour iPad & Tablette",
        description: "Recharge magnétique sans fil, sensibilité à la pression et rejet de la paume de la main.",
        mrp: 99000,
        price: 79000,
        images: [product_img7],
        storeId: "seller_1",
        inStock: true,
        stock: 25,
        salesCount: 52,
        store: dummyStoreData,
        category: "Accessoires",
        rating: [...dummyRatingsData,...dummyRatingsData],
        createdAt: '2026-01-10T15:10:00.000Z',
        updatedAt: '2026-01-10T15:10:00.000Z',
    },
    {
        id: "prod_8",
        name: "Système Home Cinema Dolby Atmos",
        description: "Barre de son surround 5.1 avec caisson de basses sans fil 300W pour une expérience de cinéma à domicile.",
        mrp: 220000,
        price: 180000,
        images: [product_img8],
        storeId: "seller_1",
        inStock: true,
        stock: 5,
        salesCount: 43,
        store: dummyStoreData,
        category: "Enceintes",
        rating: [...dummyRatingsData,...dummyRatingsData],
        createdAt: '2026-01-08T12:00:00.000Z',
        updatedAt: '2026-01-08T12:00:00.000Z',
    },
    {
        id: "prod_9",
        name: "Écouteurs True Wireless Air",
        description: "Écouteurs ultra-légers avec étui de charge USB-C rapide et qualité d'appel HD.",
        mrp: 140000,
        price: 110000,
        images: [product_img9],
        storeId: "seller_1",
        inStock: true,
        stock: 30,
        salesCount: 38,
        store: dummyStoreData,
        category: "Écouteurs",
        rating: [...dummyRatingsData,...dummyRatingsData],
        createdAt: '2026-01-05T17:30:00.000Z',
        updatedAt: '2026-01-05T17:30:00.000Z',
    },
    {
        id: "prod_10",
        name: "Montre Connectée Executive Gold",
        description: "Cadran en verre de saphir, bracelet cuir véritable et fonctionnalités d'ECG avancées.",
        mrp: 290000,
        price: 240000,
        images: [product_img10],
        storeId: "seller_1",
        inStock: true,
        stock: 6,
        salesCount: 29,
        store: dummyStoreData,
        category: "Montres",
        rating: [...dummyRatingsData,...dummyRatingsData],
        createdAt: '2026-01-03T10:00:00.000Z',
        updatedAt: '2026-01-03T10:00:00.000Z',
    },
    {
        id: "prod_11",
        name: "Souris Gaming RGB Sans Fil Pro",
        description: "Capteur optique 26 000 DPI, commutateurs optiques ultra-rapides et autonomie 90h.",
        mrp: 55000,
        price: 39000,
        images: [product_img11],
        storeId: "seller_1",
        inStock: true,
        stock: 18,
        salesCount: 24,
        store: dummyStoreData,
        category: "Gaming",
        rating: [...dummyRatingsData,...dummyRatingsData],
        createdAt: '2026-01-02T13:45:00.000Z',
        updatedAt: '2026-01-02T13:45:00.000Z',
    },
    {
        id: "prod_12",
        name: "Robot Aspirateur Intelligent LiDAR",
        description: "Cartographie laser 3D, aspiration 4000Pa et station de vidage automatique.",
        mrp: 250000,
        price: 199000,
        images: [product_img12],
        storeId: "seller_1",
        inStock: true,
        stock: 7,
        salesCount: 19,
        store: dummyStoreData,
        category: "Maison",
        rating: [...dummyRatingsData,...dummyRatingsData],
        createdAt: '2026-01-01T09:00:00.000Z',
        updatedAt: '2026-01-01T09:00:00.000Z',
    },
    {
        id: "prod_13",
        name: "Clavier Mécanique Gaming RGB Compact",
        description: "Switches optiques linéaires, rétroéclairage per-key 16M couleurs et châssis aluminium.",
        mrp: 85000,
        price: 65000,
        images: [product_img13],
        storeId: "seller_1",
        inStock: true,
        stock: 20,
        salesCount: 88,
        store: dummyStoreData,
        category: "Gaming",
        rating: [...dummyRatingsData],
        createdAt: '2026-02-10T08:00:00.000Z',
        updatedAt: '2026-02-10T08:00:00.000Z',
    },
    {
        id: "prod_14",
        name: "Tablette Graphique Pro Ultra-Slim",
        description: "Surface active 22cm, 8192 niveaux de pression et compatibilité universelle Windows/Mac.",
        mrp: 110000,
        price: 89000,
        images: [product_img14],
        storeId: "seller_1",
        inStock: true,
        stock: 11,
        salesCount: 61,
        store: dummyStoreData,
        category: "Accessoires",
        rating: [...dummyRatingsData],
        createdAt: '2026-02-14T10:30:00.000Z',
        updatedAt: '2026-02-14T10:30:00.000Z',
    },
    {
        id: "prod_15",
        name: "Drone DJI Mini Compact 4K",
        description: "Stabilisation 3 axes, autonomie 38 min, détection d'obstacles et retour auto.",
        mrp: 320000,
        price: 269000,
        images: [product_img15],
        storeId: "seller_1",
        inStock: true,
        stock: 4,
        salesCount: 47,
        store: dummyStoreData,
        category: "Accessoires",
        rating: [...dummyRatingsData],
        createdAt: '2026-02-18T14:00:00.000Z',
        updatedAt: '2026-02-18T14:00:00.000Z',
    },
    {
        id: "prod_16",
        name: "Lampe LED Smart Ring Light 26cm",
        description: "3 températures de couleur, intensité réglable et pied télescopique inclus.",
        mrp: 35000,
        price: 24000,
        images: [product_img16],
        storeId: "seller_1",
        inStock: true,
        stock: 35,
        salesCount: 112,
        store: dummyStoreData,
        category: "Maison",
        rating: [...dummyRatingsData],
        createdAt: '2026-02-22T09:00:00.000Z',
        updatedAt: '2026-02-22T09:00:00.000Z',
    }
];

export const addressDummyData = {
    id: "addr_1",
    userId: "user_1",
    name: "John Doe",
    email: "johndoe@example.com",
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "USA",
    phone: "1234567890",
    createdAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)',
}

export const couponDummyData = [
    { code: "NEW20", description: "20% Off for New Users", discount: 20, forNewUser: true, forMember: false, isPublic: false, expiresAt: "2026-12-31T00:00:00.000Z", createdAt: "2025-08-22T08:35:31.183Z" },
    { code: "NEW10", description: "10% Off for New Users", discount: 10, forNewUser: true, forMember: false, isPublic: false, expiresAt: "2026-12-31T00:00:00.000Z", createdAt: "2025-08-22T08:35:50.653Z" },
    { code: "OFF20", description: "20% Off for All Users", discount: 20, forNewUser: false, forMember: false, isPublic: false, expiresAt: "2026-12-31T00:00:00.000Z", createdAt: "2025-08-22T08:42:00.811Z" },
    { code: "OFF10", description: "10% Off for All Users", discount: 10, forNewUser: false, forMember: false, isPublic: false, expiresAt: "2026-12-31T00:00:00.000Z", createdAt: "2025-08-22T08:42:21.279Z" },
    { code: "PLUS10", description: "20% Off for Members", discount: 10, forNewUser: false, forMember: true, isPublic: false, expiresAt: "2027-03-06T00:00:00.000Z", createdAt: "2025-08-22T11:38:20.194Z" }
]

export const defaultUserData = {
    id: "user_sentech_admin",
    name: "SenTechPLUS",
    email: "contact@sentechplus.com",
    image: sentech_icon,
    cart: {}
}

export const orderHistoryData = [
    {
        id: "cm_dakar_8941",
        total: 45000,
        status: "DELIVERED",
        userId: "user_sentech_client",
        storeId: "store_sentech_main",
        addressId: "addr_dakar_1",
        isPaid: true,
        paymentMethod: "WAVE",
        createdAt: "2026-02-20T09:15:00.000Z",
        updatedAt: "2026-02-20T11:30:00.000Z",
        isCouponUsed: false,
        address: addressDummyData,
        user: defaultUserData
    }
]

export const storesDirectoryData = [
    {
        id: "store_sentech_main",
        userId: "user_sentech_admin",
        name: "SenTechPLUS Official",
        description: "Boutique certifiée officielle d'équipements et accessoires high-tech originaux à Dakar.",
        username: "sentech-officiel",
        address: "Avenue Ponty, Plateau, Dakar, Sénégal",
        status: "approved",
        isActive: true,
        logo: sentech_logo,
        email: "contact@sentechplus.com",
        contact: "+221 78 131 64 97",
        createdAt: "2026-01-01T08:00:00.000Z",
        user: defaultUserData,
    }
]

export const dummyAdminDashboardData = {
    "orders": 6,
    "stores": 2,
    "products": 12,
    "revenue": "959.10",
    "allOrders": [
        { "createdAt": "2025-08-20T08:46:58.239Z", "total": 145.6 },
        { "createdAt": "2025-08-22T08:46:21.818Z", "total": 97.2 },
        { "createdAt": "2025-08-22T08:45:59.587Z", "total": 54.4 },
        { "createdAt": "2025-08-23T09:15:03.929Z", "total": 214.2 },
        { "createdAt": "2025-08-23T09:14:35.923Z", "total": 421.6 },
        { "createdAt": "2025-08-23T11:44:29.713Z", "total": 26.1 },
        { "createdAt": "2025-08-24T09:15:03.929Z", "total": 214.2 },
        { "createdAt": "2025-08-24T09:14:35.923Z", "total": 421.6 },
        { "createdAt": "2025-08-24T11:44:29.713Z", "total": 26.1 },
        { "createdAt": "2025-08-24T11:56:29.713Z", "total": 36.1 },
        { "createdAt": "2025-08-25T11:44:29.713Z", "total": 26.1 },
        { "createdAt": "2025-08-25T09:15:03.929Z", "total": 214.2 },
        { "createdAt": "2025-08-25T09:14:35.923Z", "total": 421.6 },
        { "createdAt": "2025-08-25T11:44:29.713Z", "total": 26.1 },
        { "createdAt": "2025-08-25T11:56:29.713Z", "total": 36.1 },
        { "createdAt": "2025-08-25T11:30:29.713Z", "total": 110.1 }
    ]
}

export const dummyStoreDashboardData = {
    "ratings": dummyRatingsData,
    "totalOrders": 2,
    "totalEarnings": 636,
    "totalProducts": 5
}