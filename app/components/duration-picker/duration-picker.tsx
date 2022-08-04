import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { color, typography } from "../../theme"
import { Text } from "../text/text"
import DatePicker from 'react-native-modern-datepicker';
import { useState } from "react"
const CONTAINER: ViewStyle = {
  justifyContent: "center",
}


const DURATION = {
  backgroundColor:color.transparent,
  mainColor: color.tabBarIcon,
  textSecondaryColor: '#D6C7A1',
  borderRadius: 100
}


export interface DurationPickerProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  onSelect?: (time: any) => void

}
/**
 * Describe your component here
 */
export const DurationPicker = observer(function DurationPicker(props: DurationPickerProps) {
  const { style,onSelect } = props
  const styles = Object.assign({}, CONTAINER, style)
  const [time, setTime] = useState('');
  return (
    <View style={styles}>
      <DatePicker
        mode="time"
        minuteInterval={1}
        onTimeChange={selectedTime => {
          setTime(selectedTime)
          onSelect(selectedTime)
        }}
        options={DURATION}
      />
    </View>
  )
})
