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

export const dummyRatingsData = [
    { id: "rat_1", rating: 4.2, review: "I was a bit skeptical at first, but this product turned out to be even better than I imagined. The quality feels premium, it's easy to use, and it delivers exactly what was promised. I've already recommended it to friends and will definitely purchase again in the future.", user: { name: 'Kristin Watson', image: profile_pic1 }, productId: "prod_1", createdAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)', updatedAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)', product: { name: 'Bluetooth Speakers', category:'Electronics', id:'prod_1'} },
    { id: "rat_2", rating: 5.0, review: "This product is great. I love it!  You made it so simple. My new site is so much faster and easier to work with than my old site.", user: { name: 'Jenny Wilson', image: profile_pic2 }, productId: "prod_2", createdAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)', updatedAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)', product: { name: 'Bluetooth Speakers', category:'Electronics', id:'prod_1'} },
    { id: "rat_3", rating: 4.1, review: "This product is amazing. I love it!  You made it so simple. My new site is so much faster and easier to work with than my old site.", user: { name: 'Bessie Cooper', image: profile_pic3 }, productId: "prod_3", createdAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)', updatedAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)', product: { name: 'Bluetooth Speakers', category:'Electronics', id:'prod_1'} },
    { id: "rat_4", rating: 5.0, review: "This product is great. I love it!  You made it so simple. My new site is so much faster and easier to work with than my old site.", user: { name: 'Kristin Watson', image: profile_pic1 }, productId: "prod_4", createdAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)', updatedAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)', product: { name: 'Bluetooth Speakers', category:'Electronics', id:'prod_1'} },
    { id: "rat_5", rating: 4.3, review: "Overall, I'm very happy with this purchase. It works as described and feels durable. The only reason I didn't give it five stars is because of a small issue (such as setup taking a bit longer than expected, or packaging being slightly damaged). Still, highly recommend it for anyone looking for a reliable option.", user: { name: 'Jenny Wilson', image: profile_pic2 }, productId: "prod_5", createdAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)', updatedAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)', product: { name: 'Bluetooth Speakers', category:'Electronics', id:'prod_1'} },
    { id: "rat_6", rating: 5.0, review: "This product is great. I love it!  You made it so simple. My new site is so much faster and easier to work with than my old site.", user: { name: 'Bessie Cooper', image: profile_pic3 }, productId: "prod_6", createdAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)', updatedAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)', product: { name: 'Bluetooth Speakers', category:'Electronics', id:'prod_1'} },
]

export const dummyStoreData = {
    id: "store_1",
    userId: "user_1",
    name: "Happy Shop",
    description: "At Happy Shop, we believe shopping should be simple, smart, and satisfying. Whether you're hunting for the latest fashion trends, top-notch electronics, home essentials, or unique lifestyle products — we've got it all under one digital roof.",
    username: "happyshop",
    address: "3rd Floor, Happy Shop , New Building, 123 street , c sector , NY, US",
    status: "approved",
    isActive: true,
    logo: happy_store,
    email: "happyshop@example.com",
    contact: "+0 1234567890",
    createdAt: "2025-09-04T09:04:16.189Z",
    updatedAt: "2025-09-04T09:04:44.273Z",
    user: {
        id: "user_31dOriXqC4TATvc0brIhlYbwwc5",
        name: "Great Stack",
        email: "user.greatstack@gmail.com",
        image: gs_logo,
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

export const dummyUserData = {
    id: "user_31dQbH27HVtovbs13X2cmqefddM",
    name: "GreatStack",
    email: "greatstack@example.com",
    image: gs_logo,
    cart: {}
}

export const orderDummyData = [
    {
        id: "cmemm75h5001jtat89016h1p3",
        total: 214.2,
        status: "DELIVERED",
        userId: "user_31dQbH27HVtovbs13X2cmqefddM",
        storeId: "cmemkqnzm000htat8u7n8cpte",
        addressId: "cmemm6g95001ftat8omv9b883",
        isPaid: false,
        paymentMethod: "COD",
        createdAt: "2025-08-22T09:15:03.929Z",
        updatedAt: "2025-08-22T09:15:50.723Z",
        isCouponUsed: true,
        coupon: dummyRatingsData[2],
        orderItems: [
            { orderId: "cmemm75h5001jtat89016h1p3", productId: "cmemlydnx0017tat8h3rg92hz", quantity: 1, price: 89, product: productDummyData[0], },
            { orderId: "cmemm75h5001jtat89016h1p3", productId: "cmemlxgnk0015tat84qm8si5v", quantity: 1, price: 149, product: productDummyData[1], }
        ],
        address: addressDummyData,
        user: dummyUserData
    },
    {
        id: "cmemm6jv7001htat8vmm3gxaf",
        total: 421.6,
        status: "DELIVERED",
        userId: "user_31dQbH27HVtovbs13X2cmqefddM",
        storeId: "cmemkqnzm000htat8u7n8cpte",
        addressId: "cmemm6g95001ftat8omv9b883",
        isPaid: false,
        paymentMethod: "COD",
        createdAt: "2025-08-22T09:14:35.923Z",
        updatedAt: "2025-08-22T09:15:52.535Z",
        isCouponUsed: true,
        coupon: couponDummyData[0],
        orderItems: [
            { orderId: "cmemm6jv7001htat8vmm3gxaf", productId: "cmemm1f3y001dtat8liccisar", quantity: 1, price: 229, product: productDummyData[2], },
            { orderId: "cmemm6jv7001htat8vmm3gxaf", productId: "cmemm0nh2001btat8glfvhry1", quantity: 1, price: 99, product: productDummyData[3], },
            { orderId: "cmemm6jv7001htat8vmm3gxaf", productId: "cmemlz8640019tat8kz7emqca", quantity: 1, price: 199, product: productDummyData[4], }
        ],
        address: addressDummyData,
        user: dummyUserData
    }
]

export const storesDummyData = [
    {
        id: "cmemkb98v0001tat8r1hiyxhn",
        userId: "user_31dOriXqC4TATvc0brIhlYbwwc5",
        name: "GreatStack",
        description: "GreatStack is the education marketplace where you can buy goodies related to coding and tech",
        username: "greatstack",
        address: "123 Maplewood Drive Springfield, IL 62704 USA",
        status: "approved",
        isActive: true,
        logo: gs_logo,
        email: "greatstack@example.com",
        contact: "+0 1234567890",
        createdAt: "2025-08-22T08:22:16.189Z",
        updatedAt: "2025-08-22T08:22:44.273Z",
        user: dummyUserData,
    },
    {
        id: "cmemkqnzm000htat8u7n8cpte",
        userId: "user_31dQbH27HVtovbs13X2cmqefddM",
        name: "Happy Shop",
        description: "At Happy Shop, we believe shopping should be simple, smart, and satisfying. Whether you're hunting for the latest fashion trends, top-notch electronics, home essentials, or unique lifestyle products — we've got it all under one digital roof.",
        username: "happyshop",
        address: "3rd Floor, Happy Shop , New Building, 123 street , c sector , NY, US",
        status: "approved",
        isActive: true,
        logo: happy_store,
        email: "happyshop@example.com",
        contact: "+0 123456789",
        createdAt: "2025-08-22T08:34:15.155Z",
        updatedAt: "2025-08-22T08:34:47.162Z",
        user: dummyUserData,
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