// /pages/api/transactions.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = 'finance_tracker';

export default async function handler(req, res) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('transactions');

    if (req.method === 'POST') {
      const { type, amount, description, email } = req.body;

      if (!type || !amount || !description || !email) {
        return res.status(400).json({ error: 'Missing data' });
      }

      const newTransaction = {
        type,
        amount,
        description,
        email,
        date: new Date(),
      };

      await collection.insertOne(newTransaction);
      return res.status(201).json({ message: 'Transaction added', data: newTransaction });
    }

    if (req.method === 'GET') {
      const email = req.query.email;

      if (!email) {
        return res.status(400).json({ error: 'Missing email in query' });
      }

      const transactions = await collection
        .find({ email })
        .sort({ date: -1 })
        .toArray();

      return res.status(200).json(transactions);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Server error' });
  } finally {
    await client.close();
  }
}
