import StoreLayout from "@/components/store/StoreLayout";

export const metadata = {
    title: "SenTech Plus - Espace Vendeur",
    description: "SenTech Plus - Tableau de bord Vendeur",
};

export default function RootAdminLayout({ children }: { children: React.ReactNode }) {

    return (
        <>
            <StoreLayout>
                {children}
            </StoreLayout>
        </>
    );
}
