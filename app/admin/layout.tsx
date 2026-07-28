import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
    title: "SenTech Plus - Administration",
    description: "SenTech Plus - Espace d'administration",
};

export default function RootAdminLayout({ children }: { children: React.ReactNode }) {

    return (
        <>
            <AdminLayout>
                {children}
            </AdminLayout>
        </>
    );
}
