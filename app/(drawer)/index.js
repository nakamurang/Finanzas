import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useExpenses } from '../../hooks/useExpenses';
import ExpenseFormModal from '../../components/ExpenseFormModal';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import { Colors } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import FloatingActionButton from '../../components/FloatingActionButton';
import { CURRENCIES } from '../../constants/data';
import { useExchangeRates } from '../../hooks/useExchangeRates';
import { convertCurrency } from '../../utils/currencyConverter';

export default function App() {
  const { expenses, addExpense, updateExpense, deleteExpense } = useExpenses();
  const { rates, loading: ratesLoading, error: ratesError } = useExchangeRates();
  const [filterCategory, setFilterCategory] = useState('All');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const insets = useSafeAreaInsets();

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [isIncomeModal, setIsIncomeModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Delete State
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Convert all expenses to selected currency and calculate total
  const totalAmount = expenses.reduce((sum, item) => {
    const amount = parseFloat(item.amount);

    // Convert to selected currency if rates are available
    const convertedAmount = rates
      ? convertCurrency(amount, item.currency, selectedCurrency, rates)
      : (item.currency === selectedCurrency ? amount : 0);

    return item.type === 'income' ? sum + convertedAmount : sum - convertedAmount;
  }, 0).toFixed(2);

  const filteredExpenses = filterCategory === 'All'
    ? expenses
    : expenses.filter(item => item.category === filterCategory);

  // --- HANDLERS ---
  const handleOpenAddExpense = () => {
    setEditingItem(null);
    setIsIncomeModal(false);
    setModalVisible(true);
  };

  const handleOpenAddIncome = () => {
    setEditingItem(null);
    setIsIncomeModal(true);
    setModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      deleteExpense(itemToDelete);
      setDeleteModalVisible(false);
      setItemToDelete(null);
    }
  };

  const handleSubmitForm = (data) => {
    if (editingItem) {
      updateExpense(editingItem.id, data);
    } else {
      const newItem = {
        id: Date.now().toString(),
        ...data,
      };
      addExpense(newItem);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        {/* Toggle handled by Drawer Navigator, but we can add a custom menu icon if needed 
            Usually Drawer provides the hamburger menu. */}
        <Text style={styles.totalLabel}>Total Balance</Text>

        {/* Total with clickable currency code */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalAmount}>$ {totalAmount} </Text>
          <TouchableOpacity
            style={styles.currencyCodeButton}
            onPress={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
          >
            <Text style={styles.currencyCode}>{selectedCurrency}</Text>
            <Ionicons name="chevron-down" size={20} color={Colors.text} style={{ marginLeft: 4 }} />
          </TouchableOpacity>

          {showCurrencyDropdown && (
            <View style={styles.currencyDropdown}>
              <ScrollView style={styles.currencyList} nestedScrollEnabled={true}>
                {CURRENCIES.map((curr) => (
                  <TouchableOpacity
                    key={curr.code}
                    style={styles.currencyItem}
                    onPress={() => {
                      setSelectedCurrency(curr.code);
                      setShowCurrencyDropdown(false);
                    }}
                  >
                    <Text style={styles.currencyItemText}>{curr.code}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </View>

      {/* FLOATING ACTION BUTTON */}
      <FloatingActionButton
        onAddExpense={handleOpenAddExpense}
        onAddIncome={handleOpenAddIncome}
      />

      {/* MODALS */}
      <ExpenseFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmitForm}
        initialData={editingItem}
        isIncome={isIncomeModal}
      />

      <DeleteConfirmationModal
        visible={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={handleConfirmDelete}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 10,
    backgroundColor: Colors.background,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  totalLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    position: 'relative',
    zIndex: 1000,
  },
  currencyCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyCode: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    marginLeft: 8,
  },
  currencyDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 4,
    backgroundColor: Colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    maxHeight: 200,
    elevation: 5,
    zIndex: 1001,
  },
  currencyList: {
    maxHeight: 200,
  },
  currencyItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  currencyItemText: {
    fontSize: 14,
    color: Colors.text,
  },
});
