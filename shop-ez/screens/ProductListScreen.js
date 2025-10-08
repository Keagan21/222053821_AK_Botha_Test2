// src/screens/ProductListScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../styles/theme';

const { width } = Dimensions.get('window');
const imageSize = width * 0.2;  // Responsive: 20% of screen width for images

export default function ProductListScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch categories (once on mount)
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch products (once on mount)
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://fakestoreapi.com/products/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(['all', ...data]);  // Add 'all' option
    } catch (err) {
      setError('Error fetching categories');
      Alert.alert('Error', 'Failed to load categories. Check your connection.');
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError('Error fetching products');
      Alert.alert('Error', 'Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on selected category
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category === selectedCategory);

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
      activeOpacity={0.7}  // Visual feedback on press
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.productImage}
        resizeMode="cover"  // Ensures image fits without distortion
      />
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={2} ellipsizeMode="tail">
          {item.title}
        </Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Custom header for logout and count (navigation header is shown via Stack options) */}
      <View style={styles.customHeader}>
        <Text style={styles.headerTitle}>
          Products ({filteredProducts.length})
        </Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Cart')} 
          style={styles.cartButton}
          activeOpacity={0.7}
        >
          <Text style={styles.cartText}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={logout} style={styles.logoutButton} activeOpacity={0.7}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Category Filter Buttons */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContainer}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategoryButton,
            ]}
            onPress={() => setSelectedCategory(category)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.selectedCategoryText,
              ]}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Error Display */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Product List */}
      {filteredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No products found in this category.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}  // Performance for long lists
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  customHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.large,
    backgroundColor: theme.colors.card,
    elevation: 2,  // Android shadow
    shadowColor: '#000',  // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  cartButton: {
    padding: theme.spacing.small,
  },
  cartText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    padding: theme.spacing.small,
  },
  logoutText: {
    color: theme.colors.danger,
    fontSize: 16,
    fontWeight: '500',
  },
  categoryScroll: {
    backgroundColor: theme.colors.card,
  },
  categoryContainer: {
    paddingHorizontal: theme.spacing.medium,
  },
  categoryButton: {
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
    marginRight: 10,
    marginVertical: 10,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.textSecondary,
  },
  selectedCategoryButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  selectedCategoryText: {
    color: theme.colors.card,  // White for selected
    fontWeight: 'bold',
  },
  productItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    marginVertical: theme.spacing.small,
    marginHorizontal: theme.spacing.medium,
    borderRadius: theme.borderRadius,
    padding: theme.spacing.medium,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    alignItems: 'center',
  },
  productImage: {
    width: imageSize,
    height: imageSize,
    borderRadius: 5,
    marginRight: theme.spacing.medium,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: theme.spacing.small,
    flexShrink: 1,  // Allows text wrapping
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  list: {
    paddingBottom: theme.spacing.large,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: theme.spacing.medium,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  error: {
    color: theme.colors.danger,
    textAlign: 'center',
    padding: theme.spacing.medium,
    backgroundColor: '#ffe6e6',
    margin: theme.spacing.medium,
    borderRadius: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.large,
  },
  emptyText: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});