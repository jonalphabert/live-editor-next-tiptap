import GlassEditor from '@/components/AnimationEditor';
import { Navbar } from '@/components/Navbar'
import { EyeIcon, LayoutDashboardIcon, UploadCloudIcon } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {

  const exampleCode = 
`# Welcome to OpenEditor!

This is a **sample** code block. You can write **Markdown** here.

This editor **formats markdown in real-time** as you type! Here are some features:
`;

  return (
    <div className="px-4">

      <Navbar/>

      <main>
        <div className="container mx-auto px-4 py-12 min-h-screen">

          <section className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-8">
              Craft Perfect GitHub Content with Real-Time Preview
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            A lightning-fast editor that understands GitHub's markdown flavor. Write documentation, profile bios, and project READMEs with confidence—seeing exactly how they'll appear on GitHub as you type. No more guesswork, just polished content.
            </p>
            <div className="flex justify-center gap-4 mb-24">
              <div>
                <Link href="/editor" >
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium py-3 px-6 rounded-md hover:shadow-lg transition-all mb-2">
                    Write Like GitHub Pro
                  </div>
                </Link>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">No signup required • Works in browser</p>
              </div>
            </div>
            <GlassEditor 
                code={exampleCode} 
                language="Readme.md" 
                typingSpeed={30}
              />
          </section>

          {/* Features */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
              {/* Feature 1: Real-time Rendering */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300 group">
                <div className="w-12 h-12 mb-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <EyeIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  Real-time GitHub Rendering
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  See your markdown transform <em>instantly</em> into GitHub’s style—no more guessing how tables, 
                  code blocks, or mentions will look after commit.
                </p>
              </div>

              {/* Feature 2: Drag-and-Drop */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300 group">
                <div className="w-12 h-12 mb-4 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UploadCloudIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  Drag-and-Drop Images
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Add visuals in seconds—drag images directly into the editor or paste from clipboard. 
                  Automatically optimized for GitHub’s CDN.
                </p>
              </div>

              {/* Feature 3: Clean Interface */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300 group">
                <div className="w-12 h-12 mb-4 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <LayoutDashboardIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  Distraction-Free Zen Mode
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  A minimalist interface with focus modes and keyboard shortcuts—write docs like a pro 
                  without messy toolbars.
                </p>
              </div>
            </div>
          </section>

          {/* Demo / Preview */}
          <section className="text-center mb-16">
            <h3 className="text-2xl font-bold mb-4">Live Demo</h3>
            <p className="mb-4 text-gray-600 dark:text-gray-300">See the editor in action</p>
            <a
              href="/editor"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
            >
              Open Editor
            </a>
          </section>

          {/* Footer */}
          <footer className="text-center text-sm text-gray-500 dark:text-gray-400">
            Built with ❤️ using Tiptap & Next.js — MIT Licensed
          </footer>
        </div>
      </main>
    </div>
  )
}
