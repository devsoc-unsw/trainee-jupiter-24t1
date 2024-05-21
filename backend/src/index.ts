import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import express, { Request, Response, NextFunction } from 'express';

import { Restaurant } from './recommendation/data';
import { cosineSimilarity } from './recommendation/cosineSimilarity';
import { readCSV } from './recommendation/data';

import { InputError, AccessError } from './error';
import swaggerDocument from '../swagger.json';
import {
  getEmailFromAuthorization,
  login,
  logout,
  register,
  save,
  assertOwnsListing,
  assertOwnsBooking,
  addListing,
  getListingDetails,
  getAllListings,
  updateListing,
  removeListing,
  publishListing,
  unpublishListing,
  leaveListingReview,
  makeNewBooking,
  getAllBookings,
  removeBooking,
  acceptBooking,
  declineBooking,
} from './service';
import path from 'path';

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(morgan(':method :url :status'));

type HandlerFunction = (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;

const catchErrors = (fn: HandlerFunction) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(`Authorization header is ${req.header('Authorization')}`);
    if (req.method === 'GET') {
      console.log(`Query params are ${JSON.stringify(req.params)}`);
    } else {
      console.log(`Body params are ${JSON.stringify(req.body)}`);
    }
    const result = await fn(req, res, next);
    if (result) {
      return result;
    }
    save();
  } catch (err) {
    if (err instanceof InputError) {
      res.status(400).send({ error: err.message });
    } else if (err instanceof AccessError) {
      res.status(403).send({ error: err.message });
    } else {
      console.log(err);
      res.status(500).send({ error: 'A system error occurred' });
    }
  }
};

/***************************************************************
                       User Auth Functions
***************************************************************/

const authed = (fn: (req: Request, res: Response, email: string) => Promise<Response | void>) => async (req: Request, res: Response, next: NextFunction) => {
  const email = getEmailFromAuthorization(req.header('Authorization') || '');
  const result = await fn(req, res, email);
  if (result) {
    return result;
  }
};

app.post(
  '/user/auth/login',
  catchErrors(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const token = await login(email, password);
    return res.json({ token });
  }),
);

app.post(
  '/user/auth/register',
  catchErrors(async (req: Request, res: Response) => {
    const { email, password, name } = req.body;
    const token = await register(email, password, name);
    return res.json({ token });
  }),
);

app.post(
  '/user/auth/logout',
  catchErrors(
    authed(async (req, res, email) => {
      await logout(email);
      return res.json({});
    }),
  ),
);

/***************************************************************
                       Listing Functions
***************************************************************/

app.get(
  '/listings',
  catchErrors(async (req, res) => {
    return res.json({ listings: await getAllListings() });
  }),
);

app.get(
  '/listings/:listingid',
  catchErrors(async (req, res) => {
    const { listingid } = req.params;
    return res.status(200).json({ listing: await getListingDetails(listingid) });
  }),
);

app.post(
  '/listings/new',
  catchErrors(
    authed(async (req, res, email) => {
      const { title, address, price, thumbnail, metadata } = req.body;
      return res.status(200).json({
        listingId: await addListing(title, email, address, price, thumbnail, metadata),
      });
    }),
  ),
);

app.put(
  '/listings/:listingid',
  catchErrors(
    authed(async (req, res, email) => {
      const { listingid } = req.params;
      const { title, address, thumbnail, price, metadata } = req.body;
      await assertOwnsListing(email, listingid);
      await updateListing(listingid, title, address, thumbnail, price, metadata);
      return res.status(200).send({});
    }),
  ),
);

app.delete(
  '/listings/:listingid',
  catchErrors(
    authed(async (req, res, email) => {
      const { listingid } = req.params;
      await assertOwnsListing(email, listingid);
      await removeListing(listingid);
      return res.status(200).send({});
    }),
  ),
);

app.put(
  '/listings/publish/:listingid',
  catchErrors(
    authed(async (req, res, email) => {
      const { listingid } = req.params;
      const { availability } = req.body;
      await assertOwnsListing(email, listingid);
      await publishListing(listingid, availability);
      return res.status(200).send({});
    }),
  ),
);

app.put(
  '/listings/unpublish/:listingid',
  catchErrors(
    authed(async (req, res, email) => {
      const { listingid } = req.params;
      await assertOwnsListing(email, listingid);
      await unpublishListing(listingid);
      return res.status(200).send({});
    }),
  ),
);

app.put(
  '/listings/:listingid/review/:bookingid',
  catchErrors(
    authed(async (req, res, email) => {
      const { listingid, bookingid } = req.params;
      const { review } = req.body;
      await leaveListingReview(email, listingid, bookingid, review);
      return res.status(200).send({});
    }),
  ),
);

/***************************************************************
                       Booking Functions
***************************************************************/

app.get(
  '/bookings',
  catchErrors(
    authed(async (req, res, email) => {
      return res.status(200).json({
        bookings: await getAllBookings(),
      });
    }),
  ),
);

app.delete(
  '/bookings/:bookingid',
  catchErrors(
    authed(async (req, res, email) => {
      const { bookingid } = req.params;
      await assertOwnsBooking(email, bookingid);
      await removeBooking(bookingid);
      return res.status(200).send({});
    }),
  ),
);

app.post(
  '/bookings/new/:listingid',
  catchErrors(
    authed(async (req, res, email) => {
      const { listingid } = req.params;
      const { dateRange, totalPrice } = req.body;
      return res.status(200).json({
        bookingId: await makeNewBooking(email, dateRange, totalPrice, listingid),
      });
    }),
  ),
);

app.put(
  '/bookings/accept/:bookingid',
  catchErrors(
    authed(async (req, res, email) => {
      const { bookingid } = req.params;
      await acceptBooking(email, bookingid);
      return res.status(200).json({});
    }),
  ),
);

app.put(
  '/bookings/decline/:bookingid',
  catchErrors(
    authed(async (req, res, email) => {
      const { bookingid } = req.params;
      await declineBooking(email, bookingid);
      return res.status(200).json({});
    }),
  ),
);

/***************************************************************
                       Recommendations
***************************************************************/
app.post('/recommend/restaurants', async (req, res) => {
  const { city, userInterests } = req.body;

  if (!city || !userInterests || !Array.isArray(userInterests)) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const csvFilePath = path.join(__dirname, '/recommendation/rest.csv');
    const restaurants: Restaurant[] = await readCSV(csvFilePath);

    // Filter restaurants by city
    const filteredRestaurants = restaurants.filter(rest => rest.city === city);

    // Create a combined vocabulary
    const vocabulary = Array.from(new Set(filteredRestaurants.flatMap(rest => rest.tokens).concat(userInterests)));

    // Function to vectorize tokens
    const vectorize = (tokens: string[]): number[] => {
      return vocabulary.map(token => tokens.includes(token) ? 1 : 0);
    };

    // Vectorize user interests
    const userVector = vectorize(userInterests);

    // Calculate similarity scores
    const recommendations = filteredRestaurants.map(rest => {
      const restVector = vectorize(rest.tokens);
      const similarity = cosineSimilarity(userVector, restVector);
      return { ...rest, similarity };
    });

    // Sort recommendations by similarity
    recommendations.sort((a, b) => b.similarity - a.similarity);

    // Get top 10 recommendations
    const topRecommendations = recommendations.slice(0, 10);

    res.json(topRecommendations);
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
});


/***************************************************************
                       Running Server
***************************************************************/

app.get('/', (req, res) => res.redirect('/docs'));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = 3000;

app.listen(port, () => {
  console.log(`Backend is now listening on port ${port}!`);
  console.log(`For API docs, navigate to http://localhost:${port}`);
});
