import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const UserModel = types
  .model("User")
  .props({
    UserID: types.maybe(types.string),
    Username: types.maybe(types.string),
    Password: types.maybe(types.string),
    Role: types.maybe(types.string),
    PreferredHours: types.maybe(types.string),
  })

export interface User extends Instance<typeof UserModel> {}
export interface UserSnapshot extends SnapshotOut<typeof UserModel> {}
export interface UserSnapshotIn extends SnapshotIn<typeof UserModel> {}
export const createUserDefaultModel = () => types.optional(UserModel, {})

