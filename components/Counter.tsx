'use client'
import { addToCart, removeFromCart } from "@/lib/features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import React from "react";

interface CounterProps {
    productId: string;
}

const Counter: React.FC<CounterProps> = ({ productId }) => {

    const { cartItems } = useSelector((state: any) => state.cart);

    const dispatch = useDispatch();

    const addToCartHandler = () => {
        dispatch(addToCart({ productId }))
    }

    const removeFromCartHandler = () => {
        dispatch(removeFromCart({ productId }))
    }

    return (
        <div className="inline-flex items-center gap-2 sm:gap-3 px-1.5 sm:px-3 py-1.5 sm:py-1 rounded-xl border border-slate-200 text-sm sm:text-base text-slate-600 shadow-xs bg-white">
            <button onClick={removeFromCartHandler} className="size-9 sm:size-7 flex items-center justify-center rounded-lg bg-slate-50 hover:bg-slate-100 transition select-none text-lg leading-none cursor-pointer border border-slate-100">-</button>
            <p className="min-w-5 text-center font-medium">{cartItems[productId] || 0}</p>
            <button onClick={addToCartHandler} className="size-9 sm:size-7 flex items-center justify-center rounded-lg bg-slate-50 hover:bg-slate-100 transition select-none text-lg leading-none cursor-pointer border border-slate-100">+</button>
        </div>
    )
}

export default Counter
