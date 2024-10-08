import { z } from 'zod';
import type { NextApiRequest, NextApiResponse } from 'next';

const paramsSchema = z.object({
  from: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z$/,
      "The 'from' parameter must be in the format YYYY-MM-DDTHH:MMZ",
    ),
  to: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z$/,
      "The 'to' parameter must be in the format YYYY-MM-DDTHH:MMZ",
    ),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const result = paramsSchema.safeParse(req.query);

  if (!result.success) {
    return res.status(400).json({
      error: result.error.format(),
    });
  }

  const { from, to } = result.data;

  try {
    const apiUrl = `https://api.carbonintensity.org.uk/intensity/${from}/${to}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
