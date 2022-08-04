import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AuthContext, NavigatorParamList } from "../../navigators"
import { GradientBackground, Header, ItemProps, List, Screen, Text } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color, typography } from "../../theme"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { useNavigation } from "@react-navigation/native"
import { FloatingAction } from "react-native-floating-action"
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useStores } from "../../models"
import moment from "moment"
import { loadString } from "../../utils/storage"


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
    icon: <MaterialIcons name="person-add" color={color.palette.white} size={20} />,
    name: "addUser",
    position: 1,
    color:color.tabBarIcon
  },
];

const itemData:ItemProps = {
  name:"",
  userId:"",
  preferedHours:"",
  role:""
}

const DATA = [
  {
    title: "",
    data: [itemData]
  },
];
export const UsersScreen: FC<StackScreenProps<NavigatorParamList, "users">> = observer(function UsersScreen() {


  const { userStore } = useStores()
  const { users } = userStore

  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation()
  const [listData, setListData] = useState(DATA)
  const [refreshData, setRefreshData] = useState(false)


  const { signOut } = React.useContext(AuthContext)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData()
      setRefreshData(true)
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (refreshData){
      console.log("REFRESH")
      const finalDataArray: any[] = []
      users?.map((user) => {
        const name = user?.Username
        const userId = user?.UserID
        const preferedHours = user?.PreferredHours
        const role = user?.Role
        const itemData = {
          name,userId,preferedHours,role
        }
        finalDataArray.push(itemData)
      })

      if (finalDataArray&&finalDataArray?.length>0){
        const dataList = [{
          title: "",
          data:finalDataArray
        }]
        setListData(dataList)
      }
      setRefreshData(false)
    }
  }, [refreshData]);
  async function fetchData() {
    const users = await userStore.getUsers()
    await userStore.saveUserAction(users)
    setRefreshData(true)
  }
  const buttonActionHandler = async (name)=>{
    const role = await loadString("role")
    navigation.navigate("modalUser",{
      isUpdate: false,
      role
    })
  }
  return (
    <View testID="Home" style={FULL}>
      <GradientBackground colors={[color.backgroundWhite , color.backgroundWhite]} />
      <Screen style={CONTAINER} preset="fixed" backgroundColor={color.transparent} tabBarHeight={tabBarHeight}>
        <Header
          headerTx="home.users"
          style={HEADER}
          titleStyle={HEADER_TITLE}
          rightMaterialIcon
          rightIcon="logout"
          onRightPress={()=>{signOut()}}
        />
        <List data={listData}  preset="users" />
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
