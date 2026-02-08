import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Modal, ScrollView, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import { Colors } from '../constants/colors';
import { CATEGORIES, INCOME_CATEGORIES, SUBCATEGORIES, PAYMENT_METHODS, CURRENCIES } from '../constants/data';
import BottomSheetPicker from './BottomSheetPicker';


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
            <KeyboardAvoidingView
                style={styles.modalContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* Fixed Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.headerButton} onPress={onClose}>
                        <Text style={styles.headerButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>
                        {initialData ? (isIncome ? 'Edit Income' : 'Edit Expense') : (isIncome ? 'New Income' : 'New Expense')}
                    </Text>
                    <TouchableOpacity style={styles.headerButton} onPress={handleSave}>
                        <Text style={[styles.headerButtonText, styles.saveText]}>
                            {initialData ? 'Update' : 'Save'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Scrollable Content */}
                <ScrollView
                    style={styles.scrollContent}
                    contentContainerStyle={styles.scrollContentContainer}
                    showsVerticalScrollIndicator={true}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Amount Section */}
                    <View style={styles.amountSection}>
                        <Text style={styles.sectionLabel}>Amount</Text>
                        <View style={styles.amountRow}>
                            <TextInput
                                style={styles.amountInput}
                                placeholder="0.00"
                                placeholderTextColor="#666"
                                keyboardType="numeric"
                                value={amount}
                                onChangeText={setAmount}
                            />
                            <TouchableOpacity
                                style={styles.currencyPill}
                                onPress={() => setShowCurrencyDropdown(true)}
                            >
                                <Text style={styles.currencyPillText}>{currency}</Text>
                                <Text style={styles.dropdownArrow}>▼</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Details Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Details</Text>

                        <Text style={styles.inputLabel}>Description</Text>
                        <TextInput
                            style={styles.input}
                            placeholder={isIncome ? "Source (e.g. Salary)" : "What did you spend on?"}
                            placeholderTextColor="#666"
                            value={description}
                            onChangeText={setDescription}
                        />

                        {!isIncome && (
                            <>
                                <Text style={styles.inputLabel}>Place / Location</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Where did you spend?"
                                    placeholderTextColor="#666"
                                    value={place}
                                    onChangeText={setPlace}
                                />
                            </>
                        )}
                    </View>

                    {/* Categories Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Classification</Text>

                        <View style={styles.fieldRow}>
                            <View style={styles.fieldHalf}>
                                <Text style={styles.inputLabel}>Category</Text>
                                <TouchableOpacity
                                    style={styles.dropdownSelector}
                                    onPress={() => setShowDropdown(true)}
                                >
                                    <Text style={styles.dropdownText}>{category}</Text>
                                    <Text style={styles.dropdownArrow}>▼</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.fieldHalf}>
                                <Text style={styles.inputLabel}>Subcategory</Text>
                                <TouchableOpacity
                                    style={styles.dropdownSelector}
                                    onPress={() => setShowSubcategoryDropdown(true)}
                                >
                                    <Text style={styles.dropdownText}>{subcategory}</Text>
                                    <Text style={styles.dropdownArrow}>▼</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Payment Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Payment</Text>

                        <Text style={styles.inputLabel}>Payment Method</Text>
                        <TouchableOpacity
                            style={styles.dropdownSelector}
                            onPress={() => setShowPaymentDropdown(true)}
                        >
                            <Text style={styles.dropdownText}>{paymentMethod}</Text>
                            <Text style={styles.dropdownArrow}>▼</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Spacer for bottom */}
                    <View style={{ height: 40 }} />
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Bottom Sheet Pickers */}
            <BottomSheetPicker
                visible={showDropdown}
                options={currentCategories}
                selectedValue={category}
                onSelect={setCategory}
                onClose={() => setShowDropdown(false)}
                title="Select Category"
            />

            <BottomSheetPicker
                visible={showSubcategoryDropdown}
                options={SUBCATEGORIES}
                selectedValue={subcategory}
                onSelect={setSubcategory}
                onClose={() => setShowSubcategoryDropdown(false)}
                title="Select Subcategory"
            />

            <BottomSheetPicker
                visible={showPaymentDropdown}
                options={PAYMENT_METHODS}
                selectedValue={paymentMethod}
                onSelect={setPaymentMethod}
                onClose={() => setShowPaymentDropdown(false)}
                title="Payment Method"
            />

            <BottomSheetPicker
                visible={showCurrencyDropdown}
                options={CURRENCIES}
                selectedValue={currency}
                onSelect={setCurrency}
                onClose={() => setShowCurrencyDropdown(false)}
                title="Select Currency"
            />
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        backgroundColor: Colors.surface,
    },
    headerButton: {
        paddingVertical: 8,
        paddingHorizontal: 4,
        minWidth: 60,
    },
    headerButtonText: {
        fontSize: 16,
        color: Colors.textSecondary,
    },
    saveText: {
        color: Colors.primary,
        fontWeight: '600',
        textAlign: 'right',
    },
    modalTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: Colors.text,
        textAlign: 'center',
    },
    scrollContent: {
        flex: 1,
    },
    scrollContentContainer: {
        padding: 16,
    },
    amountSection: {
        backgroundColor: Colors.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
    },
    sectionLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    amountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    amountInput: {
        fontSize: 42,
        fontWeight: '600',
        color: Colors.text,
        textAlign: 'center',
        minWidth: 150,
    },
    currencyPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.border,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        gap: 6,
    },
    currencyPillText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
    },
    section: {
        backgroundColor: Colors.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textSecondary,
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    fieldRow: {
        flexDirection: 'row',
        gap: 12,
    },
    fieldHalf: {
        flex: 1,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '500',
        marginBottom: 6,
        color: Colors.textSecondary,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.inputBackground,
        color: Colors.text,
        padding: 14,
        borderRadius: 10,
        marginBottom: 12,
        fontSize: 16,
    },
    dropdownSelector: {
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.inputBackground,
        padding: 14,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    dropdownText: {
        fontSize: 16,
        color: Colors.text,
    },
    dropdownArrow: {
        fontSize: 12,
        color: Colors.textSecondary,
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
