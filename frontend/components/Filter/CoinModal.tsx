import React from 'react';
import { View, Text, Image, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { MyCoin } from '../Trznica/trznica';
import { Icon } from 'react-native-elements';

interface CoinModalProps {
  visible: boolean;
  onClose?: () => void;
  coin?: MyCoin | null;
}

const CoinModal = ({ visible, onClose, coin }: CoinModalProps) => {
  if (!coin) {
    return null;
  }

  const date = new Date(coin.data.datum)

  const datePart = date.toISOString().split('T')[0];
  const timePart = date.toISOString().split('T')[1].split('.')[0];

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" type="material-community" color="orange" />
          </TouchableOpacity>

          <View style={styles.centeredContent}>
            <Image source={{ uri: coin.data.slika }} style={styles.coinImage} />
            <Text style={styles.titleText}>{coin.data.ime}</Text>
            <Text style={styles.titleText}>{coin.data.cena} €</Text>
            
            <View style={styles.tableContainer}>
            

              <View style={[styles.tableRow, styles.row1]}>
                <Text style={styles.attributeText}>Količina</Text>
                <Text style={styles.valueText}>{coin.data.kolicina}</Text>
              </View>

              <View style={[styles.tableRow, styles.row2]}>
                <Text style={styles.attributeText}>Opis</Text>
                <Text style={styles.valueText}>{coin.data.opis}</Text>
              </View>

              <View style={[styles.tableRow, styles.row1]}>
                <Text style={styles.attributeText}>Kontakt</Text>
                <Text style={styles.valueText}>{coin.data.telefonskaSt}</Text>
              </View>

              <View style={[styles.tableRow, styles.row2]}>
                <Text style={styles.attributeText}>Datum</Text>
                <Text style={styles.valueText}>{datePart}</Text>
              </View>

              <View style={[styles.tableRow, styles.row1]}>
                <Text style={styles.attributeText}>Avtor</Text>
                <Text style={styles.valueText}>{coin.data.imepriimek}</Text>
              </View>
              
            </View>

          </View>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 80,
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
  },
  centeredContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 15,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoContainer: {
    marginTop: 10,
  },
  infoText: {
    fontSize: 18,
    marginBottom: 8,
  },
  tableContainer: {
    marginTop: 10,
    width: '130%',

  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  headerRow: {
    backgroundColor: '#f2f2f2',
  },
  row1: {
    backgroundColor: '#ffffff',
  },
  row2: {
    backgroundColor: '#f9f9f9',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  attributeText: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  valueText: {
    fontSize: 16,
    flex: 2,
  },
});

export default CoinModal;
