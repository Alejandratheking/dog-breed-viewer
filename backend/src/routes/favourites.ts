import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { getFavourites, addFavourite, removeFavourite } from '../database.js';

const router = Router();

const addFavouriteSchema = z.object({
  imageUrl: z.string().url(),
  breed: z.string().min(1)
});

const removeFavouriteSchema = z.object({
  imageUrl: z.string().url()
});

router.get('/', (_req: Request, res: Response) => {
  try {
    const favourites = getFavourites();
    res.json(favourites);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch favourites' });
  }
});

router.post('/', (req: Request, res: Response) => {
  try {
    const { imageUrl, breed } = addFavouriteSchema.parse(req.body);
    addFavourite(imageUrl, breed);
    res.status(201).json({ message: 'Favourite added' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    res.status(500).json({ error: 'Failed to add favourite' });
  }
});

router.delete('/', (req: Request, res: Response) => {
  try {
    const { imageUrl } = removeFavouriteSchema.parse(req.body);
    const result = removeFavourite(imageUrl);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Favourite not found' });
    }
    res.json({ message: 'Favourite removed' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    res.status(500).json({ error: 'Failed to remove favourite' });
  }
});

export default router;