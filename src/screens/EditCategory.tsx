import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import WebView from 'react-native-webview';
import React, {useEffect, useState} from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CloudinaryUpload from './CloudinaryUpload';
import {launchImageLibrary} from 'react-native-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageCropPicker from 'react-native-image-crop-picker';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {EditCategoryScreenRouteProp} from '../../types';
type Props = {};

const EditCategory = (props: Props) => {
  const route = useRoute<EditCategoryScreenRouteProp>();
  const navigation = useNavigation();
  const data = route.params.data;
  console.log(
    '🚀 ~ file: EditCategory.tsx:26 ~ EditCategory ~ data   ~~~  :',
    data.image,
  );
  const [imageUrl, setImageUrl] = useState<any>('');
  const [categoryData, setCategoryData] = useState([]);
  const [oldImage, setOldImage] = useState<any>('');
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [description, setDescription] = useState('');
  const handleSubmitEditCategory = async () => {
    try {
      const updatedCategory = {
        id: data.id,
        title: title,
        image: imageUrl==''?imageUrl:oldImage,
        description: description,
      };
      fetch(
        `https://inventory-app-phi-sage.vercel.app/api/v1/categories/update/${data.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedCategory),
        },
      )
        .then(response => response.json())
        .then(data => {
          // Handle the response from the server
          console.log('Category submit response:', data);
          setIsLoading(false);
          Alert.alert('Success', 'Category edited successfully ');
          navigation.navigate('Categories', {screen: 'All Category'});
        })
        .catch(error => {
          setIsLoading(false);
          alert('Something went wrong while submitting the category');
          console.log('Category submit error:', error);
        });
    } catch (error) {
      console.log('Category submit error:', error);
    }
  };
  
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

  useEffect(() => {
    setTitle(data.title);
    setDescription(data.description);
    setOldImage(data.image);
  }, []);

  return (
    <View className="flex-1 relative ">
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
        className="h-full w-full   bg-zinc-50 px-6 py-6  ">
        <Text className="text-sm text-blue-800 font-[500] pb-4  uppercase">
          Old Image:
        </Text>
        {/* <Text
          className="text-xs text-blue-400 font-[500] pb-3 "
          selectable={true}>
          note :
          <Text className="text-xs text-blue-800 font-[500]">
            select image from gallery 
          </Text>
        </Text> */}
        {oldImage && (
          <View className="w-[50vw] h-auto aspect-square mx-auto  rounded overflow-hidden">
            <Image
              source={{uri: `${oldImage}`}}
              className="w-full h-auto aspect-square"
              resizeMode="contain"
            />
          </View>
        )}
        <Text className="text-sm text-blue-800 font-[500] pb-4  uppercase">
          Upload New Image:
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
          className="px-2 py-3  items-center flex-row justify-center rounded bg-blue-800">
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
          <View className="w-[50vw] h-auto aspect-square mx-auto rounded overflow-hidden">
            <Image
              source={{uri: `${imageUrl}`}}
              className="w-full h-auto aspect-square"
              resizeMode="contain"
            />
          </View>
        )}
        <View className="mb-2">
          <Text className="text-sm text-blue-800 font-[500] py-3  uppercase">
            Title :
          </Text>
          <TextInput
            className="border-blue-200 bg-white mb-1.5 focus:border-blue-800  px-2 py-2 border shadow shadow-blue-800 rounded text-blue-600 text-base"
            cursorColor={'blue'}
            value={title}
            onChangeText={text => setTitle(text)}></TextInput>
        </View>
        <Text className="text-sm text-blue-800 font-[500] py-3 uppercase">
          description :
        </Text>
        <TextInput
          className="border-blue-200 bg-white mb-1.5 focus:border-blue-800  px-2 py-2 border shadow shadow-blue-800 rounded text-blue-600 text-base"
          cursorColor={'blue'}
          value={description}
          onChangeText={text => setDescription(text)}></TextInput>

        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-row mb-10 items-center overflow-hidden shadow-lg shadow-blue-800 border border-blue-800 bg-blue-50 mt-10 justify-center mx-auto w-full px-4 py-3 rounded-lg "
          onPress={() => handleSubmitEditCategory()}>
          <Text className="text-blue-800 text-base px-2 mr-2 uppercase font-semibold">
            Edit
          </Text>
          <MaterialCommunityIcons name="arrow-right" size={26} color={'blue'} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default EditCategory;
