import fs from 'fs';
import jwt from 'jsonwebtoken';
import AsyncLock from 'async-lock';
import { InputError, AccessError } from './error';

interface User {
  name: string;
  password: string;
  sessionActive: boolean;
}

interface Listing {
  title: string;
  owner: string;
  address: string;
  price: number;
  thumbnail: string;
  metadata: any;
  reviews: string[];
  availability: any[];
  published: boolean;
  postedOn: string | null;
}

interface Booking {
  owner: string;
  dateRange: any;
  totalPrice: number;
  listingId: string;
  status: 'pending' | 'accepted' | 'declined';
}

const lock = new AsyncLock();

const JWT_SECRET = 'giraffegiraffebeetroot';
const DATABASE_FILE = './database.json';

/***************************************************************
                       State Management
***************************************************************/

let users: Record<string, User> = {};
let listings: Record<string, Listing> = {};
let bookings: Record<string, Booking> = {};

const update = (users: Record<string, User>, listings: Record<string, Listing>, bookings: Record<string, Booking>): Promise<void> =>
  new Promise<void>((resolve, reject) => {
    lock.acquire('saveData', () => {
      try {
        fs.writeFileSync(
          DATABASE_FILE,
          JSON.stringify(
            {
              users,
              listings,
              bookings,
            },
            null,
            2,
          ),
        );
        resolve();
      } catch {
        reject(new Error('Writing to database failed'));
      }
    });
  });

export const save = (): Promise<void> => update(users, listings, bookings);
export const reset = (): void => {
  update({}, {}, {});
  users = {};
  listings = {};
  bookings = {};
};

try {
  const data = JSON.parse(fs.readFileSync(DATABASE_FILE, 'utf-8'));
  users = data.users;
  listings = data.listings;
  bookings = data.bookings;
} catch {
  console.log('WARNING: No database found, create a new one');
  save();
}

/***************************************************************
                       Helper Functions
***************************************************************/

const newListingId = (_: any) => generateId(Object.keys(listings));
const newBookingId = (_: any) => generateId(Object.keys(bookings));

export const resourceLock = <T>(
  callback: (
    resolve: (value: T | PromiseLike<T>) => void,
    reject: (reason: any) => void
  ) => void
): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    lock.acquire('resourceLock', () => callback(resolve, reject));
  });
};

const randNum = (max: number): number => Math.round(Math.random() * (max - Math.floor(max / 10)) + Math.floor(max / 10));
const generateId = (currentList: string[], max = 999999999): string => {
  let R = randNum(max);
  while (currentList.includes(R.toString())) {
    R = randNum(max);
  }
  return R.toString();
};

/***************************************************************
                       Auth Functions
***************************************************************/

export const getEmailFromAuthorization = (authorization: string): string => {
  try {
    const token = authorization.replace('Bearer ', '');
    const { email } = jwt.verify(token, JWT_SECRET) as { email: string };
    if (!(email in users)) {
      throw new AccessError('Invalid Token');
    }
    return email;
  } catch {
    throw new AccessError('Invalid Token');
  }
};

export const login = (email: string, password: string): Promise<string> =>
  resourceLock((resolve, reject) => {
    if (!email) {
      return reject(new InputError('Must provide an email for user login'));
    } else if (!password) {
      return reject(new InputError('Must provide a password for user login'));
    } else if (email && email in users) {
      if (users[email].password === password) {
        users[email].sessionActive = true;
        resolve(jwt.sign({ email }, JWT_SECRET, { algorithm: 'HS256' }));
      }
    }
    save();
    return reject(new InputError('Invalid email or password'));
  });

export const logout = (email: string): Promise<void> =>
  resourceLock((resolve, reject) => {
    users[email].sessionActive = false;
    save();
    resolve();
  });

export const register = (email: string, password: string, name: string) =>
  resourceLock((resolve, reject) => {
    if (!email) {
      return reject(new InputError('Must provide an email for user registration'));
    } else if (!password) {
      return reject(new InputError('Must provide a password for user registration'));
    } else if (!name) {
      return reject(new InputError('Must provide a name for user registration'));
    } else if (email && email in users) {
      return reject(new InputError('Email address already registered'));
    } else {
      users[email] = {
        name,
        password,
        sessionActive: true,
      };
      save();
      const token = jwt.sign({ email }, JWT_SECRET, { algorithm: 'HS256' });
      resolve(token);
    }
  });

/***************************************************************
                       Listing Functions
***************************************************************/

const newListingPayload = (title: string, owner: string, address: string, price: number, thumbnail: string, metadata: any): Listing => ({
  title,
  owner,
  address,
  price,
  thumbnail,
  metadata,
  reviews: [],
  availability: [],
  published: false,
  postedOn: null,
});

export const assertOwnsListing = (email: string, listingId: string): Promise<void> =>
  resourceLock((resolve, reject) => {
    if (!(listingId in listings)) {
      return reject(new InputError('Invalid listing ID'));
    } else if (listings[listingId].owner !== email) {
      return reject(new InputError('User does not own this Listing'));
    } else {
      resolve();
    }
  });

export const assertOwnsBooking = (email: string, bookingId: string): Promise<void> =>
  resourceLock((resolve, reject) => {
    if (!(bookingId in bookings)) {
      return reject(new InputError('Invalid booking ID'));
    } else if (bookings[bookingId].owner !== email) {
      return reject(new InputError('User does not own this booking'));
    } else {
      resolve();
    }
  });

export const addListing = (title: string, email: string, address: string, price: number, thumbnail: string, metadata: any): Promise<string> =>
  resourceLock((resolve, reject) => {
    if (title === undefined) {
      return reject(new InputError('Must provide a title for new listing'));
    } else if (Object.keys(listings).find((key) => listings[key].title === title) !== undefined) {
      return reject(new InputError('A listing with this title already exists'));
    } else if (address === undefined) {
      return reject(new InputError('Must provide an address for new listing'));
    } else if (price === undefined || isNaN(price)) {
      return reject(new InputError('Must provide a valid price for new listing'));
    } else if (thumbnail === undefined) {
      return reject(new InputError('Must provide a thumbnail for new listing'));
    } else if (metadata === undefined) {
      return reject(new InputError('Must provide property details for this listing'));
    } else {
      const id = newListingId({});
      listings[id] = newListingPayload(title, email, address, price, thumbnail, metadata);
      save();
      resolve(id);
    }
  });

export const getListingDetails = (listingId: string): Promise<Listing> =>
  resourceLock((resolve, reject) => {
    resolve({
      ...listings[listingId],
    });
  });

export const getAllListings = (): Promise<{ id: number; title: string; owner: string; address: string; thumbnail: string; price: number; reviews: string[] }[]> =>
  resourceLock((resolve, reject) => {
    resolve(
      Object.keys(listings).map((key) => ({
        id: parseInt(key, 10),
        title: listings[key].title,
        owner: listings[key].owner,
        address: listings[key].address,
        thumbnail: listings[key].thumbnail,
        price: listings[key].price,
        reviews: listings[key].reviews,
      })),
    );
  });

export const updateListing = (listingId: string, title?: string, address?: string, thumbnail?: string, price?: number, metadata?: any): Promise<void> =>
  resourceLock((resolve, reject) => {
    if (address) {
      listings[listingId].address = address;
    }
    if (title) {
      listings[listingId].title = title;
    }
    if (thumbnail) {
      listings[listingId].thumbnail = thumbnail;
    }
    if (price) {
      listings[listingId].price = price;
    }
    if (metadata) {
      listings[listingId].metadata = metadata;
    }
    save();
    resolve();
  });

export const removeListing = (listingId: string): Promise<void> =>
  resourceLock((resolve, reject) => {
    delete listings[listingId];
    save();
    resolve();
  });

export const publishListing = (listingId: string, availability: any[]): Promise<void> =>
  resourceLock((resolve, reject) => {
    if (availability === undefined) {
      return reject(new InputError('Must provide listing availability'));
    } else if (listings[listingId].published === true) {
      return reject(new InputError('This listing is already published'));
    } else {
      listings[listingId].availability = availability;
      listings[listingId].published = true;
      listings[listingId].postedOn = new Date().toISOString();
      save();
      resolve();
    }
  });

export const unpublishListing = (listingId: string): Promise<void> =>
  resourceLock((resolve, reject) => {
    if (listings[listingId].published === false) {
      return reject(new InputError('This listing is already unpublished'));
    } else {
      listings[listingId].availability = [];
      listings[listingId].published = false;
      listings[listingId].postedOn = null;
      save();
      resolve();
    }
  });

export const leaveListingReview = (email: string, listingId: string, bookingId: string, review: string): Promise<void> =>
  resourceLock((resolve, reject) => {
    if (!(bookingId in bookings)) {
      return reject(new InputError('Invalid booking ID'));
    } else if (!(listingId in listings)) {
      return reject(new InputError('Invalid listing ID'));
    } else if (bookings[bookingId].owner !== email) {
      return reject(new InputError('User has not stayed at this listing'));
    } else if (bookings[bookingId].listingId !== listingId) {
      return reject(new InputError('This booking is not associated with this listing ID'));
    } else if (review === undefined) {
      return reject(new InputError('Must provide review contents'));
    } else {
      listings[listingId].reviews.push(review);
      save();
      resolve();
    }
  });

/***************************************************************
                       Booking Functions
***************************************************************/

const newBookingPayload = (owner: string, dateRange: any, totalPrice: number, listingId: string): Booking => ({
  owner,
  dateRange,
  totalPrice,
  listingId,
  status: 'pending',
});

export const makeNewBooking = (owner: string, dateRange: any, totalPrice: number, listingId: string): Promise<string> =>
  resourceLock((resolve, reject) => {
    if (!(listingId in listings)) {
      return reject(new InputError('Invalid listing ID'));
    } else if (dateRange === undefined) {
      return reject(new InputError('Must provide a valid date range for the booking'));
    } else if (totalPrice === undefined || totalPrice < 0 || isNaN(totalPrice)) {
      return reject(new InputError('Must provide a valid total price for this booking'));
    } else if (listings[listingId].owner === owner) {
      return reject(new InputError('Cannot make bookings for your own listings'));
    } else if (listings[listingId].published === false) {
      return reject(new InputError('Cannot make a booking for an unpublished listing'));
    } else {
      const id = newBookingId({});
      bookings[id] = newBookingPayload(owner, dateRange, totalPrice, listingId);
      save();
      resolve(id);
    }
  });

export const getAllBookings = (): Promise<{ id: number; owner: string; dateRange: any; totalPrice: number; listingId: string; status: 'pending' | 'accepted' | 'declined' }[]> =>
  resourceLock((resolve, reject) => {
    resolve(
      Object.keys(bookings).map((key) => ({
        id: parseInt(key, 10),
        owner: bookings[key].owner,
        dateRange: bookings[key].dateRange,
        totalPrice: bookings[key].totalPrice,
        listingId: bookings[key].listingId,
        status: bookings[key].status,
      })),
    );
  });

export const removeBooking = (bookingId: string): Promise<void> =>
  resourceLock((resolve, reject) => {
    delete bookings[bookingId];
    save();
    resolve();
  });

export const acceptBooking = (owner: string, bookingId: string): Promise<void> =>
  resourceLock((resolve, reject) => {
    if (!(bookingId in bookings)) {
      return reject(new InputError('Invalid booking ID'));
    } else if (
      Object.keys(listings).find((key) => key === bookings[bookingId].listingId && listings[key].owner === owner) ===
      undefined
    ) {
      return reject(new InputError("Cannot accept bookings for a listing that isn't yours"));
    } else if (bookings[bookingId].status === 'accepted') {
      return reject(new InputError('Booking has already been accepted'));
    } else if (bookings[bookingId].status === 'declined') {
      return reject(new InputError('Booking has already been declined'));
    } else {
      bookings[bookingId].status = 'accepted';
      save();
      resolve();
    }
  });

export const declineBooking = (owner: string, bookingId: string): Promise<void> =>
  resourceLock((resolve, reject) => {
    if (!(bookingId in bookings)) {
      return reject(new InputError('Invalid booking ID'));
    } else if (
      Object.keys(listings).find((key) => key === bookings[bookingId].listingId && listings[key].owner === owner) ===
      undefined
    ) {
      return reject(new InputError("Cannot accept bookings for a listing that isn't yours"));
    } else if (bookings[bookingId].status === 'declined') {
      return reject(new InputError('Booking has already been declined'));
    } else if (bookings[bookingId].status === 'accepted') {
      return reject(new InputError('Booking has already been accepted'));
    } else {
      bookings[bookingId].status = 'declined';
      save();
      resolve();
    }
  });
