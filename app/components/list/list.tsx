import * as React from "react"
import { SafeAreaView, SectionList, SectionListData, StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { color, spacing, typography } from "../../theme"
import { Text } from "../text/text"
import { ItemProps, ListItem } from "../list-item/list-item"
import { useEffect } from "react"

const CONTAINER: ViewStyle = {
  flex:1,
  justifyContent: "center",
}

const TEXT: TextStyle = {
  fontFamily: typography.primary,
  fontSize: 14,
  color: color.palette.lightGrey,
}
const HEADERTEXT: ViewStyle = {
  marginTop:spacing[4],
  justifyContent:"center",
  alignContent:"center",
  alignItems:"center",
}
const SAFEAREA: TextStyle = {
  flex:1,
}
const listpresets = {

  default: "default",
  users: "users",

}
type ListPresets = keyof typeof listpresets
export interface ListProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  data?: ReadonlyArray<SectionListData<ItemProps>> |any[]

  preset?: ListPresets
  admin?: boolean

}


export const List = observer(function List(props: ListProps) {
  const { style,data,preset = "default",admin=false } = props
  const styles = Object.assign({}, CONTAINER, style)

  return (
    <View style={styles}>
      <SafeAreaView style={SAFEAREA}>
          <SectionList
            sections={data}
            keyExtractor={(item, index) => item?.name + index}
            renderItem={({ item }) =><ListItem item={item} preset={preset} admin={admin}/>}
            renderSectionHeader={({ section: { title } }) => (
              <View style={HEADERTEXT}>
                <Text style={TEXT}>{title}</Text>
              </View>
            )}
            stickySectionHeadersEnabled={false}
          />
      </SafeAreaView>
    </View>
  )
})
