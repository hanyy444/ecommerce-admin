"use client";

import { ColumnDef } from "@tanstack/react-table";

import CellAction from "./cell-action";

export type OrderColumn = {
  id: string;
  address: string;
  phone: string;
  isPaid: boolean;
  totalPrice: string;
  products: string;
  createdAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
    cell: ({ row }) => (
      <div className="p-4">
        {row.original.isPaid ? "Yes" : "No"}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
];
