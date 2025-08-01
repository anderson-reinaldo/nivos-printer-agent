import express from 'express';
import { PrinterAgent } from './types';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/status', (req, res) => {
    res.send({ status: 'Printer Agent is running' });
});

// Initialize the printer agent
const printerAgent: PrinterAgent = {
    // Initialization logic here
};

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});