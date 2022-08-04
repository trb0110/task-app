import * as React from "react"
import { StyleProp, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { color, spacing, typography } from "../../theme"
import { Text } from "../text/text"
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { convertDurationToString } from "../../utils/duration"
import { loadString } from "../../utils/storage"
import { useNavigation } from "@react-navigation/native"

const CONTAINER: ViewStyle = {
  flexDirection:"row",
  borderWidth:1,
  borderColor:color.palette.lighterGrey,
  height:100,
  justifyContent: "flex-start",
  marginVertical:spacing[4],
  marginHorizontal:spacing[6],
  borderRadius:20
}

const TEXT: TextStyle = {
  fontFamily: typography.primary,
  fontSize: 14,
  color: color.text,
}
const ITEMTEXT: ViewStyle = {
  height:75,
  flexDirection:"column",
  alignSelf:"center",
  justifyContent: "space-between"
}

const INLINEVIEW: ViewStyle = {
  flexDirection:"row",
}
const TOUCHABLESTYLE: ViewStyle = {
  alignSelf:"center",
  justifyContent: "center"
}
const IMAGESTYLE: ViewStyle = {

  height:100,
  width:100,
  justifyContent:"center",
  alignContent:"center",
  alignItems:"center",
  borderRadius:15
}

const listItempresets = {

  default: "default",
  users: "users",

}
type ListItemPresets = keyof typeof listItempresets
export interface  ItemProps{
  name?: string
  username?: string
  userId?: string
  preferedHours?: string
  date?: string
  duration?: string|number
  taskId?:string
  role?:string
  hoursMet?:boolean
}
export interface ListItemProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  item?: ItemProps

  preset?: ListItemPresets
  admin?: boolean
}

/**
 * Describe your component here
 */
export const ListItem = observer(function ListItem(props: ListItemProps) {
  const { style ,item,preset="default",admin=false} = props
  const styles = Object.assign({}, CONTAINER, style)

  const navigation = useNavigation()
  const onPressItem = async () =>{
    const role = await loadString("role")
    navigation.navigate("modal",{
      isUpdate: true,
      role,
      item:item
    })
  }
  const onPressItemUser = async () =>{
    const role = await loadString("role")
    navigation.navigate("modalUser",{
      isUpdate: true,
      role,
      item:item
    })
  }
  const renderItemDefault = ()=>{

    const finalStyle= Object.assign({}, styles, {backgroundColor:item?.hoursMet?color.palette.green:color.palette.red})
    return (

      <View style={admin ? styles: finalStyle}>
      <TouchableOpacity style={TOUCHABLESTYLE} onPress={onPressItem}>
        <View style={INLINEVIEW}>
          <View style={IMAGESTYLE}>
            <MaterialIcons name="add-task" color={color.palette.black} size={50} />
          </View>
          <View style={ITEMTEXT}>
            <Text style={TEXT}>Name: {item?.name}</Text>
            <Text style={TEXT}>Date: {item?.date}</Text>
            <Text style={TEXT}>Duration: {convertDurationToString(item?.duration)}</Text>
          </View>
        </View>
      </TouchableOpacity>
      </View>
    )
  }
  const renderItemUsers = ()=>{
    return (

      <View style={styles}>
        <TouchableOpacity style={TOUCHABLESTYLE} onPress={onPressItemUser}>
          <View style={INLINEVIEW}>
            <View style={IMAGESTYLE}>
              <MaterialIcons name="verified-user" color={color.palette.black} size={50} />
            </View>
            <View style={ITEMTEXT}>
              <Text style={TEXT}>Username: {item?.name}</Text>
              <Text style={TEXT}>User Id: {item?.userId}</Text>
              <Text style={TEXT}>Preferred Hours: {item?.preferedHours}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )

  }
  return (
    <>
      {preset===listItempresets.default?renderItemDefault():renderItemUsers()}
    </>
  )
})
