const fs = require('fs');
const path = require('path');

const filesToConvert = [
    'app/layout.jsx',
    'app/error.jsx',
    'app/not-found.jsx',
    'app/(public)/layout.jsx',
    'app/(public)/page.jsx',
    'app/(public)/error.jsx',
    'app/(public)/shop/page.jsx',
    'app/(public)/shop/[username]/page.jsx',
    'app/(public)/shop/[username]/StoreShopClient.jsx',
    'app/(public)/product/[productId]/page.jsx',
    'app/(public)/product/[productId]/ProductPageClient.jsx',
    'app/(public)/cart/page.jsx',
    'app/(public)/orders/page.jsx',
    'app/(public)/wishlist/page.jsx',
    'app/(public)/about/page.jsx',
    'app/(public)/contact/page.jsx',
    'app/(public)/pricing/page.jsx',
    'app/(public)/create-store/page.jsx',
    'app/(public)/loading/page.jsx',
    'app/admin/layout.jsx',
    'app/admin/page.jsx',
    'app/admin/approve/page.jsx',
    'app/admin/coupons/page.jsx',
    'app/admin/orders/page.jsx',
    'app/admin/products/page.jsx',
    'app/admin/settings/page.jsx',
    'app/admin/stores/page.jsx',
    'app/store/layout.jsx',
    'app/store/page.jsx',
    'app/store/add-product/page.jsx',
    'app/store/manage-product/page.jsx',
    'app/store/orders/page.jsx'
];

const cwd = 'C:\\Users\\hp\\.gemini\\antigravity\\scratch\\gocart';

filesToConvert.forEach(file => {
    const jsxPath = path.join(cwd, file);
    const tsxPath = jsxPath.replace(/\.jsx$/, '.tsx');

    if (!fs.existsSync(jsxPath)) {
        console.log(`File not found: ${jsxPath}`);
        return;
    }

    let content = fs.readFileSync(jsxPath, 'utf8');

    // Add layout types
    if (file.endsWith('layout.jsx')) {
        content = content.replace(/function\s+(\w+Layout)\s*\(\s*\{\s*children\s*\}\s*\)/g, 'function $1({ children }: { children: React.ReactNode })');
        content = content.replace(/const\s+(\w+Layout)\s*=\s*\(\s*\{\s*children\s*\}\s*\)/g, 'const $1 = ({ children }: { children: React.ReactNode })');
        content = content.replace(/export\s+default\s+function\s+(\w+Layout)?\s*\(\s*\{\s*children\s*\}\s*\)/g, 'export default function $1({ children }: { children: React.ReactNode })');
        content = content.replace(/export\s+default\s+function\s*\(\s*\{\s*children\s*\}\s*\)/g, 'export default function({ children }: { children: React.ReactNode })');
    }

    // Add error types
    if (file.endsWith('error.jsx')) {
        content = content.replace(/function\s+(\w+)\s*\(\s*\{\s*error\s*,\s*reset\s*\}\s*\)/g, 'function $1({ error, reset }: { error: Error & { digest?: string }, reset: () => void })');
        content = content.replace(/export\s+default\s+function\s+(\w+)\s*\(\s*\{\s*error\s*,\s*reset\s*\}\s*\)/g, 'export default function $1({ error, reset }: { error: Error & { digest?: string }, reset: () => void })');
    }

    // Add page dynamic routes types
    if (file.includes('[productId]') || file.includes('[username]')) {
        const paramType = file.includes('[productId]') ? 'productId: string' : 'username: string';
        content = content.replace(/function\s+(\w+)\s*\(\s*\{\s*params\s*\}\s*\)/g, `function $1({ params }: { params: Promise<{ ${paramType} }> })`);
        content = content.replace(/export\s+default\s+function\s+(\w+)\s*\(\s*\{\s*params\s*\}\s*\)/g, `export default function $1({ params }: { params: Promise<{ ${paramType} }> })`);
        content = content.replace(/const\s+(\w+)\s*=\s*\(\s*\{\s*params\s*\}\s*\)/g, `const $1 = ({ params }: { params: Promise<{ ${paramType} }> })`);
    }

    // Replace the file
    fs.writeFileSync(tsxPath, content, 'utf8');
    fs.unlinkSync(jsxPath);
    console.log(`Converted ${file} to .tsx`);
});
