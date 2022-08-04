import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Alert, TextStyle, View, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AuthContext, NavigatorParamList } from "../../navigators"
import { DateFilter, GradientBackground, Header, ItemProps, List, ListItem, Screen } from "../../components"
import { useNavigation } from "@react-navigation/native"
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FloatingAction } from "react-native-floating-action";
// import { useStores } from "../../models"
import { color, typography } from "../../theme"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { Dirs, FileSystem } from 'react-native-file-access';
import { convertDurationToString } from "../../utils/duration"
import { loadString } from "../../utils/storage"
import { Task, useStores } from "../../models"
import moment from "moment"

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
const ACTIONBUTTONSTYLE : ViewStyle={
  width:60,
  height:60,
  backgroundColor:color.tabBarIcon,
  justifyContent:"center",
  alignItems:"center",
  alignContent:"center",
  borderRadius:10,

}
const actions = [
  {
    icon: <MaterialIcons name="add-task" color={color.palette.white} size={20} />,
    name: "add",
    position: 1,
    color:color.tabBarIcon
  },
  {
    icon: <MaterialCommunityIcons name="calendar-export" color={color.palette.white} size={20} />,
    name: "export",
    position: 2,
    color:color.tabBarIcon
  }
];

const itemDataInitial:ItemProps = {
  name:"",
  date:"",
  duration:0
}

const INITIALDATA = [
  {
    title: "",
    data: []
  },
];
export const HomeScreen: FC<StackScreenProps<NavigatorParamList, "home">> = observer(function HomeScreen() {

  const { taskStore ,userStore} = useStores()
  const { tasks } = taskStore
  const { users } = userStore
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation()
  const [listData, setListData] = useState(INITIALDATA)
  const [usersData, setUsersData] = useState([])
  const [refreshData, setRefreshData] = useState(false)
  const [getUsersData, setGetUsersData] = useState(false)
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)
  const [userRole, setUserRole] = useState("3")
  // const [dailyHoursMap, setDailyHoursMap] = useState(null)

  const { signOut } = React.useContext(AuthContext)

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData()
      setRefreshData(true)
      checkRole()
    });
    return unsubscribe;
  }, [navigation]);
  useEffect(() => {
    if (refreshData){
      (async ()=>{
        const hours = await loadString("hours")
        const h = parseInt(hours) *60
        console.log("REFRESH")
        const finalDataArray: any[] = []
        let dates=[]
        const tasksMap = new Map<string, any[]>()
        const hoursMetMap = new Map<string, number>()
        tasks?.map((task) => {

          const name = task?.Description
          const date = task?.Timestamp.substring(0, task?.Timestamp.length - 4).replace("T"," ");
          const duration = parseInt(task?.Duration)
          const username = task?.Username
          const userId = task?.UserID
          const taskId = task?.TaskId

          const itemData = {
            name,date,duration,username,userId,taskId
          }
          const dateString = moment(task?.Timestamp).format("YYYY-MM-DD")
          if (!dates.includes(dateString)) {
            dates.push(dateString)
          }
          const taskSection = tasksMap.get(dateString) || []
          const newTaskSection = [...taskSection, itemData]
          tasksMap.set(dateString, newTaskSection)

          const hoursSection = hoursMetMap.get(dateString) || 0
          const newHoursSection = hoursSection +duration
          hoursMetMap.set(dateString, newHoursSection)
        })
        dates.map((d) => {
          const hoursTemp = hoursMetMap.get(d)
          const tempData = tasksMap.get(d)
          const hoursMet = hoursTemp>=h
          const finalDataPoint = tempData.map((item)=>{
            return {...item,hoursMet }
          })
          const taskData = { title: d, data: finalDataPoint }
          finalDataArray.push(taskData)
        })
        if (finalDataArray&&finalDataArray?.length>0){
          setListData(finalDataArray)
        }
        setRefreshData(false)

      })()

    }
  }, [refreshData]);
  useEffect(() => {
    if (getUsersData){
      const finalDataArray: any[] = []
      users?.map((user,index) => {
        const name = user?.Username
        const userId = user?.UserID
        const preferedHours = user?.PreferredHours
        const role = user?.Role
        const label= name
        const value= index
        const itemData = {
          name,userId,preferedHours,role,label,value
        }
        finalDataArray.push(itemData)
      })

      if (finalDataArray&&finalDataArray?.length>0){
        setUsersData(finalDataArray)
      }
      setGetUsersData(false)
    }
  }, [getUsersData]);

  useEffect(() => {
    if (fromDate||toDate){
      setTimeout(async () => {
        const tasks = await taskStore.getTasks(fromDate,toDate)
        await taskStore.saveTaskAction(tasks)
        setRefreshData(true)
      },1500)
    }else{
      setTimeout(async () => {
        await fetchData()
        setRefreshData(true)
      },1500)
    }
  }, [fromDate,toDate]);
  async function fetchData() {
    const tasks = await taskStore.getTasks()
    await taskStore.saveTaskAction(tasks)
    setRefreshData(true)
  }
  async function checkRole() {
    const role = await loadString("role")
    setUserRole(role)
    if (role ==="1"){
      const users = await userStore.getUsers()
      await userStore.saveUserAction(users)
      setGetUsersData(true)
    }
  }
  const buttonActionHandler = async (name)=>{
    const role = await loadString("role")

    switch (name){
      case "add":
        navigation.navigate("modal",{
          isUpdate: false,
          role,
          usersData
        })
        break
      case "export":
        await exportData()
        break
      default:
        break
    }
  }

  const exportData = async () =>{
    const fileName = 'tasks.txt';
    const filePath = `${Dirs.DocumentDir}/${fileName}`;
    const textToWrite  = await formatDataForFile()
    await FileSystem.writeFile(filePath, textToWrite);
    setTimeout(() => {
    Alert.alert(
        "Success",
        "Export Successful",
        [
          {
            text: "OK",
            style: "cancel",
          },
        ],
        {
          cancelable: true,
        },
      )
    },1500)
  }
  const formatDataForFile = async()=> {
    let textToWrite = ""
    listData?.map((item)=>{
      const title = item.title
      textToWrite += "◦ Date: " + title

      textToWrite += "\n"

      let totalDuration = 0
      let tasksToWrite =""
      const tasksTitleWrite ="◦ Notes: \n"
      item?.data?.map((task) => {
        const taskD = parseInt(task?.duration)
        const taskName = task.name
        totalDuration += taskD
        tasksToWrite += "    ◦ " + taskName
        tasksToWrite += "\n"
      })
      const durationString = convertDurationToString(totalDuration)
      const totalTimeString = "◦ Total Time: " + durationString + "\n"
      textToWrite += totalTimeString
      textToWrite += tasksTitleWrite
      textToWrite += tasksToWrite
      textToWrite += "\n"
      textToWrite += "\n"
    })
    return textToWrite
  }

  return (
    <View testID="Home" style={FULL}>
      <GradientBackground colors={[color.backgroundWhite , color.backgroundWhite]} />
      <Screen style={CONTAINER} preset="fixed" backgroundColor={color.transparent} tabBarHeight={tabBarHeight}>
        <Header
          headerTx="home.home"
          style={HEADER}
          titleStyle={HEADER_TITLE}
          rightMaterialIcon
          rightIcon="logout"
          onRightPress={()=>{signOut()}}
        />
        <DateFilter setFromDateHandler={setFromDate} setToDateHandler={setToDate}/>
        <List data={listData} admin={userRole==="1"}/>
        <FloatingAction
          actions={actions}
          onPressItem={buttonActionHandler}
          distanceToEdge={25}
          overlayColor={color.transparent}
          showBackground={true}
          color={color.tabBarIcon}
          floatingIcon={
            <View style={ACTIONBUTTONSTYLE}>
              <MaterialCommunityIcons name="plus" color={color.palette.white} size={50} />
            </View>
          }
        />
      </Screen>
    </View>
  )
})
