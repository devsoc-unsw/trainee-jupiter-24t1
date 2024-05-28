import { RestaurantListItemType } from "./types";

const RestaurantListItem: React.FC<RestaurantListItemType> = ({ 
  img, 
  restaurantName,
  restaurantAward,
  restaurantCountry,
  restaurantCity,
  restaurantRating,
  restaurantAddress,
  restaurantCuisines,
}) => {
  return (
    <div className='font-loto flex gap-12'>
      <div>
        <img className="size-80 rounded-2xl" src="https://media-cdn.tripadvisor.com/media/photo-m/1280/21/d9/b9/88/wu-xing-main-dining-area.jpg" alt={img} />
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <div className="bg-green-100 text-green-800 text-base font-medium me-2 px-2.5 py-0.5 rounded-lg dark:bg-green-900 dark:text-green-300">
            {restaurantAward}
          </div>
        </div>
        <div className="text-4xl font-bold">
          {restaurantName}
        </div>
        <div className="flex underline italic">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
          {restaurantCountry}, {restaurantCity}
        </div>
        <div className="text-base">
          {restaurantAddress}
        </div>
        <div>
          {restaurantRating}
        </div>
        <section>
          <div className="font-bold text-lg">Quick facts</div>
          <div className="flex gap-2 mt-2">
            {restaurantCuisines.map(cuisine => (
              <div key={cuisine} className="bg-zinc-200 rounded-full px-4 py-2">{cuisine ? cuisine : "Dining"}</div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default RestaurantListItem;
