'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

export default function WorkGrid({ works }: { works: any[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 max-w-7xl mx-auto">
      {works.map((work, i) => (
        <motion.div
          key={work.id}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
        >
          <Link href={`/works/${work.id}`} className="block group">
            <div className="aspect-[4/3] relative overflow-hidden rounded-xl bg-neutral-100">
              {work.cover_url && (
                <Image
                  src={work.cover_url}
                  alt={work.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              )}
            </div>
            <h2 className="mt-3 text-lg font-semibold">{work.title}</h2>
            <p className="text-sm text-neutral-500">{work.categories?.name}</p>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}