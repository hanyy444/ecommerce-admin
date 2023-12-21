'use client'
import { Button } from "@/components/ui/button"
import { UserButton } from "@clerk/nextjs"
import { Modal } from "@/components/ui/modal"
import { useStoreModal } from "@/hooks/use-store-modal"
import { useEffect } from "react"
 
export default function Home() {
  const onOpen = useStoreModal((state) => state.onOpen)
  const isOpen = useStoreModal((state) => state.isOpen)

  useEffect(() => {
    if (!isOpen){
      onOpen()
    }
  }, [isOpen, onOpen])

  return (
    <div className="p-4 flex items-center justify-between">
      <h1 className="p-4">This is a protected route.</h1>
      <Button onClick={() => alert('Shadcn button')} size="default" variant="default">Click me</Button>
      <UserButton afterSignOutUrl="/"/>
    </div>
  )
}