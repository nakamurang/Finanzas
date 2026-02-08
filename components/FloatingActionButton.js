import React, { useState, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Animated,
    TouchableWithoutFeedback,
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';

export default function FloatingActionButton({ onAddExpense, onAddIncome }) {
    const [expanded, setExpanded] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;
    const insets = useSafeAreaInsets();

    const toggleMenu = () => {
        const toValue = expanded ? 0 : 1;

        Animated.spring(animation, {
            toValue,
            friction: 5,
            useNativeDriver: true,
        }).start();

        setExpanded(!expanded);
    };

    const handleAction = (callback) => {
        toggleMenu();
        callback();
    };

    const rotation = {
        transform: [
            {
                rotate: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '45deg'],
                }),
            },
        ],
    };

    const expenseStyle = {
        transform: [
            { scale: animation },
            {
                translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -70],
                }),
            },
        ],
    };

    const incomeStyle = {
        transform: [
            { scale: animation },
            {
                translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -130],
                }),
            },
        ],
    };

    return (
        <View style={[styles.container, { bottom: 20 + insets.bottom }]}>
            {expanded && (
                <TouchableWithoutFeedback onPress={toggleMenu}>
                    <View style={StyleSheet.absoluteFill} />
                </TouchableWithoutFeedback>
            )}

            <Animated.View style={[styles.button, styles.secondary, incomeStyle]}>
                <TouchableOpacity onPress={() => handleAction(onAddIncome)} style={styles.actionRow}>
                    <Text style={styles.label}>Add Income</Text>
                    <View style={[styles.iconContainer, styles.incomeIcon]}>
                        <Ionicons name="add" size={24} color="#000" />
                    </View>
                </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[styles.button, styles.secondary, expenseStyle]}>
                <TouchableOpacity onPress={() => handleAction(onAddExpense)} style={styles.actionRow}>
                    <Text style={styles.label}>Add Expense</Text>
                    <View style={[styles.iconContainer, styles.expenseIcon]}>
                        <Ionicons name="remove" size={24} color="#000" />
                    </View>
                </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity onPress={toggleMenu} activeOpacity={0.7} style={styles.mainButton}>
                <Animated.View style={rotation}>
                    <Ionicons name="add" size={32} color="#000" />
                </Animated.View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: 20,
        alignItems: 'flex-end',
    },
    mainButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    button: {
        position: 'absolute',
        width: 'auto',
        height: 'auto',
    },
    secondary: {
        // width: 48,
        // height: 48,
        // borderRadius: 24,
        // backgroundColor: Colors.surface,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 12,
    },
    label: {
        color: Colors.text,
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        overflow: 'hidden',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
    },
    incomeIcon: {
        backgroundColor: '#FFFFFF',
    },
    expenseIcon: {
        backgroundColor: Colors.primary,
    },
});
