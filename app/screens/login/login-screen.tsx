import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { Alert, ImageStyle, SafeAreaView, TextStyle, View, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AuthContext, NavigatorParamList } from "../../navigators"
import { Button, GradientBackground, Header, Icon, Screen, Text, TextField } from "../../components"
// import { useStores } from "../../models"
import { color, spacing, typography } from "../../theme"
import { useNavigation } from "@react-navigation/native"
import { saveString } from "../../utils/storage"
import { Api } from "../../services/api"


const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  flex:1,
  backgroundColor: color.transparent,
  // justifyContent:"center",
  // alignItems:"center",
}
const TEXT: TextStyle = {
  color: color.palette.black,
  fontFamily: typography.primary,
}
const TEXTVIEW: ViewStyle = {
  flex:1,
  justifyContent:"center"
}
const TEXTINPUTSTYLE: ViewStyle = {
  marginVertical: spacing[4]
}
const BOLD: TextStyle = { fontWeight: "bold" }
const CONTINUE: ViewStyle = {
  height:70,
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
}
const CONTINUE_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  color: color.palette.white,
  fontSize: 14,
  letterSpacing: 2,
}
const FOOTER: ViewStyle = {  }
const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[6],
  paddingHorizontal: spacing[4],
}
const LINKVIEW: ViewStyle = {
  marginTop: spacing[4],
  alignItems:"center"
}

const HEADER: TextStyle = {
  textAlign: "center",
  alignSelf: "center",
  width:"100%",
  backgroundColor:color.backgroundWhite,
}
const HEADER_TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 20,
  lineHeight: 30,
  textAlign: "center",
  letterSpacing: 1,
}
const LOGO : ImageStyle = {
  justifyContent:"center",
  resizeMode:"contain",
  alignContent:"center",
  width:150,
  height:150,
  borderRadius:20
}
const LOGOVIEW : ViewStyle = {
  marginTop:spacing[8],
  justifyContent:"center",
  alignItems:"center",
}
export const LoginScreen: FC<StackScreenProps<NavigatorParamList, "login">> = observer(function LoginScreen() {


  const { signIn } = React.useContext(AuthContext)
  const navigation = useNavigation()

  const [username,setUsername] = useState<string>("")
  const [password,setPassword] = useState<string>("")

  const nextScreen =  async () => {
    const authApi = new Api()
    await authApi.setup()
    await authApi.login(username, password).then(function (response) {
      // handle success
      console.log(response.kind)
      console.log(response.loginResult)
      if (response.kind === "ok") {
        const key = response.loginResult?.token
        const role = response.loginResult?.role
        const userid = response.loginResult?.id
        const username = response.loginResult?.name
        const hours = response.loginResult?.preferredHours

        setTimeout(async () => {
          await saveString("token", key)
          await saveString("id", userid.toString())
          await saveString("role", role)
          await saveString("username", username)
          await saveString("hours", hours)

          signIn({ key })
          // navigation.navigate("menu", { screen: "home" })
        }, 1500)
      } else {
        setTimeout(() => {
          Alert.alert(
            "Error",
            "Error Occured: "+ response.kind,
            [
              {
                text: "OK",
                style: "cancel",
              },
            ],
            {
              cancelable: true,
            },
          )
        }, 1500)
      }
    })
  }
  return (
    <View testID="Login" style={FULL}>
      <GradientBackground colors={[color.backgroundWhite , color.backgroundWhite]} />
      <Screen style={CONTAINER} preset="fixed" backgroundColor={color.transparent}>
        <Header headerTx="login.login" style={HEADER} titleStyle={HEADER_TITLE} />
        <View style={LOGOVIEW}>
           <Icon icon="logo" style={LOGO} />
        </View>
        <View style={TEXTVIEW}>
          <TextField
            preset="default"
            onChangeText={(value) => setUsername(value)}
            value={username}
            placeholder="Username"
            style={TEXTINPUTSTYLE}
          />
          <TextField
            onChangeText={(value) => setPassword(value)}
            value={password}
            placeholder="Password"
            style={TEXTINPUTSTYLE}
            secureTextEntry
          />
        </View>
      </Screen>
      <SafeAreaView style={FOOTER}>
        <View style={FOOTER_CONTENT}>
          <Button
            testID="next-screen-button"
            style={CONTINUE}
            textStyle={CONTINUE_TEXT}
            tx="login.login"
            onPress={nextScreen}
          />
          <View style={LINKVIEW}>
            <Text preset="link" tx="login.create" onPress={ ()=>{
                  return navigation.navigate("create")
               }}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  )
})
