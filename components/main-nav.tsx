"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { PopoverContent } from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "./ui/command";
import {
  Popover,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MenuIcon } from "lucide-react";

export default function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathName = usePathname();
  const params = useParams();
  const [open, setOpen] = useState(false);

  const [isTablet, setIsTablet] = useState(
    window?.matchMedia("(max-width: 932px)").matches
  );

  useEffect(() => {
    // Function to handle window? resize
    const handleWindowResize = () => {
      setIsTablet(
        window?.matchMedia("(max-width: 932px)").matches
      );
    };

    // Attach the event listener
    window?.addEventListener("resize", handleWindowResize);

    // Cleanup the event listener on component unmount
    return () => {
      window?.removeEventListener(
        "resize",
        handleWindowResize
      );
    };
  }, []);

  const routes = [
    {
      href: `/${params.storeId}`,
      label: "Home",
      active: pathName === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/billboards`,
      label: "Billboards",
      active: pathName === `/${params.storeId}/billboards`,
    },
    {
      href: `/${params.storeId}/categories`,
      label: "Categories",
      active: pathName === `/${params.storeId}/categories`,
    },
    {
      href: `/${params.storeId}/sizes`,
      label: "Sizes",
      active: pathName === `/${params.storeId}/sizes`,
    },
    {
      href: `/${params.storeId}/products`,
      label: "Products",
      active: pathName === `/${params.storeId}/products`,
    },
    {
      href: `/${params.storeId}/orders`,
      label: "Orders",
      active: pathName === `/${params.storeId}/orders`,
    },
    {
      href: `/${params.storeId}/colors`,
      label: "Colors",
      active: pathName === `/${params.storeId}/colors`,
    },
    {
      href: `/${params.storeId}/settings`,
      label: "Settings",
      active: pathName === `/${params.storeId}/settings`,
    },
  ];

  const navLinks = routes.map((route) => (
    <Link
      key={route.href}
      href={route.href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        route.active
          ? "text-black dark:text-white"
          : "text-muted-foreground"
      )}
    >
      {route.label}
    </Link>
  ));

  const HamMenu = () => {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            aria-expanded={open}
          >
            <MenuIcon className="cursor-pointer" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-2 z-50">
          <Command>
            <CommandList>
              <CommandGroup>
                {routes.map((route) => (
                  <CommandItem
                    key={route.label}
                    onSelect={() => setOpen(false)}
                  >
                    <Link
                      key={route.href}
                      href={route.href}
                      className={cn(
                        "text-sm font-medium transition-colors hover:text-primary w-full",
                        route.active
                          ? "text-black dark:text-white"
                          : "text-muted-foreground"
                      )}
                    >
                      {route.label}
                    </Link>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <nav
      className={cn(
        "flex items-center justify-end flex-1 space-x-4 lg:space-x-6",
        className
      )}
    >
      {isTablet ? <HamMenu /> : navLinks}
    </nav>
  );
}
