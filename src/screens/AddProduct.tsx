import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import WebView from 'react-native-webview';
import React, {useState} from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CloudinaryUpload from './CloudinaryUpload';
import {launchImageLibrary} from 'react-native-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageCropPicker from 'react-native-image-crop-picker';
type Props = {};

//  Each product will have a primary image, a group of other images, title,
// description, SKU (unique), category, quantity, weight and dimensions. These


const AddCategory = (props: Props) => {
  const [categoryData, setCategoryData] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState<any>('');
  const [category, setCategory] = useState<any>('');
  const [quantity, setQuantity] = useState<any>('');
  const [weight, setWeight] = useState<any>('');
  const [dimensions, setDimensions] = useState<any>('');
  const handleSubmitProduct = async () => {
    try {
      console.log('title', title)
      console.log('imageUrl', imageUrl)
      console.log('description', description)
      console.log('category', category)
      console.log('quantity', quantity)
      console.log('weight', weight)
      const requestBody = {
        title: title,
        image: imageUrl,
        description: description,
        category:category,
        quantity:quantity,
        weight:weight,
        dimensions:dimensions
      };
      setIsLoading(true);
      fetch('https://inventory-app-phi-sage.vercel.app/api/v1/products/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })
        .then(response => response.json())
        .then(data => {
          // Handle the response from the server
          console.log('Category submit response:', data);
          setIsLoading(false);
          setIsLoading(false);
          setTitle('');
          setDescription('');
          setImageUrl('');
          setQuantity('');
          setCategory('');
          setWeight('');
          setDimensions('');
          Alert.alert('Success', 'Product added successfully ');
        })
        .catch(error => {
          setIsLoading(false);
          Alert.alert(
            'Error',
            'Something went wrong while submitting the Product',
          );
          console.log('Product submit error:', error);
        });
    } catch (error) {
      console.log('Product submit error:', error);
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = async () => {
    try {
      const image = await ImageCropPicker.openPicker({
        mediaType: 'photo',
        cropping: true,
        cropperToolbarTitle: 'Crop Image',
        compressImageQuality: 0.8,
      });

      const formData = new FormData();
      formData.append('image', {
        uri: image.path,
        type: image.mime,
        name: image.filename || 'image',
      });

      setIsLoading(true);
      fetch('https://api.imgur.com/3/upload', {
        method: 'POST',
        headers: {
          Authorization: 'Client-ID 348f376912f644c',
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          console.log('Image upload response:', data.data.link);
          setImageUrl(data.data.link);
          setIsLoading(false);
        })
        .catch(error => {
          setIsLoading(false);
          alert('Something went wrong while uploading the image');
          console.log('Image upload error:', error);
        });
    } catch (error) {
      console.log('Image selection error:', error);
    }
  };

  return (
    <View className="flex-1 relative">
      {isLoading && (
        <View
          style={{backgroundColor: 'rgba(22,22,22,0.3)'}}
          className="
           flex-row items-center justify-center w-full h-full z-20 absolute top-0 left-0 self-center">
          <ActivityIndicator size="large" color="blue" />
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="h-full w-full   bg-zinc-50  py-6 ">
        <Text className="text-sm text-blue-800 mx-6 font-[500] pb-4  uppercase">
          Upload Image:
        </Text>
        {/* <Text
          className="text-xs text-blue-400 font-[500] pb-3 "
          selectable={true}>
          note :
          <Text className="text-xs text-blue-800 font-[500]">
            select image from gallery 
          </Text>
        </Text> */}
        <TouchableOpacity
          onPress={handleImageUpload}
          className="px-2 py-3  mx-6 items-center flex-row justify-center rounded bg-blue-800">
          {imageUrl ? (
            <>
              <MaterialCommunityIcons
                name="cloud-check"
                size={25}
                color={'white'}
              />
              <Text className="text-blue-50 self-center ml-4 font-semibold">
                image uploaded
              </Text>
            </>
          ) : (
            <>
              <>
                <MaterialCommunityIcons
                  name="file-image-plus"
                  size={25}
                  color={'white'}
                />
                <Text className="text-blue-50 self-center ml-2">
                  select image
                </Text>
              </>
            </>
          )}
        </TouchableOpacity>
        {imageUrl && (
          <View className="w-[50vw] h-auto aspect-square mx-auto mt-6 rounded overflow-hidden">
            <Image
              source={{uri: `${imageUrl}`}}
              className="w-full h-auto aspect-square"
              resizeMode="contain"
            />
          </View>
        )}
        <View className="mb-2 mx-6">
          <Text className="text-sm text-blue-800 font-[500] py-3  uppercase">
            Title :
          </Text>
          <TextInput
            className="border-blue-200 bg-white mb-1.5 focus:border-blue-800  px-2 py-2 border shadow shadow-blue-800 rounded text-blue-600 text-lg"
            cursorColor={'blue'}
            value={title}
            onChangeText={text => setTitle(text)}></TextInput>
        </View>
        <Text className="text-sm  mx-6 text-blue-800 font-[500] py-3 uppercase">
          description :
        </Text>
        <TextInput
          className="border-blue-200  mx-6 bg-white mb-1.5 focus:border-blue-800  px-2 py-2 border shadow shadow-blue-800 rounded text-blue-600 text-lg"
          cursorColor={'blue'}
          value={description}
          onChangeText={text => setDescription(text)}></TextInput>
        <Text className="text-sm  mx-6 text-blue-800 font-[500] py-3 uppercase">
          category :
        </Text>
        <TextInput
          className="border-blue-200  mx-6 bg-white mb-1.5 focus:border-blue-800  px-2 py-2 border shadow shadow-blue-800 rounded text-blue-600 text-lg"
          cursorColor={'blue'}
          value={category}
          onChangeText={text => setCategory(text)}></TextInput>
        <Text className=" mx-6 text-sm text-blue-800 font-[500] py-3 uppercase">
          quantity :
        </Text>
        <TextInput
          className="border-blue-200  mx-6 bg-white mb-1.5 focus:border-blue-800  px-2 py-2 border shadow shadow-blue-800 rounded text-blue-600 text-lg"
          cursorColor={'blue'}
          value={quantity}
          onChangeText={text => setQuantity(text)}></TextInput>
        <Text className=" mx-6 text-sm text-blue-800 font-[500] py-3 uppercase">
          weight :
        </Text>
        <TextInput
          className="border-blue-200  mx-6 bg-white mb-1.5 focus:border-blue-800  px-2 py-2 border shadow shadow-blue-800 rounded text-blue-600 text-lg"
          cursorColor={'blue'}
          value={weight}
          onChangeText={text => setWeight(text)}></TextInput>
        <Text className=" mx-6 text-sm text-blue-800 font-[500] py-3 uppercase">
          dimensions :
        </Text>
        <TextInput
          className="border-blue-200  mx-6 bg-white mb-1.5 focus:border-blue-800  px-2 py-2 border shadow shadow-blue-800 rounded text-blue-600 text-lg"
          cursorColor={'blue'}
          value={dimensions}
          onChangeText={text => setDimensions(text)}></TextInput>

        <TouchableOpacity
          activeOpacity={0.7}
          className=" mx-6 flex-row items-center overflow-hidden shadow-lg shadow-blue-800 border border-blue-800 bg-blue-50 mt-10 justify-center  px-4 py-3 rounded-lg mb-10"
          onPress={() => handleSubmitProduct()}>
          <Text className="text-blue-800 text-base px-2 mr-2 uppercase font-semibold">
            Submit
          </Text>
          <MaterialCommunityIcons name="arrow-right" size={26} color={'blue'} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default AddCategory;
