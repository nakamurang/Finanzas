import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ExpensesContext = createContext();

export const ExpensesProvider = ({ children }) => {
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        loadExpenses();
    }, []);

    const loadExpenses = async () => {
        try {
            const storedExpenses = await AsyncStorage.getItem('expenses');
            if (storedExpenses) {
                setExpenses(JSON.parse(storedExpenses));
            }
        } catch (e) {
            console.error('Failed to load expenses', e);
        }
    };

    const saveExpenses = async (newExpenses) => {
        try {
            await AsyncStorage.setItem('expenses', JSON.stringify(newExpenses));
        } catch (e) {
            console.error('Failed to save expenses', e);
        }
    };

    const addExpense = (newExpense) => {
        const updatedExpenses = [newExpense, ...expenses];
        setExpenses(updatedExpenses);
        saveExpenses(updatedExpenses);
    };

    const updateExpense = (id, updatedFields) => {
        const updatedExpenses = expenses.map(item => {
            if (item.id === id) {
                return { ...item, ...updatedFields };
            }
            return item;
        });
        setExpenses(updatedExpenses);
        saveExpenses(updatedExpenses);
    };

    const deleteExpense = (id) => {
        const updatedExpenses = expenses.filter((item) => item.id !== id);
        setExpenses(updatedExpenses);
        saveExpenses(updatedExpenses);
    };

    return (
        <ExpensesContext.Provider value={{ expenses, addExpense, updateExpense, deleteExpense }}>
            {children}
        </ExpensesContext.Provider>
    );
};
