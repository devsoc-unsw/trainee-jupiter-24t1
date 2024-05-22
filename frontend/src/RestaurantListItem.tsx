interface RestaurantListItemType {
  img: string, 
  restaurantName: string, 
  restaurantAward: string,
  restaurantCountry: string,
  restaurantCity: string,
  restaurantRating: string,
  restaurantAddress: string, 
}


const RestaurantListItem: React.FC<RestaurantListItemType> = ({ 
  img, 
  restaurantName,
  restaurantAward,
  restaurantCountry,
  restaurantCity,
  restaurantRating,
  restaurantAddress,
}) => {
  return (
    <div className='flex'>
      <div>
        <img className="size-48 rounded-2xl" src="https://media-cdn.tripadvisor.com/media/photo-m/1280/21/d9/b9/88/wu-xing-main-dining-area.jpg" alt={img} />
      </div>
      <div>
        <div>
          <div className="bg-green-100 text-green-800 text-base font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
            {restaurantAward}
          </div>
        </div>
        <div className="text-xl font-bold">
          {restaurantName}
        </div>
        <div>
          {restaurantRating}
        </div>
        <div>
          {restaurantCountry}, {restaurantCity}
        </div>
        <div className="text-base">
          {restaurantAddress}
        </div>
      </div>
    </div>
  )
}

export default RestaurantListItem;
