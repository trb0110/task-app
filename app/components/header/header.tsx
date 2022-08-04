import React from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { HeaderProps } from "./header.props"
import { Button } from "../button/button"
import { Text } from "../text/text"
import { Icon } from "../icon/icon"
import { spacing } from "../../theme"
import { translate } from "../../i18n/"

// static styles
const ROOT: ViewStyle = {
  flexDirection: "row",
  paddingHorizontal: spacing[4],
  alignItems: "center",
  paddingTop: spacing[5],
  paddingBottom: spacing[5],
  justifyContent: "flex-start",
}
const SHADOWSTYLE ={
  shadowOffset: {
    width: 0,
    height: 5
  },
  shadowOpacity:0.1,
  shadowRadius:5
}
const TITLE: TextStyle = { textAlign: "center" }
const TITLE_MIDDLE: ViewStyle = {
  flex: 1,
  justifyContent: "center",
}
const LEFT: ViewStyle = { width: 32 }
const RIGHT: ViewStyle = { width: 32 }

/**
 * Header that appears on many screens. Will hold navigation buttons and screen title.
 */
export function Header(props: HeaderProps) {
  const {
    onLeftPress,
    onRightPress,
    rightIcon,
    leftIcon,
    headerText,
    headerTx,
    style,
    titleStyle,
    withShadow=true,
    rightMaterialIcon=false
  } = props
  const header = headerText || (headerTx && translate(headerTx)) || ""

  const finalStyle = withShadow?[ROOT, style,SHADOWSTYLE]:[ROOT, style]
  return (
    <View style={finalStyle}>
      {leftIcon ? (
        <Button preset="link" onPress={onLeftPress}>
          <Icon icon={leftIcon} containerStyle={LEFT}/>
        </Button>
      ) : (
        <View style={LEFT} />
      )}
      <View style={TITLE_MIDDLE}>
        <Text style={[TITLE, titleStyle]} text={header} />
      </View>
      {rightIcon ? (
        <Button preset="link" onPress={onRightPress}>
          <Icon icon={rightIcon} materialIcon={rightMaterialIcon} containerStyle={RIGHT} />
        </Button>
      ) : (
        <View style={RIGHT} />
      )}
    </View>
  )
}
