import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Modal, ScrollView, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Colors } from '../constants/colors';

const CATEGORIES = ['Food', 'Transport', 'Car', 'Health', 'Household', 'Clothes', 'Education', 'Bills', 'Technology', 'Pets', 'Beauty', 'Gifts', 'Other'];
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Gift', 'Bonus', 'Refund', 'Other'];
const SUBCATEGORIES = ['Personal', 'Entertainment', 'Work', 'Home', 'Family', 'Other'];
const PAYMENT_METHODS = ['Cash', 'Credit Card', 'Debit Card', 'Transfer'];
const CURRENCIES = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'ARS', name: 'Argentine Peso' },
    { code: 'BRL', name: 'Brazilian Real' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'CHF', name: 'Swiss Franc' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'MXN', name: 'Mexican Peso' },
    { code: 'INR', name: 'Indian Rupee' }
];

export default function ExpenseFormModal({ visible, onClose, onSubmit, initialData, isIncome }) {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState(isIncome ? 'Salary' : 'Other');
    const [subcategory, setSubcategory] = useState('Other');
    const [place, setPlace] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [showDropdown, setShowDropdown] = useState(false);
    const [showSubcategoryDropdown, setShowSubcategoryDropdown] = useState(false);
    const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);
    const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

    useEffect(() => {
        if (visible) {
            if (initialData) {
                setDescription(initialData.description);
                setAmount(initialData.amount);
                setCategory(initialData.category);
                setSubcategory(initialData.subcategory || 'Other');
                setPlace(initialData.place || '');
                setCurrency(initialData.currency);
                setPaymentMethod(initialData.paymentMethod);
            } else {
                resetForm();
            }
        }
    }, [visible, initialData, isIncome]);

    const resetForm = () => {
        setDescription('');
        setAmount('');
        setCategory(isIncome ? 'Salary' : 'Other');
        setSubcategory('Other');
        setPlace('');
        setCurrency('USD');
        setPaymentMethod('Cash');
        setShowDropdown(false);
        setShowSubcategoryDropdown(false);
        setShowPaymentDropdown(false);
        setShowCurrencyDropdown(false);
    };

    const handleSave = () => {
        if (!description || !amount) return;

        const data = {
            description,
            amount: parseFloat(amount).toFixed(2),
            category,
            subcategory,
            place: isIncome ? '' : place,
            currency,
            paymentMethod,
            type: isIncome ? 'income' : 'expense',
        };

        onSubmit(data);
        onClose();
    };

    const currentCategories = isIncome ? INCOME_CATEGORIES : CATEGORIES;

    return (
        <Modal visible={visible} animationType="slide">
            <View style={styles.modalContainer}>
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.modalTitle}>
                            {initialData ? (isIncome ? 'Edit Income' : 'Edit Expense') : (isIncome ? 'New Income' : 'New Expense')}
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder={isIncome ? "Source (e.g. Salary)" : "What did you buy?"}
                            placeholderTextColor="#888"
                            value={description}
                            onChangeText={setDescription}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Amount ($)"
                            placeholderTextColor="#888"
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                        />

                        {!isIncome && (
                            <TextInput
                                style={styles.input}
                                placeholder="Place / Location"
                                placeholderTextColor="#888"
                                value={place}
                                onChangeText={setPlace}
                            />
                        )}

                        <Text style={styles.inputLabel}>Select Category:</Text>
                        <View style={[styles.dropdownWrapper, { zIndex: 2000 }]}>
                            <TouchableOpacity
                                style={styles.dropdownSelector}
                                onPress={() => setShowDropdown(!showDropdown)}
                            >
                                <Text style={styles.dropdownText}>{category}</Text>
                                <Text style={{ fontSize: 12, color: Colors.text }}>▼</Text>
                            </TouchableOpacity>

                            {showDropdown && (
                                <View style={styles.dropdownList}>
                                    {currentCategories.map((cat) => (
                                        <TouchableOpacity
                                            key={cat}
                                            style={styles.dropdownItem}
                                            onPress={() => {
                                                setCategory(cat);
                                                setShowDropdown(false);
                                            }}
                                        >
                                            <Text style={styles.dropdownItemText}>{cat}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>

                        <Text style={styles.inputLabel}>Select Subcategory:</Text>
                        <View style={[styles.dropdownWrapper, { zIndex: 1500 }]}>
                            <TouchableOpacity
                                style={styles.dropdownSelector}
                                onPress={() => setShowSubcategoryDropdown(!showSubcategoryDropdown)}
                            >
                                <Text style={styles.dropdownText}>{subcategory}</Text>
                                <Text style={{ fontSize: 12, color: Colors.text }}>▼</Text>
                            </TouchableOpacity>

                            {showSubcategoryDropdown && (
                                <View style={styles.dropdownList}>
                                    {SUBCATEGORIES.map((subcat) => (
                                        <TouchableOpacity
                                            key={subcat}
                                            style={styles.dropdownItem}
                                            onPress={() => {
                                                setSubcategory(subcat);
                                                setShowSubcategoryDropdown(false);
                                            }}
                                        >
                                            <Text style={styles.dropdownItemText}>{subcat}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>

                        <Text style={styles.inputLabel}>Payment Method:</Text>
                        <View style={[styles.dropdownWrapper, { zIndex: 1000 }]}>
                            <TouchableOpacity
                                style={styles.dropdownSelector}
                                onPress={() => setShowPaymentDropdown(!showPaymentDropdown)}
                            >
                                <Text style={styles.dropdownText}>{paymentMethod}</Text>
                                <Text style={{ fontSize: 12, color: Colors.text }}>▼</Text>
                            </TouchableOpacity>

                            {showPaymentDropdown && (
                                <View style={styles.dropdownList}>
                                    {PAYMENT_METHODS.map((method) => (
                                        <TouchableOpacity
                                            key={method}
                                            style={styles.dropdownItem}
                                            onPress={() => {
                                                setPaymentMethod(method);
                                                setShowPaymentDropdown(false);
                                            }}
                                        >
                                            <Text style={styles.dropdownItemText}>{method}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>

                        <Text style={styles.inputLabel}>Currency:</Text>
                        <View style={[styles.dropdownWrapper, { zIndex: 500 }]}>
                            <TouchableOpacity
                                style={styles.dropdownSelector}
                                onPress={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                            >
                                <Text style={styles.dropdownText}>{currency}</Text>
                                <Text style={{ fontSize: 12, color: Colors.text }}>▼</Text>
                            </TouchableOpacity>

                            {showCurrencyDropdown && (
                                <ScrollView style={styles.dropdownList} nestedScrollEnabled={true}>
                                    {CURRENCIES.map((curr) => (
                                        <TouchableOpacity
                                            key={curr.code}
                                            style={styles.dropdownItem}
                                            onPress={() => {
                                                setCurrency(curr.code);
                                                setShowCurrencyDropdown(false);
                                            }}
                                        >
                                            <Text style={styles.dropdownItemText}>{curr.code} - {curr.name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            )}
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
                                <Text style={[styles.buttonText, styles.saveButtonText]}>{initialData ? 'Update' : 'Save'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: Colors.background,
        justifyContent: 'center',
    },
    inputContainer: {
        padding: 20,
        backgroundColor: Colors.surface,
        margin: 16,
        borderRadius: 10,
        elevation: 3,

        ...Platform.select({
            web: {
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            },
            default: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
        }),
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: Colors.text,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.inputBackground,
        color: Colors.text,
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        fontSize: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 10,
        color: Colors.textSecondary,
    },
    dropdownWrapper: {
        marginBottom: 15,
        position: 'relative',
    },
    dropdownSelector: {
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.inputBackground,
        padding: 15,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownText: {
        fontSize: 16,
        color: Colors.text,
    },
    dropdownList: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        marginTop: 4,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        backgroundColor: Colors.inputBackground,
        zIndex: 1000,
        elevation: 5,
    },
    dropdownItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
    },
    dropdownItemText: {
        fontSize: 16,
        color: Colors.text,
    },
    currencyContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 10,
    },
    filterChip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#333',
        borderWidth: 1,
        borderColor: '#444',
        marginRight: 10,
    },
    filterChipActive: {
        backgroundColor: '#FFFFFF',
    },
    filterText: {
        color: '#FFFFFF',
    },
    filterTextActive: {
        color: '#000000',
        fontWeight: 'bold',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    button: {
        backgroundColor: Colors.primary,
        borderWidth: 1,
        borderColor: '#555',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: Colors.surface, // Or just keep transparent/border
        borderColor: '#555',
        flex: 1,
    },
    saveButton: {
        backgroundColor: Colors.primary,
        flex: 1,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    saveButtonText: {
        color: '#000',
    },
});
