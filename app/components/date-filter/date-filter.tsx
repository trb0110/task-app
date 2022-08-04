import * as React from "react"
import { StyleProp, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { color, spacing, typography } from "../../theme"
import { Text } from "../text/text"
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useEffect, useState } from "react"
import { TextField } from "../text-field/text-field"
import DatePicker from "react-native-date-picker"
import moment from "moment"

const CONTAINER: ViewStyle = {
  justifyContent: "flex-end",
  alignItems:"center",
  marginTop:spacing[6]
}

const ICONVIEW: ViewStyle = {
  alignItems:"flex-end",
  width:"100%",
  marginRight:spacing[8],
}
const DATEVIEW: ViewStyle = {
  flexDirection:"row",
  alignItems:"center",
  justifyContent:"space-between"
}

const TEXTINPUTSTYLE: ViewStyle = {
  width:"40%",
  marginHorizontal: spacing[2]
}
const TEXTINPUTSTYLEOVERRIDE: ViewStyle = {
  backgroundColor :color.transparent
}

export interface DateFilterProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  setFromDateHandler?:(date:string)=>void
  setToDateHandler?:(date:string)=>void
}

/**
 * Describe your component here
 */
export const DateFilter = observer(function DateFilter(props: DateFilterProps) {
  const { style,setFromDateHandler, setToDateHandler} = props
  const styles = Object.assign({}, CONTAINER, style)

  const [filterShow, setFilterShow] = useState(false)
  const [openDate, setOpenDate] = useState(false)
  const [from, setFrom] = useState(false)
  const [to, setTo] = useState(false)

  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)

  const setFromHandler = (date)=>{
    setFromDate(date)
    setFromDateHandler(moment(date).format("YYYY-MM-DD").toString())
  }
  const setToHandler = (date)=>{
    setToDate(date)
    setToDateHandler(moment(date).format("YYYY-MM-DD").toString())
  }
  useEffect(()=>{
    if (!filterShow){
      setFromDateHandler(null)
      setToDateHandler(null)
      setFromDate(null)
      setToDate(null)
    }
  },[filterShow])
  return (
    <View style={styles}>
      <DatePicker
        modal
        mode="date"
        open={openDate}
        date={moment().toDate()}
        onConfirm={(date) => {
          setOpenDate(false)
          if (from){
            setFromHandler(date)
          }
          if (to){
            setToHandler(date)
          }
          setTo(false)
          setFrom(false)
        }}
        onCancel={() => {
          setOpenDate(false)
          setTo(false)
          setFrom(false)
        }}
      />
      <View style={ICONVIEW}>
        <TouchableOpacity style={{padding:spacing[2]}} onPress={()=>setFilterShow(!filterShow)} >
          <FontAwesome5 name="sliders-h" color={color.palette.black} size={20}/>
        </TouchableOpacity>
      </View>
      {
        filterShow? <View style={DATEVIEW}>
          <TextField
            onPressIn={()=>{
              setFrom(true)
              setOpenDate(true)
            }}
            editable={false}
            preset="default"
            value={fromDate?.toDateString()}
            placeholder="From Date"
            style={TEXTINPUTSTYLE}
            inputStyle={TEXTINPUTSTYLEOVERRIDE}
          />
          <TextField
            onPressIn={()=>{
              setTo(true)
              setOpenDate(true)
            }}
            editable={false}
            preset="default"
            value={toDate?.toDateString()}
            placeholder="To Date"
            style={TEXTINPUTSTYLE}
            inputStyle={TEXTINPUTSTYLEOVERRIDE}
          />
        </View>:null
      }

    </View>
  )
})
