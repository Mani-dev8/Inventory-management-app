import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {LineChart} from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SvgComponentLogin} from '../assets/Icons';

type Props = {};

const Home = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [totalCategory, setTotalCategory] = useState(0);
  const [totalProduct, setTotalProduct] = useState(0);
  const [category, setCategory] = useState([]);
  const [product, setProduct] = useState([]);
  const navigation = useNavigation();

  const ChartComponent = ({data}) => {
    return (
      <View style={styles.chartContainer}>
        <LineChart
          data={data}
          width={Dimensions.get('window').width - 16} // Adjust the width as per your requirements
          height={220}
          yAxisSuffix="pcs"
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>
    );
  };
const [dataChart, setDataChart] = useState({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      data: [3, 8, 4, 3, 6, 2],
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      strokeWidth: 2,
    },
  ],
});
  const fetchProducts = async () => {
    try {
      // Perform your GET request to fetch products
      setIsLoading(true);
      const response = await fetch(
        'https://inventory-app-phi-sage.vercel.app/api/v1/products/get',
      );
      const data = await response.json();
      console.log(
        '🚀 ~ file: Home.tsx:110 ~ fetchProducts ~ data   ~~~  :',
        data.data,
      );
      setTotalProduct(data.data.length);
      setProduct(data.data.slice(0, 5).reverse());
      setDataChart(prevDataChart => {
        const newData = {
          ...prevDataChart,
          datasets: [
            {
              ...prevDataChart.datasets[0],
              data: [0, 8, 4, 3, 6, data.data.length],
            },
          ],
        };
        return newData;
      });
      setIsLoading(false);
    } catch (error) {
      console.log('Error fetching products:', error);
    }
  };
  const fetchCategory = async () => {
    try {
      // Perform your GET request to fetch products
      setIsLoading(true);
      const response = await fetch(
        'https://inventory-app-phi-sage.vercel.app/api/v1/categories/get',
      );
      const data = await response.json();
      console.log(
        '🚀 ~ file: Home.tsx:110 ~ fetchProducts ~ data   ~~~  :',
        data.data,
      );
      setTotalCategory(data.data.length);
      setCategory(data.data.slice(0, 5).reverse());
      setIsLoading(false);
    } catch (error) {
      console.log('Error fetching products:', error);
    }
  };
  useEffect(() => {
    setDataChart(prevDataChart => {
      const newData = {
        ...prevDataChart,
        datasets: [
          {
            ...prevDataChart.datasets[0],
            data: [3, 8, 4, 3, 6, totalProduct],
          },
        ],
      };
      return newData;
    });
  }, [totalProduct]);

  //check login
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
      fetchProducts();
      fetchCategory();
    }, []),
  );
  return (
    <View className="flex-1">
      {isLoading && (
        <View
          style={{backgroundColor: 'rgba(22,22,22,0.6)'}}
          className="bg-zinc-300
           flex-row items-center justify-center  flex-1 h-[100%] w-[100%] absolute top-0 left-0 z-30">
          <ActivityIndicator size="large" color="blue" />
        </View>
      )}
      <ScrollView className="flex-1 bg-zinc-50 p-4 ">
        <View className="flex-row items-center gap-x-2 pb-3  border-b border-b-blue-300 mb-3">
          <MaterialCommunityIcons
            name="view-dashboard"
            size={26}
            color="rgb(30, 64, 175)"
          />
          <Text className="text-blue-800 font-semibold text-xl">DashBoard</Text>
        </View>
        {isLogin === false && (
          <View className="flex-row items-center justify-between mx-2 z-20 mt-3 mb-4  bg-blue-50 shadow-md shadow-blue-900 py-4 px-2.5 rounded border-blue-200 border">
            <Text className="text-zinc-800 text-sm w-[65%] ">
              Please Sign in to add Category and Product into inventory
            </Text>
            <TouchableOpacity
              //@ts-ignore
              onPress={() =>
                navigation.navigate('Settings', {
                  screen: 'Sign in',
                })
              }
              activeOpacity={0.7}
              className="flex-row items-center gap-x-2 px-2 py-2 right-2 rounded bg-blue-800">
              <Text className="text-white text-base font-[500]">Login</Text>
              <SvgComponentLogin class="fill-white w-5 h-5  mr-2 " />
            </TouchableOpacity>
          </View>
        )}
        <Text className="text-blue-500 font-[500] text-sm pb-4">
          Number of Product added per month
        </Text>
        <ChartComponent data={dataChart} />
        <Text className="text-blue-500 font-[500] text-sm pb-4">
          Recently Added Category
        </Text>
        <View className="w-full  h-[33vh] mb-4  ">
          <FlatList
            horizontal={true}
            data={category}
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => (
              <View className="w-[37vw] rounded-lg bg-white border-blue-100 shadow shadow-blue-800 mx-2 my-1.5 h-[94%] p-2 border">
                <Image
                  source={{uri: item.image}}
                  className="w-full h-auto aspect-square"
                />
                <Text
                  className=" w-[100%] text-blue-600 pt-2 text-xs font-semibold"
                  numberOfLines={3}>
                  <Text className="text-blue-400  text-xs font-normal">
                    Title :
                  </Text>{' '}
                  {`\n` +
                    //@ts-ignore
                    item.title}
                </Text>
                <Text
                  className=" w-[100%] text-blue-600 text-xs font-semibold"
                  numberOfLines={3}>
                  <Text className="text-blue-400  text-xs font-normal">
                    Description :
                  </Text>{' '}
                  {`\n` +
                    //@ts-ignore
                    item.description}
                </Text>
              </View>
            )}
          />
        </View>
        <View className="gap-y-6 pb-10 ">
          <View className="flex-row   justify-between  items-center  w-[97%] m-auto ">
            <View className=" px-3 items-center py-3 bg-white  rounded-3xl shadow shadow-blue-800 w-[60vw]">
              <Text className="text-blue-500 font-[500] text-sm pb-4">
                Total Categories
              </Text>
              <View className="flex-row items-center gap-x-3 ">
                <MaterialIcons
                  name="category"
                  size={36}
                  color="rgb(30 64 175)"
                />
                <Text className="text-blue-800 font-semibold text-5xl">
                  {totalCategory}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                isLogin
                  ? navigation.navigate('Add New Category')
                  : Alert.alert('Warning', 'Please Sign in to Add Category')
              }
              className=" rounded-full bg-blue-800 p-2 border-2 border-blue-800 mr-2 shadow-lg shadow-zinc-800">
              <MaterialIcons name="add" size={30} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="text-blue-500 font-[500] text-sm  -mb-2 ">
            Recently Added Products
          </Text>
          <View className="w-full  h-[33vh]   ">
            <FlatList
              horizontal={true}
              data={product}
              showsHorizontalScrollIndicator={false}
              renderItem={({item}) => (
                <View className="w-[37vw] rounded-lg bg-white border-blue-100 shadow shadow-blue-800 mx-2 my-1.5 h-[94%] p-2 border">
                  <Image
                    source={{uri: item.image}}
                    className="w-full h-auto aspect-square"
                  />

                  <Text
                    className=" w-[100%] text-blue-600 pt-2 text-xs font-semibold"
                    numberOfLines={3}>
                    <Text className="text-blue-400  text-xs font-normal">
                      Title :
                    </Text>{' '}
                    {`\n` +
                      //@ts-ignore
                      item.title}
                  </Text>
                  <Text
                    className=" w-[100%] text-blue-600 text-xs font-semibold"
                    numberOfLines={3}>
                    <Text className="text-blue-400  text-xs font-normal">
                      Description :
                    </Text>{' '}
                    {`\n` +
                      //@ts-ignore
                      item.description}
                  </Text>
                  <Text
                    className=" w-[100%] text-blue-600 text-xs font-semibold"
                    numberOfLines={3}>
                    <Text className="text-blue-400  text-xs font-normal">
                      qty :
                    </Text>{' '}
                    {
                      //@ts-ignore
                      item.quantity
                    }
                  </Text>
                </View>
              )}
            />
          </View>
          <View className=" flex-row justify-between  items-center    w-[97%] m-auto ">
            <View className=" px-3 py-3 rounded-3xl bg-white w-[60vw] shadow shadow-blue-800 items-center">
              <Text className="text-blue-500 font-[500] text-sm pb-4">
                Total Products
              </Text>
              <View className="flex-row items-center gap-x-3 ">
                <MaterialIcons
                  name="inventory"
                  size={36}
                  color="rgb(30 64 175)"
                />
                <Text className="text-blue-800 font-semibold text-5xl">
                  {totalProduct}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                isLogin
                  ? navigation.navigate('Add New Product')
                  : Alert.alert('Warning', 'Please Sign in to Add Product')
              }
              className=" rounded-full bg-blue-800 p-2 border-2 border-blue-800 mr-2 shadow-lg shadow-zinc-800">
              <MaterialIcons name="add" size={30} color="white" />
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-between  items-center  py-4  w-[97%] m-auto ">
            <View className=" px-3 py-3 rounded-3xl bg-white w-[50%] shadow shadow-blue-800">
              <Text className="text-blue-500 font-[500] text-sm pb-4">
                Out of Stock
              </Text>
              <View className="flex-row items-center gap-x-3 ">
                <FontAwesome5
                  name="box-open"
                  size={30}
                  color="rgb(30 64 175)"
                />
                <Text className="text-blue-800 font-semibold text-5xl">1</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  chartContainer: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

//Dumy json
/* 
 const categories = [
   {
     id: 0,
     image:
       'https://cdn.dxomark.com/wp-content/uploads/medias/post-46580/HUAWEI_P40_Pro_Silver_back-1024x725.jpg',
     title: 'Smartphone',
     description:
       'Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam, beatae consectetur neque veniam doloribus natus eveniet, voluptate quod recusandae quia, nulla perspiciatis vero qui et inventore hic rem obcaecati adipisci doloremque sunt dolorum ut placeat corrupti debitis. Sint consequatur eligendi, illo impedit similique harum dolores obcaecati modi nesciunt, possimus tempora!',
   },
   {
     id: 1,
     image:
       'https://www.egypte-market.com/wp-content/uploads/2021/02/men-clothing-category.jpeg',
     title: "Men's Clothing",
     description:
       'Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam, beatae consectetur neque veniam doloribus natus eveniet, voluptate quod recusandae quia, nulla perspiciatis vero qui et inventore hic rem obcaecati adipisci doloremque sunt dolorum ut placeat corrupti debitis. Sint consequatur eligendi, illo impedit similique harum dolores obcaecati modi nesciunt, possimus tempora!',
   },
   {
     id: 2,
     image:
       'https://media.istockphoto.com/id/1208148708/photo/polka-dot-summer-brown-dress-suede-wedge-sandals-eco-straw-tote-bag-cosmetics-on-a-light.jpg?s=612x612&w=0&k=20&c=9Y135GYKHLlPotGIfynBbMPhXNbYeuDuFzreL_nfDE8=',
     title: "Women's",
     description:
       'Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam, beatae consectetur neque veniam doloribus natus eveniet, voluptate quod recusandae quia, nulla perspiciatis vero qui et inventore hic rem obcaecati adipisci doloremque sunt dolorum ut placeat corrupti debitis. Sint consequatur eligendi, illo impedit similique harum dolores obcaecati modi nesciunt, possimus tempora!',
   },
 ]; */
