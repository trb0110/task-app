import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Alert, ImageStyle, SafeAreaView, TextStyle, View, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { Button, Screen, Text, TextField } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color, spacing, typography } from "../../theme"
import NumericInput from "react-native-numeric-input"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useStores } from "../../models"
import { Dropdown } from "react-native-element-dropdown"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const FULL: ViewStyle = { flex: 1 }
const ROOT: ViewStyle = {
  backgroundColor: color.modalBackground,
}

const FOOTER: ViewStyle = { flex:1, justifyContent:"flex-end" }
const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[6],
  paddingHorizontal: spacing[4],
}

const TEXT: TextStyle = {
  color: color.palette.black,
  fontFamily: typography.primary,
}
const BOLD: TextStyle = { fontWeight: "bold" }
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

const TEXTINPUTSTYLE: ViewStyle = {
  marginBottom: spacing[4],
  marginTop:spacing[6],
  marginHorizontal: spacing[0]
}
const TEXTINPUTSTYLEOVERRIDE: ViewStyle = {
  backgroundColor :color.modalBackground
}

const TEXTVIEW: ViewStyle = {
  flex:1,
  justifyContent:"center",
  marginHorizontal:spacing[6],
}

const PREFERREDVIEW: ViewStyle = {
  flex:1,
  flexDirection:"row",
  justifyContent:"flex-start",
  alignItems:"center",
  paddingHorizontal:spacing[2],
}

const DROPDOWN: ViewStyle = {
  height: 50,
  borderColor: color.palette.inputBorder,
  borderWidth: 0.5,
  borderRadius: 8,
  paddingHorizontal: spacing[4],
}
const PREFEREDTEXT: TextStyle = {
  marginRight:spacing[8]
}

const PLACEHOLDERSTYLE: TextStyle = {
  fontSize: 16,
}

const CONTAINERSTYLE: ViewStyle = {
  borderRadius: 8,
}
const ICON: ViewStyle = {
  marginRight: 5,
}
const ICONSTYLE: ImageStyle = {
  width: 20,
  height: 20,
}
const SELECTEDTEXTSTYLE: TextStyle = {
  fontSize: 16,
}
const INPUTSEARCH: TextStyle = {
  height: 40,
  fontSize: 16,
  borderRadius: 8,
}
interface ModalUserProps {
  isUpdateUser?: boolean
}
const data = [
  { label: 'Admin Role', value: '1' },
  { label: 'Manager Role', value: '2' },
  { label: 'Regular Role', value: '3' },
];
export const ModalUserScreen: FC<StackScreenProps<NavigatorParamList, "modalUser">> = observer(function ModalUserScreen(props:ModalUserProps) {

  const navigation = useNavigation()
  const { userStore } = useStores()
  const route = useRoute();
  const [username,setUsername] = useState<string>("")
  const [password,setPassword] = useState<string>("")

  const [preferredHours, setPreferredHours]= useState(0)
  const [isUpdateTask, setIsUpdateTask] = useState(false)
  const [item, setItem] = useState({})
  const [valueDropdown, setValueDropdown] = useState(null);
  const [isFocusDropdown, setIsFocusDropdown] = useState(false);

  useEffect(()=>{
    if (route?.params?.isUpdate){
      setIsUpdateTask(route?.params?.isUpdate)
    }

    if (route?.params?.isUpdate===true){
      if (route?.params?.item){
        setItem(route?.params?.item)
        if (route?.params?.item.name){
          setUsername(route?.params?.item.name)
          const ph = parseInt(route?.params?.item.preferedHours)

          setValueDropdown(route?.params?.item.role)
          setPreferredHours(ph)
        }

      }
    }
  },[route?.params])
  const saveHandler =  async () => {
    const body = {
      Username: username,
      Password: password,
      PreferredHours:preferredHours.toString(),
      Role:valueDropdown.toString()
    }

    if (isUpdateTask){
      body.UserID = item?.userId
    }

    const result = isUpdateTask?await userStore.updateUser(body):await userStore.addUser(body)
    setTimeout(() => {
      Alert.alert(
        result==="ok"?"Successful":result,
        "",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("users"),
            style: "cancel",
          },
        ],
        {
          cancelable: true,
        },
      )
    },1500)
  }
  const deleteHandler =  async () => {
    const result = await userStore.deleteUser(item?.userId)
    setTimeout(() => {
      Alert.alert(
        result==="ok"?"Successful":result,
        "",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("users"),
            style: "cancel",
          },
        ],
        {
          cancelable: true,
        },
      )
    },1500)
  }
  return (
    <View testID="Modal" style={FULL}>

      <Screen style={ROOT} preset="fixed">
        <View style={TEXTVIEW}>
          <Dropdown
            style={[DROPDOWN, isFocusDropdown && { borderColor: color.tabBarIcon }]}
            placeholderStyle={PLACEHOLDERSTYLE}
            selectedTextStyle={SELECTEDTEXTSTYLE}
            containerStyle={CONTAINERSTYLE}
            inputSearchStyle={INPUTSEARCH}
            iconStyle={ICONSTYLE}
            data={data}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocusDropdown ? 'Select item' : '...'}
            searchPlaceholder="Search..."
            value={valueDropdown}
            onFocus={() => setIsFocusDropdown(true)}
            onBlur={() => setIsFocusDropdown(false)}
            onChange={item => {
              setValueDropdown(item.value);
              setIsFocusDropdown(false);
            }}
            renderLeftIcon={() => (
              <MaterialCommunityIcons
                style={ICON}
                color={isFocusDropdown ? color.tabBarIcon : color.palette.black}
                name="account"
                size={20}
              />
            )}
          />
          <TextField
            preset="default"
            onChangeText={(value) => setUsername(value)}
            value={username}
            placeholder="Username"
            style={TEXTINPUTSTYLE}
            inputStyle={TEXTINPUTSTYLEOVERRIDE}
          />
          <TextField
            onChangeText={(value) => setPassword(value)}
            value={password}
            placeholder="Password"
            style={TEXTINPUTSTYLE}
            secureTextEntry
            inputStyle={TEXTINPUTSTYLEOVERRIDE}
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
              initValue={preferredHours}
            />

          </View>

        </View>
        <SafeAreaView style={FOOTER}>
          <View style={FOOTER_CONTENT}>
            <Button
              testID="add-button"
              style={BUTTON}
              textStyle={BUTTON_TEXT}
              tx={isUpdateTask ? "home.save" :"home.add"}
              onPress={saveHandler}
            />
            {
              isUpdateTask?
                <Button
                  preset={"delete"}
                  testID="add-button"
                  style={BUTTON}
                  textStyle={BUTTON_TEXT}
                  tx={"home.delete"}
                  onPress={deleteHandler}
                />:null
            }
          </View>
        </SafeAreaView>
      </Screen>
    </View>

  )
})
