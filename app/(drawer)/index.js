import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  StatusBar,
  ScrollView,
  Platform
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useExpenses } from '../../hooks/useExpenses';
import ExpenseItem from '../../components/ExpenseItem';
import ExpenseFormModal from '../../components/ExpenseFormModal';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import { Colors } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import FloatingActionButton from '../../components/FloatingActionButton';

const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Bills', 'Other'];

export default function App() {
  const { expenses, addExpense, updateExpense, deleteExpense } = useExpenses();
  const [filterCategory, setFilterCategory] = useState('All');
  const insets = useSafeAreaInsets();

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [isIncomeModal, setIsIncomeModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Delete State
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const totalAmount = expenses.reduce((sum, item) => {
    const val = parseFloat(item.amount);
    return item.type === 'income' ? sum + val : sum - val;
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

  const handleEditItem = (item) => {
    setEditingItem(item);
    setIsIncomeModal(item.type === 'income');
    setModalVisible(true);
  };

  const handleDeleteRequest = (id) => {
    setItemToDelete(id);
    setDeleteModalVisible(true);
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
      const now = new Date();
      const newItem = {
        id: Date.now().toString(),
        ...data,
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
        <Text style={styles.totalText}>${totalAmount}</Text>
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
  totalText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 5,
  },
});
