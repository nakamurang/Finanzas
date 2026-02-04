import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, SectionList, SafeAreaView, StatusBar } from 'react-native';

export default function ExpensesScreen() {
  const [expenses, setExpenses] = useState([]);

  // Reload data whenever the tab is focused (clicked)
  useFocusEffect(
    useCallback(() => {
      loadExpenses();
    }, [])
  );

  const loadExpenses = async () => {
    try {
      const storedExpenses = await AsyncStorage.getItem('expenses');
      if (storedExpenses) {
        const parsedExpenses = JSON.parse(storedExpenses);

        // Sort by ID (which is a timestamp) in descending order (Newest first)
        parsedExpenses.sort((a, b) => Number(b.id) - Number(a.id));

        const groupedExpenses = parsedExpenses.reduce((acc, expense) => {
          const expenseDate = new Date(Number(expense.id));
          const monthYear = expenseDate.toLocaleString('default', { month: 'long', year: 'numeric' });

          // Find the section for the current month/year
          let section = acc.find(s => s.title === monthYear);

          // If the section doesn't exist, create it
          if (!section) {
            section = { title: monthYear, data: [] };
            acc.push(section);
          }

          // Add the expense to the section's data
          section.data.push(expense);

          return acc;
        }, []);
        setExpenses(groupedExpenses);
      }
    } catch (e) {
      console.error('Failed to load expenses', e);
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
          sections={expenses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.expenseItem}>
              <View>
                <Text style={styles.expenseDescription}>{item.description}</Text>
                {item.place ? <Text style={styles.expenseSubtext}>@ {item.place}</Text> : null}
                <Text style={styles.expenseSubtext}>{item.category} • {item.paymentMethod}</Text>
                <Text style={styles.expenseDate}>{item.date} at {item.time}</Text>
              </View>
              <View style={styles.amountContainer}>
                <Text style={styles.expenseAmount}>{item.currency} {item.amount}</Text>
              </View>
            </View>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No expenses recorded yet.</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    padding: 20,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#AAAAAA',
    backgroundColor: '#121212',
    paddingVertical: 8,
    textTransform: 'uppercase',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  expenseSubtext: {
    fontSize: 12,
    color: '#AAAAAA',
    marginTop: 2,
  },
  amountContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  expenseDate: {
    fontSize: 12,
    color: '#AAAAAA',
    marginTop: 4,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF453A',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontStyle: 'italic',
  },
});