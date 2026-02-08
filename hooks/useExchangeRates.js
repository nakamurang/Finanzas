import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = 'c58046e229be083882542fe2';
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;
const CACHE_KEY = 'exchange_rates_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const useExchangeRates = () => {
    const [rates, setRates] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(null);

    useEffect(() => {
        fetchExchangeRates();
    }, []);

    const fetchExchangeRates = async () => {
        try {
            setLoading(true);

            // Try to load cached rates first
            const cachedData = await AsyncStorage.getItem(CACHE_KEY);

            if (cachedData) {
                const { rates: cachedRates, timestamp } = JSON.parse(cachedData);
                const now = Date.now();

                // Use cached rates if less than 24 hours old
                if (now - timestamp < CACHE_DURATION) {
                    setRates(cachedRates);
                    setLastUpdate(new Date(timestamp));
                    setLoading(false);
                    return;
                }
            }

            // Fetch fresh rates from API
            const response = await fetch(API_URL);
            const data = await response.json();

            if (data.result === 'success') {
                const exchangeRates = data.conversion_rates;
                setRates(exchangeRates);

                const timestamp = Date.now();
                setLastUpdate(new Date(timestamp));

                // Cache the rates
                await AsyncStorage.setItem(
                    CACHE_KEY,
                    JSON.stringify({ rates: exchangeRates, timestamp })
                );

                setError(null);
            } else {
                throw new Error('Failed to fetch exchange rates');
            }
        } catch (err) {
            console.error('Exchange rate fetch error:', err);
            setError(err.message);

            // Try to use cached rates even if expired
            const cachedData = await AsyncStorage.getItem(CACHE_KEY);
            if (cachedData) {
                const { rates: cachedRates, timestamp } = JSON.parse(cachedData);
                setRates(cachedRates);
                setLastUpdate(new Date(timestamp));
            }
        } finally {
            setLoading(false);
        }
    };

    return { rates, loading, error, lastUpdate, refetch: fetchExchangeRates };
};
