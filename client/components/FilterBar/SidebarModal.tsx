import React from 'react';
import {
  Modal,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
  Text,
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
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
          <TouchableWithoutFeedback>
            <View style={{
              height: '50%',
              backgroundColor: '#fff',
              padding: 16,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}>
              <ScrollView>{children}</ScrollView>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
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
      </TouchableWithoutFeedback>
    </Modal>
  );
}
