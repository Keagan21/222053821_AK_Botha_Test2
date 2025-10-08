import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function ProductItem({ product, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.info}>
        <Text numberOfLines={1} style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>${product.price}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection:'row', marginBottom:10, backgroundColor:'#fff', borderRadius:8, padding:10 },
  image: { width:80, height:80, resizeMode:'contain' },
  info: { flex:1, marginLeft:10, justifyContent:'center' },
  title: { fontWeight:'bold' },
  price: { marginTop:5, color:'#007bff' }
});
