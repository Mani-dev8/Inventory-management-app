import React, {useState} from 'react';
import {View,Image, Button, ActivityIndicator} from 'react-native';
import WebView from 'react-native-webview';
import ImageCropPicker from 'react-native-image-crop-picker';

type Props = {};

const CloudinaryUpload = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

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
    <View>
      <Button title="Upload Image" onPress={handleImageUpload} />
      {imageUrl && (
        <View className="w-[50vw] h-auto aspect-square mx-auto mt-6 rounded overflow-hidden">
          <Image
            source={{uri: `${imageUrl}`}}
            className="w-full h-auto aspect-square"
          />
        </View>
      )}
      {isLoading && (
        <View className="bg-zinc-300 flex-row items-center justify-center flex-1 h-[100vh] w-[100vw] absolute top-0 left-0 self-center">
          <ActivityIndicator size="large" color="blue" />
        </View>
      )}
    </View>
  );
};

export default CloudinaryUpload;
