"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { ThemeToggle } from "../theme-toggle"

import { cn } from "@/lib/utils"

const examples = [
  {
    name: "Mail",
    href: "/examples/mail",
    code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/mail",
  },
  {
    name: "Dashboard",
    href: "/examples/dashboard",
    code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/dashboard",
  },
  {
    name: "Cards",
    href: "/examples/cards",
    code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/cards",
  },
  {
    name: "Tasks",
    href: "/examples/tasks",
    code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/tasks",
  },
  {
    name: "Playground",
    href: "/examples/playground",
    code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/playground",
  },
  {
    name: "Forms",
    href: "/examples/forms",
    code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/forms",
  },
  {
    name: "Music",
    href: "/examples/music",
    code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/music",
  },
  {
    name: "Authentication",
    href: "/examples/authentication",
    code: "https://github.com/shadcn/ui/tree/main/apps/www/app/(app)/examples/authentication",
  },
]

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Header({ className, ...props }: HeaderProps) {
  const pathname = usePathname()

  return (
    <div className="relative">
        <div className={cn("mb-4 flex items-center justify-between", className)} {...props}>
          <div className={cn("flex items-center")}>
          {examples.map((example, index) => (
            <Link
              href={example.href}
              key={example.href}
              className={cn(
                "hover:text-primary flex h-7 items-center justify-center rounded-full px-4 text-center text-sm transition-colors",
                pathname?.startsWith(example.href) ||
                  (index === 0 && pathname === "/")
                  ? "bg-muted text-primary font-medium"
                  : "text-muted-foreground"
              )}
            >
              {example.name}
            </Link>
          ))}
          </div>
          <ThemeToggle />
        </div>
    </div>
  )
}

interface ExampleCodeLinkProps {
  pathname: string | null
}

export function ExampleCodeLink({ pathname }: ExampleCodeLinkProps) {
  const example = examples.find((example) => pathname?.startsWith(example.href))

  if (!example?.code) {
    return null
  }

  return (
    <Link
      href={example?.code}
      target="_blank"
      rel="nofollow"
      className="absolute right-0 top-0 hidden items-center rounded-lg text-sm font-medium md:flex"
    >
      View code
      {/* <ArrowRightIcon className="ml-1 h-4 w-4" /> */}
    </Link>
  )
}