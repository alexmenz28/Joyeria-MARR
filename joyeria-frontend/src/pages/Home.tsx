import React from 'react';
import { Link } from 'react-router-dom';
import RevealSection from '../components/common/RevealSection';

const Home = () => {
  return (
    <div className="min-h-full font-sans">
      <section className="page-hero h-[70vh]">
        <img src="/Logo-MARR.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-10" />
        <RevealSection className="relative z-10 text-center">
          <h1 className="mb-4 text-5xl font-extrabold tracking-wide text-marrGold drop-shadow md:text-6xl">The art of shining</h1>
          <p className="mb-10 text-xl text-gray-900 dark:text-gray-100 md:text-2xl">Exclusive jewelry, made for you</p>
          <Link to="/catalog" className="btn-marr !rounded-full px-8 py-3 text-lg">
            View collection
          </Link>
        </RevealSection>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-24 md:px-8">
        <RevealSection>
          <h2 className="mb-14 text-center text-3xl font-bold text-marrGold">Featured collections</h2>
        </RevealSection>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {[
            { title: 'Aurora', text: 'Pieces inspired by light and renewal. Gold and diamonds in perfect harmony.' },
            { title: 'Eternum', text: 'Timeless jewelry for unforgettable moments. Luxury that spans generations.' },
            { title: 'Esencia', text: 'Minimalism and elegance in every detail. For those who seek subtle distinction.' },
          ].map((item, i) => (
            <RevealSection key={item.title} delay={i * 80}>
              <Link
                to="/catalog"
                className="surface-card group block overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
              >
                <img src="/Logo-MARR.png" alt={`Collection ${item.title}`} className="h-56 w-full object-cover transition-opacity duration-200 group-hover:opacity-90" />
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-semibold text-marrGold">{item.title}</h3>
                  <p className="mb-4 text-gray-700 dark:text-gray-200">{item.text}</p>
                  <span className="font-medium text-gold-600 underline dark:text-gold-400">Discover</span>
                </div>
              </Link>
            </RevealSection>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-ivory via-white to-gold-50 px-6 py-24 dark:from-night-900/50 md:px-8">
        <div className="mx-auto max-w-5xl">
          <RevealSection slow>
            <div className="flex flex-col items-center gap-14 md:flex-row">
              <img src="/Logo-MARR.png" alt="Joyeria MARR workshop" className="h-64 w-64 flex-shrink-0 rounded-full border-4 border-marrGold object-contain shadow-lg" />
              <div>
                <h2 className="mb-4 text-3xl font-bold text-marrGold">Our story</h2>
                <p className="mb-2 text-lg text-gray-800 dark:text-gray-200">
                  For over two decades, Joyeria MARR has turned emotions into one-of-a-kind pieces. Our passion for craft and excellence drives us to create jewelry that tells stories and celebrates irreplaceable moments.
                </p>
                <p className="text-lg text-gray-800 dark:text-gray-200">
                  Each piece is crafted by expert hands, blending tradition and innovation with an unwavering commitment to quality and sustainability.
                </p>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      <section className="mx-auto flex max-w-5xl flex-col items-center gap-14 px-6 py-24 md:flex-row md:px-8">
        <RevealSection className="flex-1">
          <h2 className="mb-4 text-3xl font-bold text-marrGold">Design your own piece</h2>
          <p className="mb-6 text-lg text-muted">
            Bring the jewelry you envision to life. Our team guides you through every step to create an exclusive design, made just for you.
          </p>
          <Link to="/custom-order" className="btn-marr !rounded-full px-8 py-3 text-lg">
            Start your design
          </Link>
        </RevealSection>
        <RevealSection delay={100}>
          <img src="/Logo-MARR.png" alt="Customization" className="h-80 w-80 rounded-xl border-2 border-marrGold object-contain shadow-lg" />
        </RevealSection>
      </section>

      <section className="bg-white px-6 py-24 dark:bg-night-900 md:px-8">
        <RevealSection>
          <h2 className="mb-14 text-center text-3xl font-bold text-marrGold">What our clients say</h2>
        </RevealSection>
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-10 md:grid-cols-2">
          {[
            { quote: 'The service was impeccable and the piece exceeded all my expectations. I will definitely come back!', author: 'Ana G.' },
            { quote: 'They helped me customize a ring for my anniversary. The result was stunning and the process was very smooth.', author: 'Luis M.' },
          ].map((item, i) => (
            <RevealSection key={item.author} delay={i * 80}>
              <div className="surface-card p-8">
                <p className="mb-4 text-lg italic text-gray-800 dark:text-gray-200">&ldquo;{item.quote}&rdquo;</p>
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-marrGold bg-gold-50 text-sm font-bold text-marrGold dark:bg-night-700">
                    {item.author.charAt(0)}
                  </span>
                  <span className="font-semibold text-marrGold">{item.author}</span>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </section>

      <section className="relative flex flex-col items-center justify-between gap-10 bg-gradient-to-r from-gold-600 to-gold-400 px-6 py-16 md:flex-row md:px-8">
        <RevealSection className="flex-1 text-center md:text-left">
          <h2 className="mb-2 text-2xl font-bold text-white md:text-3xl">New Spring 2025 collection!</h2>
          <p className="mb-4 text-lg text-white/95">
            Discover pieces inspired by nature and light. For a limited time: <span className="font-bold">10% off</span> your first purchase.
          </p>
          <Link to="/catalog" className="inline-block rounded-full bg-white px-8 py-3 text-lg font-semibold text-gold-700 shadow-lg transition-all duration-200 hover:bg-gold-50">
            See what&apos;s new
          </Link>
        </RevealSection>
        <RevealSection delay={80}>
          <img src="/Logo-MARR.png" alt="New collection" className="h-56 w-56 rounded-xl border-2 border-white object-contain shadow-lg" />
        </RevealSection>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-24 md:px-8">
        <RevealSection>
          <h2 className="mb-12 text-center text-3xl font-bold text-marrGold">#JoyeriaMARR on Instagram</h2>
        </RevealSection>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {[
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
          ].map((src, i) => (
            <RevealSection key={src} delay={i * 60}>
              <img src={src} alt={`Community ${i + 1}`} className="h-48 w-full rounded-lg object-cover shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg" />
            </RevealSection>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-lg font-medium text-gold-600 underline hover:opacity-80 dark:text-gold-400">
            Follow us on Instagram
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
