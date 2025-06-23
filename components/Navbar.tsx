"use client";

import Link from "next/link";
import ThemeToggle from "./theme/ThemeButton";
import { useState } from "react";
import { Sheet, SheetTrigger, SheetContent, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LucideGithub, Menu, X } from "lucide-react";

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="container mx-auto bg-gray-100 dark:bg-gray-800/70 backdrop-blur-md rounded-md shadow-md px-4 sm:px-12 py-4 flex justify-between items-center mb-12 top-12 sticky z-[99999]">
      {/* Logo */}
      <h1 className="text-2xl font-bold">OpenEditor</h1>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-8 items-center justify-center">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/editor">Editor</NavLink>
        {/* <NavLink href="/about">About</NavLink> */}
        <NavLink href="https://github.com/jonalphabert/live-editor-next-tiptap">
        <Button
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-300"
          aria-label={'Go to github repo'}
        >
          <LucideGithub /> See Project on Github
          </Button>
        </NavLink>
        <ThemeToggle />
      </div>
      
      {/* Mobile Navigation */}
      <div className="flex md:hidden items-center gap-4">
        <ThemeToggle />
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Open menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </SheetTrigger>
          
          <SheetContent side="right" className="w-[300px] sm:w-[350px] bg-white dark:bg-gray-800">
            <div className="flex flex-col h-full pt-10">
              <div className="flex flex-col gap-6">
                <SheetClose asChild>
                  <NavLinkMobile href="/">Home</NavLinkMobile>
                </SheetClose>
                <SheetClose asChild>
                  <NavLinkMobile href="/editor">Editor</NavLinkMobile>
                </SheetClose>
                {/* <SheetClose asChild>
                  <NavLinkMobile href="/about">About</NavLinkMobile>
                </SheetClose> */}
              </div>
              
              <div className="mt-auto pb-8">
                <p className="text-sm text-gray-500 dark:text-gray-400 px-4">
                  The modern markdown editor for GitHub
                </p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

// Reusable NavLink component for desktop
const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href}>
    <div className="text-xl transition-colors hover:text-gray-900 dark:hover:text-gray-100">
      {children}
    </div>
  </Link>
);

// Reusable NavLink component for mobile
const NavLinkMobile = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href}>
    <div className="text-xl py-2 px-4 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
      {children}
    </div>
  </Link>
);