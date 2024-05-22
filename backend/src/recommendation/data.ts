import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

export interface Restaurant {
  restaurant_name: string;
  country: string;
  city: string;
  address: string;
  popularity_detailed: string;
  cuisines: string;
  avg_rating: string;
  tokens: string[];
}

export function readCSV(filePath: string): Promise<Restaurant[]> {
  return new Promise((resolve, reject) => {
    const results: Restaurant[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        const tokens = [
          ...data.top_tags.split(',').map((token: string) => token.trim()),
          ...data.features.split(',').map((token: string) => token.trim()),
          ...data.keywords.split(',').map((token: string) => token.trim())
        ].filter(token => token.length > 0);
        
        results.push({ 
          restaurant_name: data.restaurant_name,
          country: data.country,
          city: data.city, 
          address: data.address,
          popularity_detailed: data.popularity_detailed,
          cuisines: data.cuisines,
          avg_rating: data.avg_rating,
          tokens,
        });
      })
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}
