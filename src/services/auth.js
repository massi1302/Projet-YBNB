// Simple authentication service
let currentUser = null;

export function getCurrentUser() {
  return currentUser;
}

export function setCurrentUser(user) {
  currentUser = user;
}

export function logout() {
  currentUser = null;
  localStorage.removeItem('user');
}