import React, { useState } from 'react';
import RevealSection from '../components/common/RevealSection';
import { Helmet } from 'react-helmet-async';
import api from '../utils/api';
import { getApiErrorMessage } from '../utils/apiErrors';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    try {
      const { data } = await api.post<{ message: string }>('/api/contact', {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });
      setSuccess(data.message || 'Message sent. Thank you!');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Could not send your message. Try again later.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-full font-sans">
      <Helmet>
        <title>Contact — Joyeria MARR</title>
      </Helmet>
      <section className="page-hero h-64 md:h-80">
        <img src="/Logo-MARR.png" alt="Contact Joyeria MARR" className="absolute inset-0 w-full h-full object-cover opacity-10" />
        <RevealSection className="relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-marrGold drop-shadow mb-2 tracking-wide">Contact</h2>
          <p className="text-lg md:text-xl text-gray-800 dark:text-gray-100">Questions? We are here to help</p>
        </RevealSection>
      </section>

      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 px-6 md:px-8 py-16">
        <RevealSection>
          <form
            onSubmit={handleSubmit}
            className="surface-panel flex flex-col gap-5 p-8"
          >
            <h3 className="text-2xl font-bold text-marrGold">Send us a message</h3>
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-marr"
              required
              maxLength={120}
            />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-marr"
              required
              maxLength={256}
            />
            <textarea
              placeholder="Your message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="input-marr resize-none"
              required
              maxLength={4000}
            />
            {error && (
              <p className="alert-error" role="alert">
                {error}
              </p>
            )}
            {success && (
              <p className="alert-success" role="status">
                {success}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="btn-marr !rounded-full"
            >
              {submitting ? 'Sending…' : 'Send message'}
            </button>
          </form>
        </RevealSection>
        <div className="flex flex-col gap-10 justify-center">
          <RevealSection delay={80}>
            <div>
              <h4 className="text-xl font-semibold text-marrGold mb-3">Contact details</h4>
              <p className="text-gray-800 dark:text-gray-200">
                Email:{' '}
                <a href="mailto:info@joyeriamarr.com" className="text-gold-600 dark:text-gold-400 underline hover:opacity-80 transition-opacity duration-200">
                  info@joyeriamarr.com
                </a>
              </p>
              <p className="text-gray-800 dark:text-gray-200 mt-1">
                Phone:{' '}
                <a href="tel:+521234567890" className="text-gold-600 dark:text-gold-400 underline hover:opacity-80 transition-opacity duration-200">
                  +52 123 456 7890
                </a>
              </p>
              <p className="text-gray-800 dark:text-gray-200 mt-1">Address: Av. de la Joya 123, Mexico City, Mexico</p>
            </div>
          </RevealSection>
          <RevealSection delay={120}>
            <div>
              <h4 className="text-xl font-semibold text-marrGold mb-3">Business hours</h4>
              <p className="text-gray-800 dark:text-gray-200">Monday–Friday: 10:00 – 19:00</p>
              <p className="text-gray-800 dark:text-gray-200 mt-1">Saturday: 11:00 – 15:00</p>
            </div>
          </RevealSection>
          <RevealSection delay={160}>
            <div>
              <h4 className="text-xl font-semibold text-marrGold mb-3">Follow us</h4>
              <div className="flex gap-6">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gold-600 dark:text-gold-400 hover:opacity-80 transition-opacity duration-200">
                  Instagram
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gold-600 dark:text-gold-400 hover:opacity-80 transition-opacity duration-200">
                  Facebook
                </a>
                <a href="https://wa.me/521234567890" target="_blank" rel="noopener noreferrer" className="text-gold-600 dark:text-gold-400 hover:opacity-80 transition-opacity duration-200">
                  WhatsApp
                </a>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 md:px-8 pb-24">
        <RevealSection>
          <div className="rounded-2xl overflow-hidden shadow-lg border border-gold-200/60 dark:border-gold-500/20">
            <iframe
              title="Joyeria MARR location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.123456789!2d-99.1234567!3d19.4326077!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1ff123456789%3A0x123456789abcdef!2sAv.+de+la+Joya+123,+CDMX!5e0!3m2!1ses-419!2smx!4v1710000000000!5m2!1ses-419!2smx"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </RevealSection>
      </section>
    </div>
  );
};

export default Contact;