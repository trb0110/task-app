import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { Alert, ImageStyle, SafeAreaView, TextStyle, View, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { Button, GradientBackground, Header, Icon, Screen, Text, TextField } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color, spacing, typography } from "../../theme"
import { useNavigation } from "@react-navigation/native"
import NumericInput from "react-native-numeric-input"
import { Api } from "../../services/api"
import { saveString } from "../../utils/storage"


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
  marginVertical: spacing[6]
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

const PREFERREDVIEW: ViewStyle = {
  flex:0.5,
  flexDirection:"row",
  justifyContent:"flex-start",
  alignItems:"center",
  paddingHorizontal:spacing[4]
}

const PREFEREDTEXT: TextStyle = {
  marginHorizontal:spacing[6]
}
export const CreateScreen: FC<StackScreenProps<NavigatorParamList, "create">> = observer(function CreateScreen() {

  const navigation = useNavigation()

  const [username,setUsername] = useState<string>("")
  const [password,setPassword] = useState<string>("")
  const [preferredHours, setPreferredHours]= useState(4)

  const nextScreen =  async () => {
    const signUpApi = new Api()
    await signUpApi.setup()
    await signUpApi.signUp(username, password,preferredHours).then(function (response) {
      // handle success
      console.log(response.kind)
      console.log(response.signUpResult)
      if (response.kind === "ok") {
        const resp = response.signUpResult?.resp

        setTimeout(() => {
          Alert.alert(
            "SUCCESS!",
            "Sign Up Success",
            [
              {
                text: "OK",
                onPress: () => navigation.navigate("login"),
                style: "cancel",
              },
            ],
            {
              cancelable: true,
            },
          )
        }, 1500)
      } else {
        setTimeout(() => {
          Alert.alert(
            "Error",
            "Error Occured",
            [
              {
                text: "OK",
                onPress: () => navigation.navigate("login"),
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
    <View testID="Create" style={FULL}>
      <GradientBackground colors={[color.backgroundWhite , color.backgroundWhite]} />
      <Screen style={CONTAINER} preset="fixed" backgroundColor={color.transparent}>
        <Header headerTx="create.signUp" style={HEADER} titleStyle={HEADER_TITLE} leftIcon={"back"} onLeftPress={()=>{navigation.goBack()}}/>

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

          <View style={PREFERREDVIEW}>
            <Text preset="bold" tx={"home.preferredHours"} style={PREFEREDTEXT} />
            <NumericInput
              onChange={setPreferredHours}
              type={"plus-minus"}
              rounded
              minValue={0}
              maxValue={24}
              editable={false}
              value={preferredHours}
            />

          </View>
        </View>
      </Screen>
      <SafeAreaView style={FOOTER}>
        <View style={FOOTER_CONTENT}>
          <Button
            testID="next-screen-button"
            style={CONTINUE}
            textStyle={CONTINUE_TEXT}
            tx="create.signUp"
            onPress={nextScreen}
          />
          <View style={LINKVIEW}/>

        </View>
      </SafeAreaView>
    </View>
  )
})
