// pages/api/proxy.ts
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const apiKey = 'c3010694273d404d852552d941572d06';
  const url = 'https://api.football-data.org/v4/competitions/WC/matches';

  if (method === 'GET') {
    try {
      const response = await axios.get(url, {
        headers: {
          'X-Auth-Token': apiKey,
        },
      });
      res.status(200).json(response.data);
    } catch (error: any) {
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
