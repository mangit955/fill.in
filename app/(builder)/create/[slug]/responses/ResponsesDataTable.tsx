"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FormBlock } from "@/lib/forms/types";

export type ResponseRow = {
  id: string;
  created_at: string;
  answers: Record<string, unknown>;
};

type Props = {
  blocks: FormBlock[];
  rows: ResponseRow[];
};

function getAnswerDisplay(
  block: FormBlock,
  answers: Record<string, unknown>,
): string {
  let value = answers?.[block.id];

  if (value === undefined) {
    const prefixedKey = `${block.type}_${block.id}`;
    value = answers?.[prefixedKey];
  }

  let display = "—";
  const options = block.type === "multiple_choice" ? block.config.options : [];

  if (Array.isArray(value)) {
    const labels = value.map((optionId) => {
      const id = String(optionId);
      const byId = options.find((o) => o.id === id);
      if (byId) return byId.label ?? id;

      const byLabel = options.find((o) => o.label === id);
      if (byLabel) return byLabel.label;

      return id;
    });

    display = labels.join(", ");
  } else if (typeof value === "string") {
    const byId = options.find((o) => o.id === value);
    if (byId) {
      display = byId.label ?? value;
    } else {
      const byLabel = options.find((o) => o.label === value);
      display = byLabel ? byLabel.label : value;
    }
  } else if (value !== undefined && value !== null) {
    display = String(value);
  }

  return display;
}

export default function ResponsesDataTable({ blocks, rows }: Props) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "created_at", desc: true },
  ]);

  const columns = React.useMemo<ColumnDef<ResponseRow>[]>(
    () => [
      {
        accessorKey: "created_at",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="px-0 hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Time
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) =>
          new Date(`${row.original.created_at}Z`).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: "Asia/Kolkata",
          }),
      },
      ...blocks.map((block): ColumnDef<ResponseRow> => ({
        id: block.id,
        header: block.config?.label || "Question",
        cell: ({ row }) => getAnswerDisplay(block, row.original.answers),
      })),
    ],
    [blocks],
  );

  const table = useReactTable({
    data: rows,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { sorting },
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800">
        <Table>
          <TableHeader className="bg-muted/40">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
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
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No responses yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {table.getRowModel().rows.length} of {rows.length} responses
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
