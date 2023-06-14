import {
  View,
  ScrollView,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
type Props = {};

const Products = (props: Props) => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const [products, setProducts] = useState([]);
  const fetchProducts = async () => {
    try {
      // Perform your GET request to fetch products
      const response = await fetch(
        'https://inventory-app-phi-sage.vercel.app/api/v1/products/get',
      );
      const data = await response.json();
      console.log(
        '🚀 ~ file: Home.tsx:110 ~ fetchProducts ~ data   ~~~  :',
        data.data,
      );
      setProducts(data.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log('Error fetching products:', error);
    }
  };
  const handleDelete = async (productId: number) => {
    console.log(
      '🚀 ~ file: Categories.tsx:23 ~ handleDelete ~ productId   ~~~  :',
      productId,
    );
    Alert.alert(
      'Confirmation',
      'Are you sure you want to delete this product?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            setIsLoading(true);
            fetch(
              `https://inventory-app-phi-sage.vercel.app/api/v1/products/${productId}`,
              {
                method: 'DELETE',
              },
            )
              .then(response => {
                if (response.ok) {
                  console.log('Product deleted successfully');
                  Alert.alert('Success', 'Item deleted successfully');
                  setIsLoading(false);
                  fetchProducts();
                } else {
                  throw new Error('Product deletion failed');
                }
              })
              .catch(error => {
                // Handle the error
                setIsLoading(false);
                console.log('Product deletion error:', error);
                Alert.alert('Failure', 'Item not deleted');
              });
          },
        },
      ],
    );
  };
  const [isLogin, setIsLogin] = useState<boolean>(false);

  const handleLogin = async () => {
    try {
      const isAuth = await AsyncStorage.getItem('user-authenticated');
      if (isAuth !== null) {
        setIsLogin(true);
      }
    } catch (error) {}
  };
  useFocusEffect(
    React.useCallback(() => {
      handleLogin();
      setIsLoading(true);
      fetchProducts();
    }, []),
  );

  return (
    <View className="flex-1">
      {isLoading && (
        <View
          style={{backgroundColor: 'rgba(22,22,22,0.3)'}}
          className="bg-zinc-300
           flex-row items-center justify-center  flex-1 h-[100%] w-[100%] absolute top-0 left-0 z-30">
          <ActivityIndicator size="large" color="blue" />
        </View>
      )}
      <View className="px-3  flex-1 gap-y-3.5 bg-zinc-50 pt-5 ">
        {products && (
          <FlatList
            data={products}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => {
              return (
                <View className="flex-row p-3.5 bg-blue-50 w-[96%] my-1.5 shadow-md shadow-blue-800 mx-auto border rounded-2xl border-blue-200">
                  <Image
                    source={{uri: item.image}}
                    className="w-[40%] h-auto aspect-square"
                    resizeMode="contain"
                  />
                  <View className="pl-1.5 w-[50%] gap-y-1.5">
                    <Text
                      className=" w-[100%] text-blue-400 text-xs"
                      numberOfLines={3}>
                      <Text className="text-blue-800 font-semibold text-xs">
                        Title :
                      </Text>{' '}
                      {`\n` +
                        //@ts-ignore
                        item.title}
                    </Text>
                    <Text className=" w-[100%] text-blue-400 text-xs">
                      <Text className="text-blue-800 font-semibold text-xs">
                        category :
                      </Text>{' '}
                      {`\n` +
                        //@ts-ignore
                        item.category}
                    </Text>
                    <Text
                      className=" w-[100%] text-blue-400 text-xs"
                      numberOfLines={2}>
                      <Text className="text-blue-800 font-semibold text-xs">
                        qty :
                      </Text>{' '}
                      {
                        //@ts-ignore
                        item.quantity
                      }
                    </Text>

                    <Text
                      className=" w-[100%] text-blue-400 text-xs"
                      numberOfLines={3}>
                      <Text className="text-blue-800 font-semibold text-xs">
                        Description :
                      </Text>{' '}
                      {`\n` +
                        //@ts-ignore
                        item.description}
                    </Text>
                  </View>
                  <View className="justify-between right-0 ">
                    <TouchableOpacity
                      onPress={() =>
                        //@ts-ignore
                        isLogin
                          ? navigation.navigate('Edit Product', {
                              data: {
                                id: item._id,
                                title: item.title,
                                image: item.image,
                                description: item.description,
                                category: item.category,
                                quantity: item.quantity,
                                weight:item.weight,
                                dimensions: item.dimensions,
                              },
                            })
                          : Alert.alert(
                              'Warning',
                              'Please Sign in to Edit Product',
                            )
                      }
                      activeOpacity={0.7}
                      className="p-2  items-center rounded-full bg-white shadow-md shadow-blue-800">
                      <MaterialIcons
                        name="edit"
                        size={20}
                        color={'rgb(37 99 235)'}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() =>
                        isLogin
                          ? handleDelete(item._id)
                          : Alert.alert(
                              'Warning',
                              'Please Sign in to Edit Product',
                            )
                      }
                      className="p-2  items-center rounded-full bg-white shadow-md shadow-blue-800">
                      <MaterialIcons
                        name="delete"
                        size={20}
                        color={'rgb(37 99 235)'}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
        )}
      </View>
    </View>
  );
};

export default Products;
