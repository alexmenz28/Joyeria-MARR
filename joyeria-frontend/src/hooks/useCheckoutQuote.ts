import { useEffect, useState } from 'react';
import api from '../utils/api';

export type ShippingAddress = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type CheckoutQuote = {
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  shippingAmount: number;
  total: number;
  country: string;
};

const EMPTY_SHIPPING: ShippingAddress = {
  street: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'MX',
};

export function useCheckoutQuote(subtotal: number, shipping: ShippingAddress, enabled: boolean) {
  const [quote, setQuote] = useState<CheckoutQuote | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled || subtotal <= 0) {
      setQuote(null);
      return;
    }

    const { street, city, postalCode, country } = shipping;
    if (!street.trim() || !city.trim() || !postalCode.trim() || country.trim().length !== 2) {
      setQuote(null);
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.post<CheckoutQuote>('/api/checkout/quote', {
          subtotal,
          shipping: {
            street: street.trim(),
            city: city.trim(),
            state: shipping.state.trim() || undefined,
            postalCode: postalCode.trim(),
            country: country.trim().toUpperCase(),
          },
        });
        if (!cancelled) setQuote(data);
      } catch {
        if (!cancelled) setQuote(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 400);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [subtotal, enabled, shipping.street, shipping.city, shipping.state, shipping.postalCode, shipping.country]);

  return { quote, loading };
}

export { EMPTY_SHIPPING };
