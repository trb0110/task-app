import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { SafeAreaView, TextStyle, View, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AuthContext, NavigatorParamList } from "../../navigators"
import { Button, GradientBackground, Header, Screen, Text } from "../../components"
import { color, spacing, typography } from "../../theme"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { useNavigation } from "@react-navigation/native"
import NumericInput from "react-native-numeric-input"
import { Dirs, FileSystem } from "react-native-file-access"
import { loadString } from "../../utils/storage"


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
const BOLD: TextStyle = { fontWeight: "bold" }
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

const FOOTER: ViewStyle = { flex:1, justifyContent:"flex-end" }
const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[6],
  paddingHorizontal: spacing[4],
}

const BUTTON: ViewStyle = {
  height:50,
  paddingVertical: spacing[4],
  marginBottom:spacing[4],
  paddingHorizontal: spacing[4],
}
const BUTTON_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  color: color.palette.white,
  fontSize: 14,
  letterSpacing: 2,
}

const PREFERREDVIEW: ViewStyle = {
  flex:1,
  flexDirection:"row",
  justifyContent:"flex-start",
  alignItems:"center",
  paddingHorizontal:spacing[4],
}

const PREFEREDTEXT: TextStyle = {
  marginHorizontal:spacing[6]
}
export const SettingsScreen: FC<StackScreenProps<NavigatorParamList, "settings">> = observer(function SettingsScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation()
  const { signOut } = React.useContext(AuthContext)

  const [preferredHours, setPreferredHours]= useState(0)

  useEffect(()=>{
    ;(async () => {
      const hours = await loadString("hours")
      const h = parseInt(hours)
      // console.log(h)
      setPreferredHours(h)
    })()
  },[])

  return (
    <View testID="Home" style={FULL}>
      <GradientBackground colors={[color.backgroundWhite , color.backgroundWhite]} />
      <Screen style={CONTAINER} preset="fixed" backgroundColor={color.transparent} tabBarHeight={tabBarHeight}>
        <Header
          headerTx="home.settings"
          style={HEADER}
          titleStyle={HEADER_TITLE}
          rightMaterialIcon
          rightIcon="logout"
          onRightPress={()=>{signOut()}}
        />
        <View style={PREFERREDVIEW}>
          <Text preset="bold" tx={"home.preferredHours"} style={PREFEREDTEXT} />
          <NumericInput
            onChange={()=>{}}
            type={"plus-minus"}
            rounded
            minValue={0}
            maxValue={24}
            editable={false}
            value={preferredHours}
            initValue={preferredHours}
          />
        </View>
      </Screen>
    </View>
  )
})
