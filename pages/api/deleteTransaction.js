import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = 'finance_tracker';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('transactions');

    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Missing ID' });

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      return res.status(200).json({ message: 'Deleted successfully' });
    } else {
      return res.status(404).json({ error: 'Transaction not found' });
    }
  } catch (err) {
    console.error('Delete error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
