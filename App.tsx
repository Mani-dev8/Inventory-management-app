import {View, Text} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './src/screens/Home';
import AddCategory from './src/screens/AddCategory';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Categories from './src/screens/Categories';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Products from './src/screens/Products';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import SignIn from './src/screens/SignIn';
import AddProduct from './src/screens/AddProduct';
import CloudinaryUpload from './src/screens/CloudinaryUpload';
import { CategoryStackParamList, ProductStackParamList } from './types';
import EditCategory from './src/screens/EditCategory';
import SignUp from './src/screens/SignUp';
import EditProduct from './src/screens/EditProduct';

type Props = {};

const App = (props: Props) => {
  const RootStack = createNativeStackNavigator();
  const CategoryRootStack=createNativeStackNavigator<CategoryStackParamList>()
  const CategoryStack=()=>{
    return (
      <CategoryRootStack.Navigator>
        <CategoryRootStack.Screen
          name="All Category"
          component={Categories}
          options={{
            headerTitleStyle: {color: 'darkblue'},
          }}
        />
        <CategoryRootStack.Screen
          name="Edit Category"
          options={{
            headerTitleStyle: {color: 'darkblue'},
          }}
          component={EditCategory}
        />
      </CategoryRootStack.Navigator>
    );
  }
  const ProductRootStack=createNativeStackNavigator<ProductStackParamList>()
  const ProductStack=()=>{
    return (
      <ProductRootStack.Navigator>
        <ProductRootStack.Screen
          name="All Product"
          component={Products}
          options={{
            headerTitleStyle: {color: 'darkblue'},
          }}
        />
        <ProductRootStack.Screen
          name="Edit Product"
          options={{
            headerTitleStyle: {color: 'darkblue'},
          }}
          component={EditProduct}
        />
      </ProductRootStack.Navigator>
    );
  }
  const Tab=createBottomTabNavigator()
  const AddStack = () => {
    return (
      <RootStack.Navigator>
        <RootStack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="Add New Category"
          component={AddCategory}
          options={{
            headerTitleStyle: {color: 'darkblue'},
          }}
        />
        <RootStack.Screen
          name="Add New Product"
          component={AddProduct}
          options={{
            headerTitleStyle: {color: 'darkblue'},
          }}
        />
      </RootStack.Navigator>
    );
  };
  const SettingsStack = () => {
    return (
      <RootStack.Navigator>
        <RootStack.Screen
          name="Sign in"
          component={SignIn}
          options={{
            headerShown: false,}}
        />
        <RootStack.Screen
          name="Sign up"
          component={SignUp}
          options={{
            headerShown: false,}}
        />
      </RootStack.Navigator>
    );
  };
  return (
    <NavigationContainer>
      <Tab.Navigator>
        {/* <Tab.Screen name='Upload' component={CloudinaryUpload}/> */}
        <Tab.Screen
          name="Dashboard"
          component={AddStack}
          options={{
            headerShown: false,
            tabBarLabelStyle: {paddingBottom: 8, fontSize: 12},
            tabBarStyle: {
              borderTopColor: 'lightgray',
              shadowRadius: 1,
              shadowOpacity: 1,
              shadowColor: 'black',
              padding: 10,
              height: 65,
            },
            tabBarIcon: ({focused}) => {
              if (focused) {
                return (
                  <MaterialCommunityIcons
                    name="home"
                    size={25}
                    color={'#00f'}
                  />
                );
              } else {
                return (
                  <MaterialCommunityIcons
                    name="home"
                    size={25}
                    color={'rgba(0,0,0,0.4)'}
                  />
                );
              }
            },
          }}
        />
        <Tab.Screen
          name="Categories"
          component={CategoryStack}
          options={{
            headerShown:false,
            headerTitleStyle:{color:'darkblue'},
            tabBarLabelStyle: {paddingBottom: 8, fontSize: 12},
            tabBarStyle: {
              borderTopColor: 'lightgray',
              shadowRadius: 1,
              shadowOpacity: 1,
              shadowColor: 'black',
              padding: 10,
              height: 65,
            },
            tabBarIcon: ({focused}) => {
              if (focused) {
                return (
                  <MaterialIcons
                    name="category"
                    size={25}
                    color="rgb(30 64 175)"
                  />
                );
              } else {
                return (
                  <MaterialIcons name="category" size={25} color={'rgba(0,0,0,0.4)'} />
                );
              }
            },
          }}
        />
        <Tab.Screen
          name="Products"
          component={ProductStack}
          options={{
            headerShown: false,
            tabBarLabelStyle: {paddingBottom: 8, fontSize: 12},
            tabBarStyle: {
              borderTopColor: 'lightgray',
              shadowRadius: 1,
              shadowOpacity: 1,
              shadowColor: 'black',
              padding: 10,
              height: 65,
            },
            tabBarIcon: ({focused}) => {
              if (focused) {
                return (
                  <MaterialIcons
                    name="inventory"
                    size={25}
                    color="rgb(30 64 175)"
                  />
                );
              } else {
                return (
                  <MaterialIcons name="inventory" size={25} color={'rgba(0,0,0,0.4)'} />
                );
              }
            },
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsStack}
          options={{
            headerShown: false,
            tabBarLabelStyle: {paddingBottom: 8, fontSize: 12},
            tabBarStyle: {
              borderTopColor: 'lightgray',
              shadowRadius: 1,
              shadowOpacity: 1,
              shadowColor: 'black',
              padding: 10,
              height: 65,
            },
            tabBarIcon: ({focused}) => {
              if (focused) {
                return (
                  <IconIonicons
                    name="settings-sharp"
                    size={25}
                    color={'#00f'}
                  />
                );
              } else {
                return (
                  <IconIonicons
                    name="settings-sharp"
                    size={25}
                    color={'rgba(0,0,0,0.4)'}
                  />
                );
              }
            },
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
