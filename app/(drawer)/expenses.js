import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, SectionList, StatusBar, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { useExpenses } from '../../hooks/useExpenses';
import ExpenseItem from '../../components/ExpenseItem';
import ExpenseFormModal from '../../components/ExpenseFormModal';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import { Colors } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

export default function ExpensesScreen() {
  const { expenses, addExpense, updateExpense, deleteExpense } = useExpenses();
  const [groupedExpenses, setGroupedExpenses] = useState([]);
  const insets = useSafeAreaInsets();

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [isIncomeModal, setIsIncomeModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Delete State
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Group expenses when the expenses list changes
  useFocusEffect(
    useCallback(() => {
      // Sort by ID (timestamp) descending
      const sorted = [...expenses].sort((a, b) => Number(b.id) - Number(a.id));

      const grouped = sorted.reduce((acc, expense) => {
        const expenseDate = new Date(Number(expense.id));
        const monthYear = expenseDate.toLocaleString('default', { month: 'long', year: 'numeric' });

        let section = acc.find(s => s.title === monthYear);
        if (!section) {
          section = { title: monthYear, data: [] };
          acc.push(section);
        }
        section.data.push(expense);
        return acc;
      }, []);

      setGroupedExpenses(grouped);
    }, [expenses])
  );

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
        <Text style={styles.title}>All Expenses</Text>
      </View>

      <View style={styles.listContainer}>
        <SectionList
          sections={groupedExpenses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ExpenseItem
              item={item}
              onPress={handleEditItem}
              onDelete={handleDeleteRequest}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No expenses recorded yet.</Text>
          }
          contentContainerStyle={{ paddingBottom: 100 }} // Space for floating buttons
        />
      </View>

      {/* FLOATING ACTION BUTTONS */}
      <View style={[styles.fabContainer, { bottom: 30 + insets.bottom }]}>
        <TouchableOpacity style={styles.fabButton} onPress={handleOpenAddIncome}>
          <Ionicons name="add" size={24} color="#000" />
          <Text style={styles.fabText}>Add Income</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.fabButton} onPress={handleOpenAddExpense}>
          <Ionicons name="add" size={24} color="#000" />
          <Text style={styles.fabText}>Add Expense</Text>
        </TouchableOpacity>
      </View>

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
    backgroundColor: Colors.background,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    backgroundColor: Colors.background,
    paddingVertical: 8,
    textTransform: 'uppercase',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontStyle: 'italic',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    left: 20, // Make it a bottom bar
    backgroundColor: Colors.primary,
    borderRadius: 30,
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    elevation: 5,
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
    }),
  },
  fabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fabText: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 16,
  },
});