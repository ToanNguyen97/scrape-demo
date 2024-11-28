"use client"

import { ColumnDef } from "@tanstack/react-table"
import { LoadingSpinner } from "../Loading"
import Link from "next/link"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "../ui/button"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Task = {
  id: string
  emaill: string
  password: string
  url: string
  error: string
  status: string
}

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "password",
    header: "Password",
  },
  {
    accessorKey: "url",
    header: "Job",
    cell: ({ row }) => {
      const url: string = row.getValue("url")
      const modifiedUrl = url.endsWith('/') ? url.slice(0, -1) : url
      return (
        <div className="w-[300px]">
          <Link href={url} target="_blank"><span className="font-bold text-cyan-400">{modifiedUrl.split('/').pop()}</span></Link>
        </div>
      )
    }
  },
  {
    accessorKey: "resume_url",
    header: "Resume",
    cell: ({ row }) => {
      const url: string = row.getValue("resume_url")
      if (!url) {
        return "-"
      }
      return (
        <div className="w-[250px]">
          <Link href={url} target="_blank"><span className="font-bold text-cyan-400">{url.split('/').pop()}</span></Link>
        </div>
      )
    }
  },
  {
    accessorKey: "status",
    header: "Log",
    cell: ({ row }) => {
      const status: string = row.getValue("status")
      if (status === 'Pending') {
        return (
          <div className="text-yellow-500">{status}</div>
        )
      }
      if (status === 'Completed') {
        return (
          <div className="text-green-500">{status}</div>
        )
      }
      if (status === 'Failed') {
        return (
          <div className="text-red-500">{status}</div>
        )
      }
      return (
        <div className="w-[150px]">{status}</div>
      )
    }
  },
  {
    accessorKey: "error",
    header: "Error Message",
    cell: ({ row }) => {
      const error: string = row.getValue("error")
      if (!error) {
        return "-"
      }
      return (
        <div className="text-red-500 max-w-[150px] line-clamp-2">
          <Popover>
            <PopoverTrigger>
              <Button variant="outline" size="sm">Click View Detail</Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] h-[300px] overflow-hidden overflow-y-auto">{error}</PopoverContent>
          </Popover>
        </div>
      )
    }
  },
  {
    accessorKey: "",
    header: "Status",
    cell: ({ row }) => {
      const status: string = row.getValue("status")
      if (status === 'Pending') {
        return <div className="flex justify-center">-</div>
      }
        const isCompleted = ['Failed', 'Completed'].includes(status)
      return (
        <div className="flex justify-center">{isCompleted ? 'Done' : <LoadingSpinner className="w-5 h-5 text-cyan-500"/>}</div>
      )
    },
  },
]
