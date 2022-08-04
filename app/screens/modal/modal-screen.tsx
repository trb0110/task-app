import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, SafeAreaView, TextStyle, ImageStyle, Alert } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { Button, DurationPicker, Screen, Text, TextField } from "../../components"
import { useRoute } from '@react-navigation/native';
import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color, spacing, typography } from "../../theme"
import DatePicker from "react-native-date-picker"
import { Dropdown } from 'react-native-element-dropdown';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from "moment"
import { loadString } from "../../utils/storage"
import {
  convertDurationStringToMinutes,
  convertDurationToInputString,
  convertDurationToString,
} from "../../utils/duration"
import { TaskModel } from "../../models/task/task"
import { useStores } from "../../models"

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


const FORMVIEW: ViewStyle = {
  marginHorizontal:spacing[6],
  justifyContent:"center"
}
const DROPDOWN: ViewStyle = {
  height: 50,
  borderColor: color.palette.inputBorder,
  borderWidth: 0.5,
  borderRadius: 8,
  paddingHorizontal: spacing[4],
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
const PLACEHOLDERSTYLE: TextStyle = {
  fontSize: 16,
}
const SELECTEDTEXTSTYLE: TextStyle = {
  fontSize: 16,
}
const INPUTSEARCH: TextStyle = {
  height: 40,
  fontSize: 16,
  borderRadius: 8,
}

const TEXTINPUTSTYLE: ViewStyle = {
  marginBottom: spacing[4],
  marginTop:spacing[6],
  marginHorizontal: spacing[0]
}
const TEXTINPUTSTYLEOVERRIDE: ViewStyle = {
  backgroundColor :color.modalBackground
}

const DATETEXT: TextStyle = {
  color:color.palette.black,
  marginHorizontal:spacing[4]
}

const DATEPICKERVIEW: ViewStyle = {
  height: 100,
  flexDirection:"row",
  justifyContent:"space-between",
  alignItems:"center",
}
interface ModalProps {
  isUpdateTask?: boolean
}
export const ModalScreen: FC<StackScreenProps<NavigatorParamList, "modal">> = observer(function ModalScreen(props:ModalProps) {

  const { taskStore } = useStores()

  const navigation = useNavigation()
  const route = useRoute();

  const [date, setDate] = useState(moment().toDate())
  const [time, setTime] = useState(moment().toDate())
  const [timeString, setTimeString] = useState("")
  const [openDate, setOpenDate] = useState(false)
  const [openTime, setOpenTime] = useState(false)
  const [isUpdateTask, setIsUpdateTask] = useState(false)
  const [userRole, setUserRole] = useState("3")
  const [item, setItem] = useState({})

  const [valueDropdown, setValueDropdown] = useState(null);
  const [isFocusDropdown, setIsFocusDropdown] = useState(false);
  const [taskDescription,setTaskDescription] = useState<string>("")

  const [duration, setDuration] = useState('');
  const [durationPicker, setDurationPicker] = useState(false);
  const [usersData, setUsersData] = useState([])

  useEffect(()=>{
    if (route?.params?.isUpdate){
      setIsUpdateTask(route?.params?.isUpdate)
    }
    if (route?.params?.role){
      setUserRole(route?.params?.role)
    }
    if (route?.params?.usersData &&route?.params?.role==="1"){
      setUsersData(route?.params?.usersData)
    }
    if (route?.params?.isUpdate===true){
      if (route?.params?.item){
        // console.log(route?.params?.item)
        const dateString = route?.params?.item?.date.split(" ")[0]
        const timeStringParam = route?.params?.item?.date.split(" ")[1]
        const durationString = route?.params?.item?.duration
        const descString = route?.params?.item?.name

        setDate(new Date(dateString))
        setTaskDescription(descString)
        setTimeString(timeStringParam)
        setDuration(convertDurationToInputString(durationString))
        setItem(route?.params?.item)
      }
    }
  },[route?.params])

  const saveHandler =  async () => {
    // navigation.navigate("homeStack")
    // console.log(taskDescription)
    // console.log(duration)
    // console.log(moment(date).format("YYYY-MM-DD"))
    // console.log(timeString)
    const finalDate = moment(date).format("YYYY-MM-DD") + " " + timeString
    const userId = await loadString("id")
    const finalDuration = convertDurationStringToMinutes(duration)
    const role = await loadString("role")

    let selectedUser = ""
    if (role ==="1"&& !isUpdateTask){
      const selectedUserId = usersData[valueDropdown]?.userId
      selectedUser=selectedUserId
    }else{
      selectedUser = userId
    }
    const body = {
      Duration: finalDuration.toString(),
      Description: taskDescription,
      UserID:selectedUser,
      Timestamp:finalDate
    }

    if (isUpdateTask){
      body.TaskId = item?.taskId
    }

    console.log(body)
    const result = isUpdateTask?await taskStore.updateTask(body):await taskStore.addTask(body)
    setTimeout(() => {
      Alert.alert(
        result==="ok"?"Successful":result,
        "",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("home"),
            style: "cancel",
          },
        ],
        {
          cancelable: true,
        },
      )
    },1500)
  }
  console.log(date)
  console.log(time)
  console.log(timeString)
  const deleteHandler =  async () => {
    const result = await taskStore.deleteTask(item?.taskId)
    setTimeout(() => {
      Alert.alert(
        result==="ok"?"Successful":result,
        "",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("home"),
            style: "cancel",
          },
        ],
        {
          cancelable: true,
        },
      )
    },1500)
    // navigation.navigate("homeStack")
  }

  const renderForm = ()=>{
    return (
      <View style={FORMVIEW}>
        <DatePicker
          modal
          mode="date"
          open={openDate}
          date={date}
          onConfirm={(date) => {
            setOpenDate(false)
            setDate(date)
          }}
          onCancel={() => {
            setOpenDate(false)
          }}
        />
        <DatePicker
          modal
          mode="time"
          open={openTime}
          date={time}
          timeZoneOffsetInMinutes={0}
          onConfirm={(time) => {
            const hoursTemp = time.getUTCHours().toString();
            const minutesTemp = time.getUTCMinutes().toString();
            const hoursFinal = hoursTemp?.length<2? `0${hoursTemp}`:hoursTemp
            const minutesFinal = minutesTemp?.length<2? `0${minutesTemp}`:minutesTemp
            setOpenTime(false)
            setTime(time)
            setTimeString(hoursFinal+":"+minutesFinal)
          }}
          onCancel={() => {
            setOpenTime(false)
          }}
        />
        {
          userRole==="1" && !isUpdateTask?
            <Dropdown
              style={[DROPDOWN, isFocusDropdown && { borderColor: color.tabBarIcon }]}
              placeholderStyle={PLACEHOLDERSTYLE}
              selectedTextStyle={SELECTEDTEXTSTYLE}
              containerStyle={CONTAINERSTYLE}
              inputSearchStyle={INPUTSEARCH}
              iconStyle={ICONSTYLE}
              data={usersData}
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
            :null
        }
        <TextField
          preset="default"
          onChangeText={(value) => setTaskDescription(value)}
          value={taskDescription}
          placeholder="Task Description"
          style={TEXTINPUTSTYLE}
          inputStyle={TEXTINPUTSTYLEOVERRIDE}
        />
        <View style={DATEPICKERVIEW}>

          <Text preset="default" tx={"home.date"} style={DATETEXT} />
          <TextField
            onPressIn={()=>{setOpenDate(true)}}
            editable={false}
            preset="default"
            value={date?.toDateString()}
            placeholder="YYYY-MM-DD"
            style={TEXTINPUTSTYLE}
            inputStyle={TEXTINPUTSTYLEOVERRIDE}
          />
        </View>
        <View style={DATEPICKERVIEW}>

          <Text preset="default" tx={"home.time"} style={DATETEXT} />
          <TextField
            onPressIn={()=>{setOpenTime(true)}}
            editable={false}
            preset="default"
            value={timeString}
            placeholder="HH:MM"
            style={TEXTINPUTSTYLE}
            inputStyle={TEXTINPUTSTYLEOVERRIDE}
          />
        </View>
        <View style={DATEPICKERVIEW}>

          <Text preset="default" tx={"home.duration"} style={DATETEXT} />
          <TextField
            onPressIn={()=>{setDurationPicker(true)}}
            editable={false}
            preset="default"
            value={duration}
            placeholder="HH:MM"
            style={TEXTINPUTSTYLE}
            inputStyle={TEXTINPUTSTYLEOVERRIDE}
          />
        </View>
      </View>
    )
  }
  const selectDuration =(time)=>{
    setDuration(time)
    setDurationPicker(false)
  }
  const renderDurationPicker = ()=> {
    return (
      <DurationPicker onSelect={selectDuration}/>
    )
  }
  return (
    <View testID="Modal" style={FULL}>

      <Screen style={ROOT} preset="fixed">
        {durationPicker?renderDurationPicker():renderForm()}
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

