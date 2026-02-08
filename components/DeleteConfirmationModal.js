import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';

export default function DeleteConfirmationModal({ visible, onCancel, onConfirm }) {
    return (
        <Modal visible={visible} transparent={true} animationType="fade">
            <View style={styles.deleteModalOverlay}>
                <View style={styles.deleteModalContainer}>
                    <Text style={styles.deleteModalTitle}>Delete Item?</Text>
                    <Text style={styles.deleteModalText}>Are you sure you want to delete this? This action cannot be undone.</Text>

                    <View style={styles.deleteModalButtons}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton, { marginRight: 10 }]}
                            onPress={onCancel}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.deleteConfirmButton]}
                            onPress={onConfirm}
                        >
                            <Text style={[styles.buttonText, styles.deleteButtonText]}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    deleteModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    deleteModalContainer: {
        backgroundColor: Colors.surface,
        borderRadius: 12,
        padding: 24,
        width: '100%',
        maxWidth: 340,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    deleteModalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 12,
    },
    deleteModalText: {
        fontSize: 16,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 24,
    },
    deleteModalButtons: {
        flexDirection: 'row',
        width: '100%',
    },
    button: {
        backgroundColor: Colors.primary,
        borderWidth: 1,
        borderColor: '#555',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: Colors.surface,
        borderColor: '#555',
        flex: 1,
    },
    deleteConfirmButton: {
        backgroundColor: Colors.delete,
        borderColor: Colors.delete,
        flex: 1,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    deleteButtonText: {
        color: '#000',
    },
});
