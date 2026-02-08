import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

export default function ExpenseItem({ item, onPress, onDelete }) {
    return (
        <TouchableOpacity onPress={() => onPress(item)}>
            <View style={styles.expenseItem}>
                <View>
                    <Text style={styles.expenseDescription}>{item.description}</Text>
                    {item.place ? <Text style={styles.expenseSubtext}>@ {item.place}</Text> : null}
                    <Text style={styles.expenseSubtext}>{item.category} • {item.paymentMethod}</Text>
                    <Text style={styles.expenseDate}>{item.date} at {item.time}</Text>
                </View>
                <View style={styles.amountContainer}>
                    <Text style={styles.expenseAmount}>
                        {item.type === 'income' ? '+' : '-'}{item.currency} {item.amount}
                    </Text>
                    <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteButton}>
                        <Ionicons name="trash-outline" size={20} color={Colors.textSecondary} />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    expenseItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Colors.background, // Match background
        paddingVertical: 15,
        paddingHorizontal: 0, // Remove side padding if desired, or keep it
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    expenseDescription: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.text,
    },
    expenseSubtext: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    amountContainer: {
        alignItems: 'flex-end',
    },
    expenseDate: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginTop: 4,
    },
    expenseAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.text,
    },
    deleteButton: {
        padding: 5,
        marginTop: 4,
    },
});
