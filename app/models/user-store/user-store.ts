import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { UserModel, UserSnapshot } from "../user/user"
import { UserApi } from "../../services/api/user-api"

/**
 * Model description here for TypeScript hints.
 */
export const UserStoreModel = types
  .model("UserStore")
  .props({
    users: types.optional(types.array(UserModel),[])
  })
  .views((self) => ({
    saveUsers: (usersSnapshots: UserSnapshot[]) => {
      self.users.replace(usersSnapshots)
    },
  }))
  .actions((self) => ({
    addUser: async (data: { Description: string; UserID: string; Duration: string; Timestamp: string })=>{
      // console.log("ADD TASK   ",data)
      const userApi = new UserApi()
      await userApi.setup()
      const result = await userApi.addUser(data)
      return result.kind
    },
    deleteUser:async (userId)=>{
      const userApi = new UserApi()
      await userApi.setup()
      const result = await userApi.deleteUser(userId)
      return result.kind
    },
    updateUser:async (data: { Description: string; UserID: string; Duration: string; Timestamp: string })=>{
      const userApi = new UserApi()
      await userApi.setup()
      const result = await userApi.updateUser(data)
      return result.kind
    },
    getUsers:async ()=>{
      const userApi = new UserApi()
      await userApi.setup()
      const result = await userApi.getUsers()
      if (result.kind === "ok") {
        return result?.users
      } else {
        __DEV__ && console.tron.log(result.kind)
        return []
      }
    },
    saveUserAction:async (data)=>{
      self.saveUsers(data)
    },
    clearStore:async()=>{
      self.saveUsers([])
    }
  }))
export interface UserStore extends Instance<typeof UserStoreModel> {}
export interface UserStoreSnapshot extends SnapshotOut<typeof UserStoreModel> {}
export interface UserStoreSnapshotIn extends SnapshotIn<typeof UserStoreModel> {}
export const createUserStoreDefaultModel = () => types.optional(UserStoreModel, {})
