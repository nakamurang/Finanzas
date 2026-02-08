import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Modal,
    TouchableOpacity,
    TouchableWithoutFeedback,
    FlatList,
    Dimensions
} from 'react-native';
import { Colors } from '../constants/colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function BottomSheetPicker({
    visible,
    options,
    selectedValue,
    onSelect,
    onClose,
    title,
    renderOption
}) {
    const renderItem = ({ item }) => {
        const isSelected = item === selectedValue || item?.code === selectedValue;
        const displayText = item?.code ? `${item.code} - ${item.name}` : item;

        return (
            <TouchableOpacity
                style={[styles.option, isSelected && styles.optionSelected]}
                onPress={() => {
                    onSelect(item?.code || item);
                    onClose();
                }}
            >
                {renderOption ? (
                    renderOption(item, isSelected)
                ) : (
                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                        {displayText}
                    </Text>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.container}>
                            <View style={styles.header}>
                                <View style={styles.handle} />
                                {title && <Text style={styles.title}>{title}</Text>}
                            </View>

                            <FlatList
                                data={options}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => item?.code || item || index.toString()}
                                showsVerticalScrollIndicator={true}
                                contentContainerStyle={styles.listContent}
                            />

                            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: Colors.surface,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: SCREEN_HEIGHT * 0.6,
        paddingBottom: 20,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: Colors.textSecondary,
        borderRadius: 2,
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
    },
    listContent: {
        paddingHorizontal: 16,
    },
    option: {
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    optionSelected: {
        backgroundColor: Colors.primary + '20',
    },
    optionText: {
        fontSize: 16,
        color: Colors.text,
    },
    optionTextSelected: {
        color: Colors.primary,
        fontWeight: '600',
    },
    cancelButton: {
        marginTop: 12,
        marginHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: Colors.border,
        borderRadius: 10,
        alignItems: 'center',
    },
    cancelText: {
        fontSize: 16,
        color: Colors.text,
        fontWeight: '500',
    },
});
