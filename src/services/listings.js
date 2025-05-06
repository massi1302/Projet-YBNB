// Mock listings data with multiple images per listing
const listings = [
  // Countryside category
  {
    id: '1',
    title: 'Charming Farmhouse with Garden',
    type: 'house',
    category: 'Countryside',
    location: 'Loire Valley, France',
    images: [
      'https://images.pexels.com/photos/2132126/pexels-photo-2132126.jpeg',
      'https://images.pexels.com/photos/2132127/pexels-photo-2132127.jpeg',
      'https://images.pexels.com/photos/2132128/pexels-photo-2132128.jpeg',
      'https://images.pexels.com/photos/2132129/pexels-photo-2132129.jpeg'
    ],
    host: {
      name: 'Marie',
      type: 'Individual',
      superhost: true,
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
    },
    rating: 4.92,
    price: '€180',
    guests: 6,
    bedrooms: 3,
    beds: 4,
    baths: 2
  },
  {
    id: '2',
    title: 'Rustic Stone Cottage',
    type: 'cottage',
    category: 'Countryside',
    location: 'Burgundy, France',
    images: [
      'https://images.pexels.com/photos/2132130/pexels-photo-2132130.jpeg',
      'https://images.pexels.com/photos/2132131/pexels-photo-2132131.jpeg',
      'https://images.pexels.com/photos/2132132/pexels-photo-2132132.jpeg',
      'https://images.pexels.com/photos/2132133/pexels-photo-2132133.jpeg'
    ],
    host: {
      name: 'Pierre',
      type: 'Individual',
      superhost: false,
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
    },
    rating: 4.85,
    price: '€150',
    guests: 4,
    bedrooms: 2,
    beds: 2,
    baths: 1
  },

  // Icons category (Famous landmarks)
  {
    id: '3',
    title: 'Eiffel Tower View Apartment',
    type: 'apartment',
    category: 'Icons',
    location: 'Paris, France',
    images: [
      'https://images.pexels.com/photos/2132134/pexels-photo-2132134.jpeg',
      'https://images.pexels.com/photos/2132135/pexels-photo-2132135.jpeg',
      'https://images.pexels.com/photos/2132136/pexels-photo-2132136.jpeg',
      'https://images.pexels.com/photos/2132137/pexels-photo-2132137.jpeg'
    ],
    host: {
      name: 'Sophie',
      type: 'Professional',
      superhost: true,
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
    },
    rating: 4.95,
    price: '€350',
    guests: 4,
    bedrooms: 2,
    beds: 2,
    baths: 2
  },
  {
    id: '4',
    title: 'Historic Château Suite',
    type: 'castle',
    category: 'Icons',
    location: 'Versailles, France',
    images: [
      'https://images.pexels.com/photos/2132138/pexels-photo-2132138.jpeg',
      'https://images.pexels.com/photos/2132139/pexels-photo-2132139.jpeg',
      'https://images.pexels.com/photos/2132140/pexels-photo-2132140.jpeg',
      'https://images.pexels.com/photos/2132141/pexels-photo-2132141.jpeg'
    ],
    host: {
      name: 'Jean-Paul',
      type: 'Professional',
      superhost: true,
      avatar: 'https://randomuser.me/api/portraits/men/4.jpg'
    },
    rating: 4.98,
    price: '€500',
    guests: 2,
    bedrooms: 1,
    beds: 1,
    baths: 1
  },

  // Treehouses category
  {
    id: '5',
    title: 'Luxury Treehouse Retreat',
    type: 'treehouse',
    category: 'Treehouses',
    location: 'Fontainebleau, France',
    images: [
      'https://images.pexels.com/photos/2132142/pexels-photo-2132142.jpeg',
      'https://images.pexels.com/photos/2132143/pexels-photo-2132143.jpeg',
      'https://images.pexels.com/photos/2132144/pexels-photo-2132144.jpeg',
      'https://images.pexels.com/photos/2132145/pexels-photo-2132145.jpeg'
    ],
    host: {
      name: 'Claire',
      type: 'Individual',
      superhost: true,
      avatar: 'https://randomuser.me/api/portraits/women/5.jpg'
    },
    rating: 4.89,
    price: '€220',
    guests: 2,
    bedrooms: 1,
    beds: 1,
    baths: 1
  },
  {
    id: '6',
    title: 'Forest Canopy House',
    type: 'treehouse',
    category: 'Treehouses',
    location: 'Loire Valley, France',
    images: [
      'https://images.pexels.com/photos/2132146/pexels-photo-2132146.jpeg',
      'https://images.pexels.com/photos/2132147/pexels-photo-2132147.jpeg',
      'https://images.pexels.com/photos/2132148/pexels-photo-2132148.jpeg',
      'https://images.pexels.com/photos/2132149/pexels-photo-2132149.jpeg'
    ],
    host: {
      name: 'Antoine',
      type: 'Individual',
      superhost: false,
      avatar: 'https://randomuser.me/api/portraits/men/6.jpg'
    },
    rating: 4.87,
    price: '€190',
    guests: 4,
    bedrooms: 2,
    beds: 2,
    baths: 1
  },

  // Amazing pools category
  {
    id: '7',
    title: 'Mediterranean Villa with Infinity Pool',
    type: 'villa',
    category: 'Amazing pools',
    location: 'Nice, France',
    images: [
      'https://images.pexels.com/photos/2132150/pexels-photo-2132150.jpeg',
      'https://images.pexels.com/photos/2132151/pexels-photo-2132151.jpeg',
      'https://images.pexels.com/photos/2132152/pexels-photo-2132152.jpeg',
      'https://images.pexels.com/photos/2132153/pexels-photo-2132153.jpeg'
    ],
    host: {
      name: 'Isabelle',
      type: 'Professional',
      superhost: true,
      avatar: 'https://randomuser.me/api/portraits/women/7.jpg'
    },
    rating: 4.96,
    price: '€450',
    guests: 8,
    bedrooms: 4,
    beds: 5,
    baths: 3
  },
  {
    id: '8',
    title: 'Modern House with Heated Pool',
    type: 'house',
    category: 'Amazing pools',
    location: 'Cannes, France',
    images: [
      'https://images.pexels.com/photos/2132154/pexels-photo-2132154.jpeg',
      'https://images.pexels.com/photos/2132155/pexels-photo-2132155.jpeg',
      'https://images.pexels.com/photos/2132156/pexels-photo-2132156.jpeg',
      'https://images.pexels.com/photos/2132157/pexels-photo-2132157.jpeg'
    ],
    host: {
      name: 'Laurent',
      type: 'Professional',
      superhost: true,
      avatar: 'https://randomuser.me/api/portraits/men/8.jpg'
    },
    rating: 4.92,
    price: '€380',
    guests: 6,
    bedrooms: 3,
    beds: 3,
    baths: 2
  },

  // A-frames category
  {
    id: '9',
    title: 'Mountain A-Frame Chalet',
    type: 'chalet',
    category: 'A-frames',
    location: 'Chamonix, France',
    images: [
      'https://images.pexels.com/photos/2132158/pexels-photo-2132158.jpeg',
      'https://images.pexels.com/photos/2132159/pexels-photo-2132159.jpeg',
      'https://images.pexels.com/photos/2132160/pexels-photo-2132160.jpeg',
      'https://images.pexels.com/photos/2132161/pexels-photo-2132161.jpeg'
    ],
    host: {
      name: 'Michel',
      type: 'Individual',
      superhost: true,
      avatar: 'https://randomuser.me/api/portraits/men/9.jpg'
    },
    rating: 4.94,
    price: '€280',
    guests: 6,
    bedrooms: 3,
    beds: 4,
    baths: 2
  },
  {
    id: '10',
    title: 'Cozy A-Frame in the Woods',
    type: 'cabin',
    category: 'A-frames',
    location: 'Annecy, France',
    images: [
      'https://images.pexels.com/photos/2132162/pexels-photo-2132162.jpeg',
      'https://images.pexels.com/photos/2132163/pexels-photo-2132163.jpeg',
      'https://images.pexels.com/photos/2132164/pexels-photo-2132164.jpeg',
      'https://images.pexels.com/photos/2132165/pexels-photo-2132165.jpeg'
    ],
    host: {
      name: 'Anne',
      type: 'Individual',
      superhost: false,
      avatar: 'https://randomuser.me/api/portraits/women/10.jpg'
    },
    rating: 4.88,
    price: '€220',
    guests: 4,
    bedrooms: 2,
    beds: 2,
    baths: 1
  }
];

export function getListings() {
  return Promise.resolve(listings);
}

export function getListing(id) {
  const listing = listings.find(listing => listing.id === id);
  
  if (!listing) {
    return Promise.reject(new Error('Listing not found'));
  }
  
  return Promise.resolve(listing);
}

export function getListingsByCategory(category) {
  const filteredListings = listings.filter(listing => listing.category === category);
  return Promise.resolve(filteredListings);
}