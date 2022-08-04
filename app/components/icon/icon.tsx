import * as React from "react"
import { View, ImageStyle } from "react-native"
import { AutoImage as Image } from "../auto-image/auto-image"
import { IconProps } from "./icon.props"
import { icons } from "./icons"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { color } from "../../theme"

const ROOT: ImageStyle = {
  resizeMode: "contain",
}

export function Icon(props: IconProps) {
  const { style: styleOverride, icon, containerStyle,materialIcon=false } = props
  return materialIcon?(
    <View style={containerStyle}>
      <MaterialCommunityIcons name={icon} size={27} color={color.tabBarIcon} />
    </View>
  ):(
    <View style={containerStyle}>
      <Image style={[ROOT, styleOverride]} source={icons[icon]} />
    </View>
  )

}
