"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

const products = [
  {
    name: "Scissors",
    id: "#1005",
    description: "Hand Operated Tool",
    type: "Surgical",
    price: "$70",
  },
  {
    name: "Forceps",
    id: "#1006",
    description: "For Grasping Tissue",
    type: "Surgical",
    price: "$300",
  },
  {
    name: "Socks",
    id: "#359",
    description: "Short White Socks",
    type: "Hosiery",
    price: "$25",
  },
  {
    name: "Wound Retractors",
    id: "#1007",
    description: "For Retracting and Protecting",
    type: "Surgical",
    price: "$600",
  },
]

export function ProductSalesTable() {
  return (
    <Card className="border-none shadow-sm rounded-2xl mx-6 mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">Product Sales</CardTitle>
        <Button className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 rounded-xl px-4 py-2 text-xs font-semibold">
          Add Product
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="text-xs font-medium text-muted-foreground uppercase">Product Name</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground uppercase">Product ID</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground uppercase">Product Description</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground uppercase">Product Type</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground uppercase">Price</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground uppercase text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="hover:bg-muted/50 border-none">
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.id}</TableCell>
                <TableCell className="text-muted-foreground">{product.description}</TableCell>
                <TableCell>{product.type}</TableCell>
                <TableCell className="font-semibold">{product.price}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-3 text-xs">
                    <button className="text-foreground hover:underline font-medium">Edit</button>
                    <button className="text-red-500 hover:underline font-medium">Delete</button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
