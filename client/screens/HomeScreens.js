import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Button, ActivityIndicator } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const [saldo, setSaldo] = useState(10000);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false); 

  const navigation = useNavigation();

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setModalVisible(false);

    try {
      const qrData = JSON.parse(data);
      console.log("Datos del QR escaneado:", qrData);

      if (qrData.monto && qrData.transaccionId) {
        navigation.navigate('PaymentScreen', {
          monto: qrData.monto,
          transaccionId: qrData.transaccionId,
          saldo: saldo,
          setSaldo: setSaldo,
          transactions: transactions,
          setTransactions: setTransactions,
        });
      } else {
        console.error("Datos del QR no contienen los campos requeridos.");
      }
    } catch (error) {
      console.error("Error al parsear los datos del QR:", error);
    }
  };

  const handleScanPress = async () => {
    setLoading(true); 

    try {

      const response = await fetch('http://192.168.1.3:3000/generate-qr');
      const data = await response.json();
      console.log('Datos recibidos del servidor:', data);

      setLoading(false);
      setModalVisible(true);

    } catch (error) {
      console.error("Error en la petición GET:", error);
      setLoading(false);
    }
  };

  const renderTransaction = ({ item }) => (
    <View style={styles.transaction}>
      <Text style={styles.transactionText}>
        {item.type}: ${item.amount} - {item.date}
      </Text>
    </View>
  );

  if (hasPermission === null) {
    return <Text>Solicitando permiso para la cámara...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No se ha concedido acceso a la cámara</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.saldo}>Saldo Actual: ${saldo}</Text>

      <Text style={styles.historyTitle}>Historial de Transacciones</Text>
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        style={styles.transactionList}
      />

      <TouchableOpacity
        style={styles.scanButton}
        onPress={handleScanPress} 
      >
        <Text style={styles.scanButtonText}>Escanear Código QR</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#007bff" />} 


      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          {scanned && (
            <Button title="Escanear otro código" onPress={() => setScanned(false)} />
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  saldo: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  historyTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  transactionList: { marginBottom: 20 },
  transaction: { backgroundColor: '#f9f9f9', padding: 10, marginVertical: 5, borderRadius: 5 },
  transactionText: { fontSize: 16 },
  scanButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  scanButtonText: { color: '#fff', fontSize: 18 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
});

export default HomeScreen;
