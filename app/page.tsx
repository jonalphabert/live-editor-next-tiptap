// app/page.tsx
'use client'

import { useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function HomePage() {
  const [dark, setDark] = useState(false)

  return (
    <main className={dark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}>
      <div className="max-w-5xl mx-auto px-4 py-12 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-2xl font-bold">OpenEditor</h1>
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-md border hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Hero */}
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            A Clean, Powerful Online Editor — Open Source
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Built with Tiptap & Next.js for writing anything beautifully.
          </p>
          <div className="flex justify-center gap-4">
            <a href="/editor" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
              Start Writing
            </a>
            <a
              href="https://github.com/your-repo"
              target="_blank"
              className="px-6 py-3 border rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              GitHub Repo
            </a>
          </div>
        </section>

        {/* Features */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold mb-6 text-center">Features</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              ['📝 Rich Text Editing', 'Headings, bold, links, lists & more.'],
              ['🌙 Dark Mode', 'Switch themes anytime for comfort.'],
              ['📤 Export Options', 'Download your content as Markdown or HTML.'],
              ['🔌 Plugin Support', 'Add features using Tiptap extensions.'],
              ['💾 Auto Save', 'Your work is saved in local storage.'],
              ['🔓 100% Free & Open Source', 'MIT licensed for everyone.']
            ].map(([title, desc], i) => (
              <div key={i} className="p-4 border rounded-xl hover:shadow-lg transition">
                <h4 className="font-semibold text-lg mb-2">{title}</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{desc}</p>
              </div>
            ))}
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

        {/* Open Source */}
        <section className="text-center mb-16">
          <h3 className="text-2xl font-bold mb-4">Open Source & Developer Friendly</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-xl mx-auto">
            OpenEditor is fully open source. Clone it, customize it, or contribute to make it better.
          </p>
          <a
            href="https://github.com/your-repo"
            target="_blank"
            className="px-6 py-3 border rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Contribute on GitHub
          </a>
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 dark:text-gray-400">
          Built with ❤️ using Tiptap & Next.js — MIT Licensed
        </footer>
      </div>
    </main>
  )
}
