import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const PaymentScreen = ({ route }) => {
  const navigation = useNavigation();
  const { monto, transaccionId, saldo, setSaldo, transactions, setTransactions } = route.params;

  const confirmPayment = () => {

    if (saldo >= monto) {

      const nuevoSaldo = saldo - monto;
      setSaldo(nuevoSaldo);


      const nuevaTransaccion = {
        id: `${transactions.length + 1}`, 
        type: 'Pago',
        amount: monto,
        date: new Date().toISOString().split('T')[0],
        transaccionId: transaccionId,
      };
      setTransactions([...transactions, nuevaTransaccion]);


      Alert.alert("Pago Confirmado", `Has pagado $${monto}`);
      navigation.navigate('Home'); 

    } else {

      Alert.alert("Saldo insuficiente", `Tu saldo es de $${saldo}, pero el monto a pagar es de $${monto}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Monto a pagar: ${monto}</Text>
      <Text style={styles.text}>Tu saldo: ${saldo}</Text>
      <Button title="Confirmar Pago" onPress={confirmPayment} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, marginBottom: 20 },
});

export default PaymentScreen;
