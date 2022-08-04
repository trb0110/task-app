import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const TaskModel = types.model("Task").props({
    TaskId: types.maybe(types.string),
    Timestamp: types.maybe(types.string),
    Description: types.maybe(types.string),
    Duration: types.maybe(types.string),
    UserID: types.maybe(types.string),
    Username: types.maybe(types.string),
  })

export interface Task extends Instance<typeof TaskModel> {}
export interface TaskSnapshotOut extends SnapshotOut<typeof TaskModel> {}
export interface TaskSnapshotIn extends SnapshotIn<typeof TaskModel> {}
export const createTaskDefaultModel = () => types.optional(TaskModel, {})
