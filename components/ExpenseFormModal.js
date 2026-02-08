import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Modal, ScrollView, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
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
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
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

                // Parse date and time if available
                if (initialData.date && initialData.time) {
                    try {
                        const [day, month, year] = initialData.date.split('/');
                        const [hours, minutes] = initialData.time.split(':');
                        const newDate = new Date(year, month - 1, day, hours, minutes);
                        setDate(newDate);
                    } catch (e) {
                        setDate(new Date());
                    }
                } else {
                    setDate(new Date());
                }
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
        setDate(new Date());
        setShowDatePicker(false);
        setShowTimePicker(false);
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
            date: date.toLocaleDateString('en-GB'), // DD/MM/YYYY
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
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

                    {/* Payment & Time Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Payment & Time</Text>

                        <Text style={styles.inputLabel}>Payment Method</Text>
                        <TouchableOpacity
                            style={styles.dropdownSelector}
                            onPress={() => setShowPaymentDropdown(true)}
                        >
                            <Text style={styles.dropdownText}>{paymentMethod}</Text>
                            <Text style={styles.dropdownArrow}>▼</Text>
                        </TouchableOpacity>

                        <Text style={styles.inputLabel}>Date & Time</Text>
                        <View style={styles.fieldRow}>
                            <TouchableOpacity
                                style={[styles.dropdownSelector, styles.fieldHalf]}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text style={styles.dropdownText}>{date.toLocaleDateString('en-GB')}</Text>
                                <Ionicons name="calendar-outline" size={18} color={Colors.textSecondary} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.dropdownSelector, styles.fieldHalf]}
                                onPress={() => setShowTimePicker(true)}
                            >
                                <Text style={styles.dropdownText}>
                                    {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                </Text>
                                <Ionicons name="time-outline" size={18} color={Colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* DateTime Pickers (Hidden triggers) */}
                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowDatePicker(false);
                                if (selectedDate) {
                                    const newDate = new Date(date);
                                    newDate.setFullYear(selectedDate.getFullYear());
                                    newDate.setMonth(selectedDate.getMonth());
                                    newDate.setDate(selectedDate.getDate());
                                    setDate(newDate);
                                }
                            }}
                        />
                    )}

                    {showTimePicker && (
                        <DateTimePicker
                            value={date}
                            mode="time"
                            display="default"
                            is24Hour={true}
                            onChange={(event, selectedTime) => {
                                setShowTimePicker(false);
                                if (selectedTime) {
                                    const newDate = new Date(date);
                                    newDate.setHours(selectedTime.getHours());
                                    newDate.setMinutes(selectedTime.getMinutes());
                                    setDate(newDate);
                                }
                            }}
                        />
                    )}

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
});
