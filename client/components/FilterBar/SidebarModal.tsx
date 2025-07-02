import React from 'react';
import {
  Modal,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
  Text,
  StyleSheet,
} from 'react-native';
import styles from '../../app/styles/filterMenuStyles';

type Props = {
  visible: boolean;
  onClose: () => void;
  onClear: () => void;
  onApply: () => void;
  children: React.ReactNode;
};

export default function SidebarModal({ visible, onClose, onClear, onApply, children }: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={modalStyles.overlay}>
        {/* אזור שמסביב למודאל – סוגר את המודאל בלחיצה */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={modalStyles.backdrop} />
        </TouchableWithoutFeedback>

        {/* אזור המודאל עצמו – חוסם לחיצות מלצאת */}
        <TouchableWithoutFeedback>
          <View style={modalStyles.modalContent}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 16 }}
            >
              {children}
            </ScrollView>

            <View style={modalStyles.buttonRow}>
              <TouchableOpacity onPress={onClear} style={styles.actionBtn}>
                <Text style={styles.btnText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onApply} style={styles.actionBtn}>
                <Text style={styles.btnText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: '60%',
    padding: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
});