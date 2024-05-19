"use client";

import * as React from "react";
import { ArrowUpDown, MoreHorizontal, Grip } from "lucide-react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  Row,
  RowData,
} from "@tanstack/react-table";
import { AccountContext } from "@/components/context/account";
import { Profile } from "@/type/profile";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

const columns: ColumnDef<Profile>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "archived",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0"
        >
          Archived
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row, table }) => (
      <div className="flex items-center px-8">
        <Checkbox
          checked={row.getValue("archived")}
          aria-label="Archived"
          onCheckedChange={(checked) => {
            table.options.meta?.updateData(row.index, "archived", checked);
          }}
        />
      </div>
    ),
  },
  // {
  //   id: "actions",
  //   enableHiding: false,
  //   cell: ({ row }) => {
  //     const profile = row.original;

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuItem>
  //             {profile.status.isArchived ? "Unarchive" : "Archive"}
  //           </DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];

const DraggableRow: React.FC<{
  row: Row<Profile>;
  reorderRow: (draggedRowIndex: number, targetRowIndex: number) => void;
}> = ({ row, reorderRow }) => {
  const [, dropRef] = useDrop({
    accept: "row",
    drop: (draggedRow: Row<Profile>) => reorderRow(draggedRow.index, row.index),
  });

  const [{ isDragging }, dragRef, previewRef] = useDrag({
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => row,
    type: "row",
  });

  return (
    <TableRow
      ref={previewRef as any}
      className={isDragging ? "opacity-50" : "opacity-100"}
    >
      <TableCell ref={dropRef as any} className="w-20">
        <Button
          variant="ghost"
          ref={dragRef as any}
          size="icon"
          className="cursor-move"
        >
          <Grip />
        </Button>
      </TableCell>
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default function Home() {
  const account = React.useContext(AccountContext);
  const [data, setData] = React.useState<Profile[]>([]);

  React.useEffect(() => {
    let profiles = account?.account.profiles || [];
    profiles = profiles.map((profile) => ({
      ...profile,
      archived: profile.status.isArchived, //* expose field
    }));
    setData(profiles);
  }, [account]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    meta: {
      updateData: (rowIndex, columnId, value) => {
        const newData = data.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...data[rowIndex]!,
              [columnId]: value,
            };
          }
          return row;
        });
        console.log(newData);
        const converted = newData.map((profile: any) => ({
          ...profile,
          status: {
            isArchived: profile.archived,
          },
        }));
        //delete key
        converted.forEach((profile) => {
          delete profile.archived;
        });
        console.log(converted);
        account?.setAccount((prev) => ({
          ...prev,
          profiles: converted,
        }));
        setData(newData);
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const reorderRow = (draggedRowIndex: number, targetRowIndex: number) => {
    data.splice(
      targetRowIndex,
      0,
      data.splice(draggedRowIndex, 1)[0] as Profile
    );
    account?.setAccount((prev) => ({
      ...prev,
      profiles: data,
    }));
    setData([...data]);
    account?.setAccount((prev) => ({
      ...prev,
      profiles: data,
    }));
  };

  const isMobile = React.useMemo(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }, []);

  const Backend = isMobile ? TouchBackend : HTML5Backend;
  return (
    <DndProvider backend={Backend}>
      <div className="h-full min-w-screen overflow-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                <TableHead></TableHead>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table
                .getRowModel()
                .rows.map((row) => (
                  <DraggableRow
                    key={row.id}
                    row={row}
                    reorderRow={reorderRow}
                  />
                ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </DndProvider>
  );
}
