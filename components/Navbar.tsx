import Link from "next/link";
import ThemeToggle from "./theme/ThemeButton";

export const Navbar: React.FC = () => {
  return (
    <nav className="container mx-auto bg-gray-100 dark:bg-gray-800/70 backdrop-blur-md rounded-md shadow-md px-12 py-4 flex justify-between items-center mb-12 top-12 sticky">
        <h1 className="text-2xl font-bold">OpenEditor</h1>
        <div className='flex gap-8 items-center justify-center'>
            <Link href="/">
            <div className='text-xl transition-colors hover:text-gray-900 dark:hover:text-gray-100'>Home</div>
            </Link>
            <Link href="/editor">
            <div className='text-xl transition-colors hover:text-gray-900 dark:hover:text-gray-100'>Editor</div>
            </Link>
            <Link href="/about">
            <div className='text-xl transition-colors hover:text-gray-900 dark:hover:text-gray-100'>About</div>
            </Link>
            <ThemeToggle />
        </div>
    </nav>
  );
};
