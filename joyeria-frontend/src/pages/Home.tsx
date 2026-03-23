import React from 'react';
import { Link } from 'react-router-dom';
import RevealSection from '../components/common/RevealSection';

const Home = () => {
  return (
    <div className="min-h-full font-sans">
      <section className="relative h-[70vh] flex items-center justify-center bg-gradient-to-br from-ivory via-white to-gold-50 dark:from-night-900 dark:via-night-800 dark:to-night-900 overflow-hidden px-6">
        <img src="/Logo-MARR.png" alt="Featured jewelry" className="absolute inset-0 w-full h-full object-cover opacity-10" />
        <RevealSection className="relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-marrGold drop-shadow mb-4 tracking-wide">The art of shining</h1>
          <p className="text-xl md:text-2xl text-gray-900 dark:text-gray-100 mb-10">Exclusive jewelry, made for you</p>
          <Link to="/catalog" className="inline-block bg-gold-500 text-white px-8 py-3 rounded-full shadow-lg hover:bg-gold-600 transition-all duration-200 text-lg font-semibold">View collection</Link>
        </RevealSection>
      </section>

      <section className="max-w-5xl mx-auto py-24 px-6 md:px-8">
        <RevealSection>
          <h2 className="text-3xl font-bold text-center text-marrGold mb-14">Featured collections</h2>
        </RevealSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { title: 'Aurora', text: 'Pieces inspired by light and renewal. Gold and diamonds in perfect harmony.' },
            { title: 'Eternum', text: 'Timeless jewelry for unforgettable moments. Luxury that spans generations.' },
            { title: 'Esencia', text: 'Minimalism and elegance in every detail. For those who seek subtle distinction.' },
          ].map((item, i) => (
            <RevealSection key={item.title} delay={i * 80}>
              <Link to="/catalog" className="block bg-white dark:bg-night-800 rounded-lg shadow-md overflow-hidden group border border-gold-100/40 dark:border-gold-500/10 transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
                <img src="/Logo-MARR.png" alt={`Collection ${item.title}`} className="w-full h-56 object-cover group-hover:opacity-90 transition-opacity duration-200" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-marrGold mb-2">{item.title}</h3>
                  <p className="text-gray-700 dark:text-gray-200 mb-4">{item.text}</p>
                  <span className="text-gold-600 dark:text-gold-400 underline font-medium">Discover</span>
                </div>
              </Link>
            </RevealSection>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-ivory via-white to-gold-50 dark:from-night-900/50 py-24 px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          <RevealSection slow>
            <div className="flex flex-col md:flex-row items-center gap-14">
              <img src="/Logo-MARR.png" alt="Joyeria MARR workshop" className="w-64 h-64 object-contain rounded-full shadow-lg border-4 border-marrGold flex-shrink-0" />
              <div>
                <h2 className="text-3xl font-bold text-marrGold mb-4">Our story</h2>
                <p className="text-gray-800 dark:text-gray-200 text-lg mb-2">For over two decades, Joyeria MARR has turned emotions into one-of-a-kind pieces. Our passion for craft and excellence drives us to create jewelry that tells stories and celebrates irreplaceable moments.</p>
                <p className="text-gray-800 dark:text-gray-200 text-lg">Each piece is crafted by expert hands, blending tradition and innovation with an unwavering commitment to quality and sustainability.</p>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      <section className="max-w-5xl mx-auto py-24 px-6 md:px-8 flex flex-col md:flex-row items-center gap-14">
        <RevealSection className="flex-1">
          <h2 className="text-3xl font-bold text-marrGold mb-4">Design your own piece</h2>
          <p className="text-gray-700 dark:text-gray-200 text-lg mb-6">Bring the jewelry you envision to life. Our team guides you through every step to create an exclusive design, made just for you.</p>
          <Link to="/custom-order" className="inline-block bg-gold-500 text-white px-8 py-3 rounded-full shadow-lg hover:bg-gold-600 transition-all duration-200 text-lg font-semibold">Start your design</Link>
        </RevealSection>
        <RevealSection delay={100}>
          <img src="/Logo-MARR.png" alt="Customization" className="w-80 h-80 object-contain rounded-xl shadow-lg border-2 border-marrGold" />
        </RevealSection>
      </section>

      <section className="bg-white dark:bg-night-900 py-24 px-6 md:px-8">
        <RevealSection>
          <h2 className="text-3xl font-bold text-center text-marrGold mb-14">What our clients say</h2>
        </RevealSection>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          <RevealSection delay={0}>
            <div className="bg-gold-50/50 dark:bg-night-800 p-8 rounded-xl shadow-md border border-gold-100/40 dark:border-gold-500/10">
              <p className="text-lg text-gray-800 dark:text-gray-200 italic mb-4">&ldquo;The service was impeccable and the piece exceeded all my expectations. I will definitely come back!&rdquo;</p>
              <div className="flex items-center gap-4">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Ana G." className="w-12 h-12 rounded-full border-2 border-marrGold" />
                <span className="text-marrGold font-semibold">Ana G.</span>
              </div>
            </div>
          </RevealSection>
          <RevealSection delay={80}>
            <div className="bg-gold-50/50 dark:bg-night-800 p-8 rounded-xl shadow-md border border-gold-100/40 dark:border-gold-500/10">
              <p className="text-lg text-gray-800 dark:text-gray-200 italic mb-4">&ldquo;They helped me customize a ring for my anniversary. The result was stunning and the process was very smooth.&rdquo;</p>
              <div className="flex items-center gap-4">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Luis M." className="w-12 h-12 rounded-full border-2 border-marrGold" />
                <span className="text-marrGold font-semibold">Luis M.</span>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      <section className="relative bg-gradient-to-r from-gold-600 to-gold-400 py-16 px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-10">
        <RevealSection className="flex-1 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">New Spring 2025 collection!</h2>
          <p className="text-white/95 text-lg mb-4">Discover pieces inspired by nature and light. For a limited time: <span className="font-bold">10% off</span> your first purchase.</p>
          <Link to="/catalog" className="inline-block bg-white text-gold-700 px-8 py-3 rounded-full shadow-lg hover:bg-gold-50 transition-all duration-200 text-lg font-semibold">See what&apos;s new</Link>
        </RevealSection>
        <RevealSection delay={80}>
          <img src="/Logo-MARR.png" alt="New collection" className="w-56 h-56 object-contain rounded-xl shadow-lg border-2 border-white" />
        </RevealSection>
      </section>

      <section className="max-w-5xl mx-auto py-24 px-6 md:px-8">
        <RevealSection>
          <h2 className="text-3xl font-bold text-center text-marrGold mb-12">#JoyeriaMARR on Instagram</h2>
        </RevealSection>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
          ].map((src, i) => (
            <RevealSection key={src} delay={i * 60}>
              <img src={src} alt={`Community ${i + 1}`} className="w-full h-48 object-cover rounded-lg shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5" />
            </RevealSection>
          ))}
        </div>
        <div className="text-center mt-10">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gold-600 dark:text-gold-400 underline font-medium text-lg hover:opacity-80 transition-opacity duration-200">Follow us on Instagram</a>
        </div>
      </section>
    </div>
  );
};

export default Home;
