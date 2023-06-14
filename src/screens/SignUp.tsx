import {
  View,
  ScrollView,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import React, {useRef, useState} from 'react';
import {
  GoogleSvgComponent,
  SvgComponentCloseEye,
  SvgComponentOpenEye,
} from '../assets/Icons';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {};

const SignUp = (props: Props) => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const refPassword = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [credentials, setCredentials] = useState({
    userName: '',
    email: '',
    password: '',
  });
  const handleSignUp = async () => {
    try {
      if (
        !credentials.userName ||
        !credentials.email ||
        !credentials.password
      ) {
        return alert('All fields are required');
      }

      if (credentials.password.length < 8) {
        return alert('Password should be at least 8 characters long ');
      }
      if (credentials.password !== confirmPassword) {
        return alert('Password and confirm password should match ');
      }

      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(credentials.email)) {
        return alert('Invalid email format');
      }
      setIsLoading(true);

      const response= await fetch(
         'https://inventory-app-phi-sage.vercel.app/api/v1/user/new',
         {
           method: 'POST',
           headers: {
             'Content-type': 'application/json',
           },
           body: JSON.stringify(credentials),
         },
       );
       const statusCode=response.status
      setIsLoading(false);

       if (statusCode===200) {
        await AsyncStorage.setItem('user-authenticated',"true")
        //@ts-ignore
        navigation.navigate('Dashboard',{
          screen:'Home'
        })
       }
       if (statusCode === 400) {
         alert(
           'Account with this email id already exist, Please Sign in',
         );
       }
       console.log("🚀 ~ file: SignUp.tsx:63 ~ handleSignUp ~ statusCode   ~~~  :", statusCode)
    } catch (error) {
        alert('Something went wrong.')
    }
   
  };
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
      <View className="h-full w-full my-auto ">
        <View className="mx-4 my-auto  px-5 border border-blue-300 py-4 pb-6 rounded-xl bg-white">
          <Text className="uppercase self-center py-2 px-1 border-b-2 text-blue-700 border-b-blue-700 font-[500] text-2xl">
            Inventory-app
          </Text>

          <View className="items-center  flex-row pb-5"></View>
          <View className="gap-y-3">
            <View className="gap-y-2">
              <Text className="text-blue-700 text-base">User Name</Text>
              <TextInput
                cursorColor={'blue'}
                value={credentials.userName}
                onChangeText={text =>
                  setCredentials({...credentials, userName: text})
                }
                className="border-[1.5px] rounded border-zinc-300 focus:border-blue-700 py-1.5 text-base text-black"></TextInput>
            </View>
            <View className="gap-y-2">
              <Text className="text-blue-700 text-base">Email</Text>
              <TextInput
                cursorColor={'blue'}
                value={credentials.email}
                onChangeText={text =>
                  setCredentials({...credentials, email: text})
                }
                keyboardType="email-address"
                className="border-[1.5px] rounded border-zinc-300 focus:border-blue-700 py-1.5 text-base text-black"></TextInput>
            </View>
            <View className="gap-y-2  ">
              <Text className="text-blue-700 text-base">Confirm Password</Text>
              <View className="relative justify-center">
                <TextInput
                  cursorColor={'blue'}
                  value={credentials.password}
                  onChangeText={text =>
                    setCredentials({...credentials, password: text})
                  }
                  secureTextEntry={showPassword ? false : true}
                  ref={refPassword}
                  className="border-[1.5px] rounded pr-10  border-zinc-300 focus:border-blue-700 py-1.5 text-base text-black"></TextInput>

                <TouchableOpacity
                  className="absolute right-2 z-50 w-5 h-5 "
                  onPress={() => setShowPassword(!showPassword)}>
                  {showPassword === true ? (
                    <SvgComponentOpenEye class="w-5 h-5" />
                  ) : (
                    <SvgComponentCloseEye class="w-5 h-5" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <View className="gap-y-2  ">
              <Text className="text-blue-700 text-base">Password</Text>
              <View className="relative justify-center">
                <TextInput
                  cursorColor={'blue'}
                  value={confirmPassword}
                  onChangeText={text => setConfirmPassword(text)}
                  secureTextEntry={showPassword2 ? false : true}
                  ref={refPassword}
                  className="border-[1.5px] rounded pr-10  border-zinc-300 focus:border-blue-700 py-1.5 text-base text-black"></TextInput>

                <TouchableOpacity
                  className="absolute right-2 z-50 w-5 h-5 "
                  onPress={() => setShowPassword2(!showPassword2)}>
                  {showPassword2 === true ? (
                    <SvgComponentOpenEye class="w-5 h-5" />
                  ) : (
                    <SvgComponentCloseEye class="w-5 h-5" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleSignUp}
            className="py-2.5 items-center bg-blue-700 w-full self-center rounded-md mt-10 ">
            <Text className="text-white text-xl font-semibold ">Sign up</Text>
          </TouchableOpacity>

          <View className="flex-row items-center justify-center gap-x-2 mt-5">
            <Text className="text-base text-zinc-500">
              Already have an account
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text
                className="text-blue-700 font-semibold text-base"
                onPress={() => navigation.navigate('Sign in')}>
                Log in
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SignUp;
