'use client';
import { useEffect, useState } from "react";

import { StoreModal } from "@/components/modals/store-modal";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false)

    // trick to solve hydration error
    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted){
        // this component is client and used in a server component (layout)
        // this is hydartion error!
        return null;
    }

    return (
        <>
            <StoreModal />
        </>
    )
}

