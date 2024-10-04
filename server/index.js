const express = require('express');
const qrCode = require('qrcode-terminal')
const bodyParser = require('body-parser');
const QRCode = require('qrcode-terminal/vendor/QRCode');

const app = express();
const port = 3000;

const TRANSACTIONS = [
    { montoAPagar: 150.00, idTransaccion: 'TRX001' },
    { montoAPagar: 75.50, idTransaccion: 'TRX002' },
    { montoAPagar: 200.25, idTransaccion: 'TRX003' },
    { montoAPagar: 50.00, idTransaccion: 'TRX004' },
    { montoAPagar: 300.75, idTransaccion: 'TRX005' },
    { montoAPagar: 125.00, idTransaccion: 'TRX006' },
    { montoAPagar: 80.99, idTransaccion: 'TRX007' },
    { montoAPagar: 175.50, idTransaccion: 'TRX008' },
    { montoAPagar: 95.25, idTransaccion: 'TRX009' },
    { montoAPagar: 250.00, idTransaccion: 'TRX010' },
    { montoAPagar: 60.75, idTransaccion: 'TRX011' },
    { montoAPagar: 180.00, idTransaccion: 'TRX012' },
    { montoAPagar: 110.50, idTransaccion: 'TRX013' },
    { montoAPagar: 90.25, idTransaccion: 'TRX014' },
    { montoAPagar: 225.00, idTransaccion: 'TRX015' }
];


var dineroDisponible = 1000;


app.use(bodyParser.json());


app.get('/generate-qr', async (req, res) => {
    console.log('Generando código QR');

    const randomI = Math.floor(Math.random() * TRANSACTIONS.length); // Asegúrate de usar el tamaño del array
    try {
        const transaction = TRANSACTIONS[randomI];

        const qrData = {
            transaccionId: transaction.idTransaccion,
            monto: transaction.montoAPagar.toFixed(2)
        };
        
        // Genera el código QR con los datos del objeto serializado
        const qrCodeUrl = await qrCode.generate(JSON.stringify(qrData), { small: true });

    res.status(200).json({ qrData, qrCodeUrl }); // Devuelve tanto los datos como la URL
} catch (err) {
    console.error('Error al generar el código QR:', err);
    res.status(500).send('Error interno del servidor');
}
});





app.post('/process-payment', (req, res) => {
    const { transaccionId } = req.body;


    if (!transaccionId) {
        return res.status(400).send('Missing transaction ID');
    }

    console.log(`Pago procesado para la transacción: ${transaccionId}`);

    res.status(200).send(`Pago procesado para la transacción: ${transaccionId}`);
});


app.listen(port, () => {
    console.log('Servidor corriendo en el puerto ' + port);
});
