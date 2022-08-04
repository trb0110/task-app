import React, { useEffect, useState } from "react"
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { color } from "../../theme"
import { HomeScreen, SettingsScreen, UsersScreen } from "../../screens"
import { loadString } from "../../utils/storage"


export type BottomTabNavigatorParamList = {
  users:undefined
  home: undefined
  settings:undefined
}

const Tab = createBottomTabNavigator<BottomTabNavigatorParamList>()

export const BottomTabNavigator = () => {

  const [role,setRole]= useState<string>("")
  useEffect(()=>{
    (async ()=>{
      const temp = await loadString("role")
      setRole(temp)
    })()
  },[])
  return (
    <Tab.Navigator
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: color.primaryDarker,
        headerShown:false,
        tabBarStyle: { position: 'absolute',height:75,backgroundColor:color.transparent },
      }}

    >
      {
        role !=="3"?
          <Tab.Screen
            name="users"
            component={UsersScreen}
            options={{
              tabBarShowLabel: false,
              tabBarIcon: ({focused, size }) => (
                <MaterialCommunityIcons name="account-multiple-plus" color={focused?color.tabBarIcon:color.lightGrey} size={size} />
              ),
            }}
          />:null
      }
      {
        role!=="2"?
            <Tab.Screen
              name="home"
              component={HomeScreen}
              options={{
                tabBarShowLabel: false,
                tabBarIcon: ({focused, size }) => (
                  <MaterialCommunityIcons name="home" color={focused?color.tabBarIcon:color.lightGrey} size={size} />
                ),
              }}
            />
         :null
        }
        {
          role ==="3"?
            <Tab.Screen
              name="settings"
              component={SettingsScreen}
              options={{
                tabBarShowLabel: false,
                tabBarIcon: ({focused, size }) => (
                  <MaterialCommunityIcons name="account-cog" color={focused?color.tabBarIcon:color.lightGrey} size={size} />
                ),
              }}
            />
            :null
        }
    </Tab.Navigator>
  )
}
