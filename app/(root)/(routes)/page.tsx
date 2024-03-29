"use client";
import { UserButton } from "@clerk/nextjs";
import { useStoreModal } from "@/hooks/use-store-modal";
import { useEffect } from "react";

export default function Home() {
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return (
    <div className="p-4 flex items-center justify-end">
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
