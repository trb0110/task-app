import React from "react"
import { StyleProp, TextInput, TextInputProps, TextStyle, View, ViewStyle } from "react-native"
import { color, spacing, typography } from "../../theme"
import { translate, TxKeyPath } from "../../i18n"
import { Text } from "../text/text"

// the base styling for the container
const CONTAINER: ViewStyle = {
  height:60,
  paddingVertical: spacing[1],
}

const SUBSTYLE: ViewStyle = {
  height:30,
  marginTop:spacing[5],
}

// the base styling for the TextInput
const INPUT: TextStyle = {
  fontFamily: typography.primary,
  color: color.text,
  fontSize: 18,
  backgroundColor: color.palette.white,
}

// currently we have no presets, but that changes quickly when you build your app.
const PRESETS: { [name: string]: ViewStyle } = {
  default: {
    borderColor:color.palette.inputBorder,
    borderWidth:2,
    borderRadius:10,
    marginHorizontal:spacing[5],
    paddingHorizontal:spacing[4]
  },
}

export interface TextFieldProps extends TextInputProps {
  /**
   * The placeholder i18n key.
   */
  placeholderTx?: TxKeyPath

  /**
   * The Placeholder text if no placeholderTx is provided.
   */
  placeholder?: string

  /**
   * The label i18n key.
   */
  labelTx?: TxKeyPath

  subTx?:TxKeyPath

  /**
   * The label text if no labelTx is provided.
   */
  label?: string

  /**
   * Optional container style overrides useful for margins & padding.
   */
  style?: StyleProp<ViewStyle>

  /**
   * Optional style overrides for the input.
   */
  inputStyle?: StyleProp<TextStyle>

  /**
   * Various look & feels.
   */
  preset?: keyof typeof PRESETS

  forwardedRef?: any
}

/**
 * A component which has a label and an input together.
 */
export function TextField(props: TextFieldProps) {
  const {
    placeholderTx,
    placeholder,
    labelTx,
    subTx,
    label,
    preset = "default",
    style: styleOverride,
    inputStyle: inputStyleOverride,
    forwardedRef,
    ...rest
  } = props

  const containerStyles = [CONTAINER, PRESETS[preset], styleOverride]
  const inputStyles = [INPUT, inputStyleOverride]
  const actualPlaceholder = placeholderTx ? translate(placeholderTx) : placeholder

  return (
      <View style={containerStyles}>
        <Text preset="fieldLabel" tx={labelTx} text={label} />
        <TextInput
          placeholder={actualPlaceholder}
          placeholderTextColor={color.palette.lightGrey}
          underlineColorAndroid={color.transparent}
          {...rest}
          style={inputStyles}
          ref={forwardedRef}
        />
        <View style={SUBSTYLE}>
          <Text preset="fieldLabel" tx={subTx} />
        </View>
      </View>
  )
}
