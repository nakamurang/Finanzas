import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  SafeAreaView,
  StatusBar,
  Modal,
  ScrollView
} from 'react-native';

const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Bills', 'Other'];
const PAYMENT_METHODS = ['Cash', 'Credit Card', 'Debit Card', 'Transfer'];
const CURRENCIES = ['USD', 'EUR', 'ARS'];

export default function App() {
  // --- STATE MANAGEMENT ---
  // 1. 'expenses' stores our list of data. 'setExpenses' is the function to update it.
  const [expenses, setExpenses] = useState([]);
  
  // 2. These store the text currently being typed in the input boxes.
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Other');
  const [place, setPlace] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  // 3. Controls whether the "Add Expense" popup is visible
  const [modalVisible, setModalVisible] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');

  // --- EFFECTS ---
  // useEffect runs code when the app loads (because of the empty array [] at the end)
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

  // --- LOGIC ---
  const handleAddExpense = () => {
    if (!description || !amount) return; // Don't add if empty

    const now = new Date();
    const newExpense = {
      id: Date.now().toString(), // Unique ID for React to track items
      description: description,
      amount: parseFloat(amount).toFixed(2), // Ensure it looks like money
      category: category,
      place: place,
      currency: currency,
      paymentMethod: paymentMethod,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Create the new list
    const updatedExpenses = [newExpense, ...expenses];
    
    setExpenses(updatedExpenses); // Update screen
    saveExpenses(updatedExpenses); // Save to storage
    setModalVisible(false); // Close the popup

    // Clear the inputs
    setDescription('');
    setAmount('');
    setCategory('Other');
    setShowDropdown(false);
    setPlace('');
    setCurrency('USD');
    setPaymentMethod('Cash');
    setShowPaymentDropdown(false);
  };

  const handleDeleteExpense = (id) => {
    const updatedExpenses = expenses.filter((item) => item.id !== id);
    setExpenses(updatedExpenses);
    saveExpenses(updatedExpenses);
  };

  // Calculate total amount from the expenses array
  const totalAmount = expenses.reduce((sum, item) => sum + parseFloat(item.amount), 0).toFixed(2);

  // Filter expenses based on selection
  const filteredExpenses = filterCategory === 'All' 
    ? expenses 
    : expenses.filter(item => item.category === filterCategory);

  // --- UI RENDERING ---
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Expense Tracker</Text>
        <Text style={styles.totalText}>Total: ${totalAmount}</Text>
      </View>

      {/* BUTTON TO OPEN MODAL */}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Add New Expense</Text>
      </TouchableOpacity>

      {/* MODAL (POPUP) */}
      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          <View style={styles.inputContainer}>
            <Text style={styles.modalTitle}>New Expense</Text>
            <TextInput
              style={styles.input}
              placeholder="What did you buy?"
              placeholderTextColor="#888"
              value={description}
              onChangeText={(text) => setDescription(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Amount ($)"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={amount}
              onChangeText={(text) => setAmount(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Place / Location"
              placeholderTextColor="#888"
              value={place}
              onChangeText={(text) => setPlace(text)}
            />
            
            <Text style={styles.inputLabel}>Select Category:</Text>
            
            <View style={[styles.dropdownWrapper, { zIndex: 2000 }]}>
              <TouchableOpacity 
                style={styles.dropdownSelector} 
                onPress={() => setShowDropdown(!showDropdown)}
              >
                <Text style={styles.dropdownText}>{category}</Text>
                <Text style={{ fontSize: 12, color: '#FFF' }}>▼</Text>
              </TouchableOpacity>

              {showDropdown && (
                <View style={styles.dropdownList}>
                  {CATEGORIES.map((cat) => (
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

            <Text style={styles.inputLabel}>Payment Method:</Text>
            <View style={[styles.dropdownWrapper, { zIndex: 1000 }]}>
              <TouchableOpacity 
                style={styles.dropdownSelector} 
                onPress={() => setShowPaymentDropdown(!showPaymentDropdown)}
              >
                <Text style={styles.dropdownText}>{paymentMethod}</Text>
                <Text style={{ fontSize: 12, color: '#FFF' }}>▼</Text>
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
            <View style={styles.currencyContainer}>
              {CURRENCIES.map((curr) => (
                <TouchableOpacity 
                  key={curr} 
                  style={[styles.filterChip, currency === curr && styles.filterChipActive]}
                  onPress={() => setCurrency(curr)}
                >
                  <Text style={[styles.filterText, currency === curr && styles.filterTextActive]}>{curr}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, { flex: 1 }]} onPress={handleAddExpense}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* LIST SECTION */}
      <View style={styles.listContainer}>
        <Text style={styles.subtitle}>Recent Expenses</Text>
        
        {/* FILTER SECTION */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['All', ...CATEGORIES].map((cat) => (
              <TouchableOpacity 
                key={cat} 
                style={[styles.filterChip, filterCategory === cat && styles.filterChipActive]}
                onPress={() => setFilterCategory(cat)}
              >
                <Text style={[styles.filterText, filterCategory === cat && styles.filterTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* FlatList is the standard way to render lists in React Native */}
        <FlatList
          data={filteredExpenses}
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
                <TouchableOpacity onPress={() => handleDeleteExpense(item.id)}>
                  <Text style={styles.deleteButton}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No expenses yet. Add one above!</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

// --- STYLES ---
// React Native uses a subset of CSS called Flexbox
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
  totalText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 8,
  },
  addButton: {
    backgroundColor: '#333333',
    borderWidth: 1,
    borderColor: '#555',
    padding: 15,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center', // Center vertically
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  inputContainer: {
    padding: 20,
    backgroundColor: '#1E1E1E',
    margin: 16,
    borderRadius: 10,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#2C2C2C',
    color: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    color: '#AAAAAA',
  },
  dropdownWrapper: {
    marginBottom: 15,
    position: 'relative',
  },
  dropdownSelector: {
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#2C2C2C',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    backgroundColor: '#2C2C2C',
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
    color: '#FFFFFF',
  },
  currencyContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  button: {
    backgroundColor: '#333333',
    borderWidth: 1,
    borderColor: '#555',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10, // Space between buttons
  },
  cancelButton: {
    backgroundColor: '#ff3b30',
    flex: 1,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#AAAAAA',
  },
  filterContainer: {
    marginBottom: 15,
    height: 40,
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
  expenseItem: {
    flexDirection: 'row', // Align items side by side
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
  },
  deleteButton: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 4,
  },
  expenseDate: {
    fontSize: 12,
    color: '#AAAAAA',
    marginTop: 4,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF453A', // Red color for money spent
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontStyle: 'italic',
  },
});
