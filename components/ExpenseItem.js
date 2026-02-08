import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

const getCategoryIcon = (category) => {
    switch (category) {
        case 'Food': return 'fast-food-outline';
        case 'Transport': return 'bus-outline';
        case 'Car': return 'car-outline';
        case 'Health': return 'medical-outline';
        case 'Household': return 'home-outline';
        case 'Clothes': return 'shirt-outline';
        case 'Education': return 'school-outline';
        case 'Bills': return 'receipt-outline';
        case 'Technology': return 'laptop-outline';
        case 'Pets': return 'paw-outline';
        case 'Beauty': return 'cut-outline';
        case 'Gifts': return 'gift-outline';
        case 'Salary': return 'cash-outline';
        case 'Freelance': return 'briefcase-outline';
        case 'Investment': return 'trending-up-outline';
        case 'Gift': return 'gift-outline';
        case 'Bonus': return 'star-outline';
        case 'Refund': return 'return-down-back-outline';
        case 'Other': return 'apps-outline';
        default: return 'help-circle-outline';
    }
};

export default function ExpenseItem({ item, onPress, onDelete }) {
    const iconName = getCategoryIcon(item.category);

    return (
        <TouchableOpacity activeOpacity={0.7} onPress={() => onPress(item)}>
            <View style={styles.container}>
                <View style={styles.leftSection}>
                    <View style={styles.iconContainer}>
                        <Ionicons name={iconName} size={24} color={Colors.text} />
                    </View>
                    <View style={styles.detailsContainer}>
                        <Text style={styles.description} numberOfLines={1}>{item.description}</Text>
                        <Text style={styles.subtext}>
                            {item.category}{item.subcategory && item.subcategory !== 'Other' ? ` (${item.subcategory})` : ''}{item.place ? ` • ${item.place}` : ''}
                        </Text>
                        <Text style={styles.dateSubtext}>{item.date} • {item.time}</Text>
                    </View>
                </View>

                <View style={styles.rightSection}>
                    <Text style={[styles.amount, { color: item.type === 'income' ? '#4CAF50' : Colors.text }]}>
                        {item.type === 'income' ? '+' : '-'} {item.amount} {item.currency}
                    </Text>
                    <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteButton}>
                        <Ionicons name="trash-outline" size={18} color={Colors.textSecondary} />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.inputBackground,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    detailsContainer: {
        flex: 1,
    },
    description: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 2,
    },
    subtext: {
        fontSize: 13,
        color: Colors.textSecondary,
    },
    dateSubtext: {
        fontSize: 11,
        color: Colors.textSecondary,
        marginTop: 2,
        opacity: 0.7,
    },
    rightSection: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: 48,
    },
    amount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    deleteButton: {
        padding: 4,
    },
});
