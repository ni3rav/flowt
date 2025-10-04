"use client"

import { useEffect, useState } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "./ui/button"

type Item = {
  id: number
  name: string
  email: string
  role: string
  manager: string
  sentEmail: boolean
}

export default function ManageUsers() {
  const [data, setData] = useState<Item[]>([{ id: 20, "name": "Alice Johnson", "role": "employee", "manager": "Robert Smith", "email": "alice.johnson@example.com", "sentEmail": true },
  { id: 1, "name": "Bob Williams", "role": "employee", "manager": "Robert Smith", "email": "bob.williams@example.com", "sentEmail": false },
  { id: 2, "name": "Charlie Brown", "role": "employee", "manager": "Susan Davis", "email": "charlie.brown@example.com", "sentEmail": true },
  { id: 3, "name": "Diana Miller", "role": "employee", "manager": "Susan Davis", "email": "diana.miller@example.com", "sentEmail": false },
  { id: 4, "name": "Ethan Wilson", "role": "employee", "manager": "Robert Smith", "email": "ethan.wilson@example.com", "sentEmail": true },
  { id: 5, "name": "Fiona Moore", "role": "employee", "manager": "Susan Davis", "email": "fiona.moore@example.com", "sentEmail": false },
  { id: 6, "name": "George Taylor", "role": "employee", "manager": "Robert Smith", "email": "george.taylor@example.com", "sentEmail": true },
  { id: 7, "name": "Hannah Anderson", "role": "employee", "manager": "Susan Davis", "email": "hannah.anderson@example.com", "sentEmail": false },
  { id: 8, "name": "Ian Thomas", "role": "employee", "manager": "Robert Smith", "email": "ian.thomas@example.com", "sentEmail": true },
  { id: 9, "name": "Julia Jackson", "role": "employee", "manager": "Susan Davis", "email": "julia.jackson@example.com", "sentEmail": false },
  { id: 10, "name": "Kevin White", "role": "employee", "manager": "Robert Smith", "email": "kevin.white@example.com", "sentEmail": true },
  { id: 11, "name": "Laura Harris", "role": "employee", "manager": "Susan Davis", "email": "laura.harris@example.com", "sentEmail": false },
  { id: 12, "name": "Michael Martin", "role": "employee", "manager": "Robert Smith", "email": "michael.martin@example.com", "sentEmail": true },
  { id: 13, "name": "Nina Thompson", "role": "employee", "manager": "Susan Davis", "email": "nina.thompson@example.com", "sentEmail": false },
  { id: 14, "name": "Oliver Garcia", "role": "employee", "manager": "Robert Smith", "email": "oliver.garcia@example.com", "sentEmail": true },
  { id: 15, "name": "Paula Martinez", "role": "employee", "manager": "Susan Davis", "email": "paula.martinez@example.com", "sentEmail": false },
  { id: 16, "name": "Quentin Robinson", "role": "employee", "manager": "Robert Smith", "email": "quentin.robinson@example.com", "sentEmail": true },
  { id: 17, "name": "Rachel Clark", "role": "employee", "manager": "Susan Davis", "email": "rachel.clark@example.com", "sentEmail": false },
  { id: 18, "name": "Steven Rodriguez", "role": "employee", "manager": "Robert Smith", "email": "steven.rodriguez@example.com", "sentEmail": true },
  { id: 19, "name": "Tina Lewis", "role": "employee", "manager": "Susan Davis", "email": "tina.lewis@example.com", "sentEmail": false }])
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ])

  const handleUpdate = (id: number, key: keyof Item, value: string) => {
    setData((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, [key]: value } : user
      )
    )
  }

  const table = useReactTable({
    data,
    columns: [
      {
        header: "User",
        accessorKey: "name",
        cell: ({ row }) => (
          <div className="truncate font-medium">{row.getValue("name")}</div>
        ),
      },
      {
        header: "Role",
        accessorKey: "role",
        cell: ({ row }) => {
          const role = row.original.role
          const id = row.original.id
          const roles = ["manager", "employee"]

          return (
            <Select
              value={role}
              onValueChange={(val) => handleUpdate(id, "role", val)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        },
      },
      {
        header: "Manager",
        accessorKey: "manager",
        cell: ({ row }) => {
          const manager = row.original.manager
          const id = row.original.id
          const managers = Array.from(new Set(data.map((u) => u.manager)))

          return (
            <Select
              value={manager}
              onValueChange={(val) => handleUpdate(id, "manager", val)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {managers.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        },
      },
      {
        header: "Email",
        accessorKey: "email",
      },
      {
        header: "Action",
        accessorKey: "sentEmail",
        cell: ({ row }) => {
          const sent = row.original.sentEmail
          return sent ? (
            <div className="truncate text-green-600 font-medium">
              Email Sent
            </div>
          ) : (
            <Button size="sm" variant="outline">
              Send Email
            </Button>
          )
        },
      },
    ],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  })

  return (
    <div className="w-full max-h-[600px] overflow-y-auto rounded-md border">
      <Table className="table-fixed w-full">
        <TableHeader className="sticky top-0 bg-muted z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    "select-none cursor-pointer text-left",
                    header.id === "email" && "w-[250px]"
                  )}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center justify-between">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: <ChevronUpIcon className="h-4 w-4 opacity-60" />,
                      desc: <ChevronDownIcon className="h-4 w-4 opacity-60" />,
                    }[header.column.getIsSorted() as string] ?? null}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="truncate">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}