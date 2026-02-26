import Image from "next/image";
import FadeIn from "@/components/ui/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "The story behind Wabi — connecting Japanese artisans with the world through the philosophy of wabi-sabi.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <FadeIn>
        <h1 className="font-serif text-3xl md:text-4xl text-charcoal mb-8">About Wabi</h1>
      </FadeIn>

      <FadeIn delay={100}>
        <div className="relative aspect-[2/1] bg-cream overflow-hidden mb-12">
          <Image
            src="https://images.unsplash.com/photo-1545048702-79362596cdc9?w=1200&q=80"
            alt="Japanese pottery workshop"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      </FadeIn>

      <div className="space-y-8 text-stone-dark leading-relaxed">
        <FadeIn delay={200}>
          <h2 className="font-serif text-xl text-charcoal mb-3">The Philosophy</h2>
          <p>
            Wabi-sabi (侘寂) is the Japanese aesthetic centered on the acceptance of
            transience and imperfection. It finds beauty in the weathered, the humble,
            the incomplete. A cracked bowl repaired with gold. A tea cup with an uneven
            rim. A wooden board darkened by years of use.
          </p>
          <p className="mt-4">
            These are not flaws — they are stories. Each mark, each variation, each
            trace of time makes an object more truthful, more alive.
          </p>
        </FadeIn>

        <FadeIn delay={300}>
          <h2 className="font-serif text-xl text-charcoal mb-3">Our Mission</h2>
          <p>
            Wabi exists to connect the artisans of Japan with people around the world
            who value craft, intentionality, and the beauty of handmade things. We
            work directly with potters, blacksmiths, woodworkers, and lacquer artists
            — many from families that have practiced their craft for generations.
          </p>
          <p className="mt-4">
            Every piece we carry has been chosen with care. We visit the workshops, we
            understand the processes, we know the people. When you receive something
            from Wabi, you receive not just an object but a connection to its maker and
            the tradition it carries.
          </p>
        </FadeIn>

        <FadeIn delay={400}>
          <h2 className="font-serif text-xl text-charcoal mb-3">Our Artisans</h2>
          <p>
            We partner with craftspeople across Japan — from the ancient kilns of Bizen
            and Shigaraki to the blacksmith forges of Tosa and the cypress forests of
            Yoshino. Each artisan brings their own interpretation of traditional
            techniques, creating pieces that honor the past while remaining vital and
            contemporary.
          </p>
          <p className="mt-4 text-sm text-stone italic">
            Individual artisan profiles coming soon.
          </p>
        </FadeIn>

        <FadeIn delay={500}>
          <div className="border-t border-cream pt-8 mt-12">
            <blockquote className="font-serif text-xl text-charcoal text-center italic leading-relaxed">
              &ldquo;In the beginner&apos;s mind there are many possibilities, but in the
              expert&apos;s there are few.&rdquo;
            </blockquote>
            <p className="text-center text-sm text-stone mt-4">
              — Shunryu Suzuki
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
