import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_KEY_PREFIX = 'cart_';

export const saveCartLocally = async (userUid, cartItems) => {
  try {
    const key = `${CART_KEY_PREFIX}${userUid}`;
    await AsyncStorage.setItem(key, JSON.stringify(cartItems));
  } catch (err) {
    console.error('Failed to save cart locally:', err);
  }
};

export const loadCartLocally = async (userUid) => {
  try {
    const key = `${CART_KEY_PREFIX}${userUid}`;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : {};
  } catch (err) {
    console.error('Failed to load cart locally:', err);
    return {};
  }
};

export const clearCartLocally = async (userUid) => {
  try {
    const key = `${CART_KEY_PREFIX}${userUid}`;
    await AsyncStorage.removeItem(key);
  } catch (err) {
    console.error('Failed to clear cart locally:', err);
  }
};