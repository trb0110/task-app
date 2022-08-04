
import React, { useEffect } from "react"
import { useColorScheme } from "react-native"
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import {
  LoginScreen,
  CreateScreen,
  ModalScreen,
  ModalUserScreen,
} from "../screens"
import { navigationRef, useBackButtonHandler } from "./navigation-utilities"
import { BottomTabNavigator } from "./bottom-tab/bottom-tab-navigator"
import { useStores } from "../models"

export type NavigatorParamList = {
  login: undefined
  create: undefined
  homeStack: undefined
  modal: undefined
  modalUser: undefined
}

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<NavigatorParamList>()

export const AuthContext = React.createContext()
const AppStack = () => {

  const { taskStore ,userStore} = useStores()
  const { tasks } = taskStore
  const { users } = userStore
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "RESTORE_TOKEN":
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          }
        case "SIGN_IN":
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          }
        case "SIGN_OUT":
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          }
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  )
  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken

      try {
        loadString("token").then((resp) => {
          if (resp !== null) {
            userToken = resp
          }
        })
      } catch (e) {
        // Restoring token failed
      }
      dispatch({ type: "RESTORE_TOKEN", token: userToken })
    }

    bootstrapAsync()
  }, [])

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        dispatch({ type: "SIGN_IN", token: data.key })
      },
      signOut: async () => {
        dispatch({ type: "SIGN_OUT",token:null })
      },
    }),
    [],
  )
  useEffect(()=>{
    if (!state.token){
      (async ()=>{
        await taskStore.clearStore()
        await userStore.clearStore()
      })()
    }
  },[state])
  return (

    <AuthContext.Provider value={authContext}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="login"
      >
        {state.userToken == null ? (
          <>
            <Stack.Screen name="login" component={LoginScreen} />
            <Stack.Screen name="create" component={CreateScreen} />
          </>
          ) : (
            <>
              <Stack.Screen name="homeStack" component={BottomTabNavigator} />
              <Stack.Group screenOptions={{ presentation: 'modal' }}>
                <Stack.Screen name="modal" component={ModalScreen} />
                <Stack.Screen name="modalUser" component={ModalUserScreen} />
              </Stack.Group>
            </>
          )}
      </Stack.Navigator>
    </AuthContext.Provider>
  )
}

interface NavigationProps extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = (props: NavigationProps) => {
  const colorScheme = useColorScheme()
  useBackButtonHandler(canExit)
  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
    >
      <AppStack />
    </NavigationContainer>
  )
}

AppNavigator.displayName = "AppNavigator"

/**
 * A list of routes from which we're allowed to leave the app when
 * the user presses the back button on Android.
 *
 * Anything not on this list will be a standard `back` action in
 * react-navigation.
 *
 * `canExit` is used in ./app/app.tsx in the `useBackButtonHandler` hook.
 */
const exitRoutes = ["login"]
export const canExit = (routeName: string) => exitRoutes.includes(routeName)
