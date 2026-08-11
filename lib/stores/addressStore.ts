import { create } from 'zustand'
import { addressDummyData } from '@/assets/assets'

export interface Address {
    id: string
    name?: string
    phone?: string
    street?: string
    city?: string
    country?: string
    [key: string]: any
}

interface AddressStore {
    list: Address[]
    addAddress: (address: Partial<Address>) => void
    updateAddress: (address: Partial<Address> & { id: string }) => void
    deleteAddress: (id: string) => void
}

export const useAddressStore = create<AddressStore>((set) => ({
    list: [addressDummyData] as Address[],
    addAddress: (address) => set((state) => ({
        list: [...state.list, { id: `addr_${Date.now()}`, ...address } as Address]
    })),
    updateAddress: (address) => set((state) => ({
        list: state.list.map(a => a.id === address.id ? { ...a, ...address } : a)
    })),
    deleteAddress: (id) => set((state) => ({
        list: state.list.filter(a => a.id !== id)
    })),
}))
