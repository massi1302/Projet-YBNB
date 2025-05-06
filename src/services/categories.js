// Mock categories data
const categories = [
  { id: 1, name: 'Countryside', icon: 'fas fa-tree' },
  { id: 2, name: 'Icons', icon: 'fas fa-landmark' },
  { id: 3, name: 'Treehouses', icon: 'fas fa-home' },
  { id: 4, name: 'Amazing pools', icon: 'fas fa-swimming-pool' },
  { id: 5, name: 'A-frames', icon: 'fas fa-campground' },
  { id: 6, name: 'Lakefront', icon: 'fas fa-water' },
  { id: 7, name: 'Ski-in/out', icon: 'fas fa-skiing' },
  { id: 8, name: 'Mansions', icon: 'fas fa-building' },
  { id: 9, name: 'OMG!', icon: 'fas fa-exclamation-circle' },
  { id: 10, name: 'Cabins', icon: 'fas fa-home' },
  { id: 11, name: 'Domes', icon: 'fas fa-igloo' },
  { id: 12, name: 'Beachfront', icon: 'fas fa-umbrella-beach' },
  { id: 13, name: 'Amazing views', icon: 'fas fa-mountain' },
  { id: 14, name: 'Tiny homes', icon: 'fas fa-home' },
  { id: 15, name: 'Castles', icon: 'fas fa-chess-rook' },
  { id: 16, name: 'Farms', icon: 'fas fa-tractor' },
  { id: 17, name: 'Off-the-grid', icon: 'fas fa-compass' }
];

export function getCategories() {
  return Promise.resolve(categories);
}