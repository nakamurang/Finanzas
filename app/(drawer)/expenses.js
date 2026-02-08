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
import FloatingActionButton from '../../components/FloatingActionButton';

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
      // Helper to parse DD/MM/YYYY and HH:mm into a Date object
      const parseDateTime = (item) => {
        if (!item.date || !item.time) return new Date(Number(item.id));
        const [day, month, year] = item.date.split('/');
        const [hours, minutes] = item.time.split(':');
        return new Date(year, month - 1, day, hours, minutes);
      };

      // Sort by parsed date descending
      const sorted = [...expenses].sort((a, b) => {
        const dateA = parseDateTime(a);
        const dateB = parseDateTime(b);
        return dateB - dateA;
      });

      const grouped = sorted.reduce((acc, expense) => {
        const expenseDate = parseDateTime(expense);
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
});