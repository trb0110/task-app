import { Instance,SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { TaskModel, TaskSnapshotOut } from "../task/task"
import { withEnvironment } from "../extensions/with-environment"
import { TaskApi } from "../../services/api/task-api"

/**
 * Model description here for TypeScript hints.
 */
export const TaskStoreModel = types
  .model("TaskStore")
  .props({
    tasks: types.optional(types.array(TaskModel),[])
  })
  .extend(withEnvironment)
  .views((self) => ({
    saveTasks: (taskSnapshots: TaskSnapshotOut[]) => {
      self.tasks.replace(taskSnapshots)
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    addTask: async (data: { Description: string; UserID: string; Duration: string; Timestamp: string })=>{
      // console.log("ADD TASK   ",data)
      const taskAPI = new TaskApi()
      await taskAPI.setup()
      const result = await taskAPI.addTask(data)
      return result.kind
    },
    deleteTask:async (taskId)=>{
      const taskAPI = new TaskApi()
      await taskAPI.setup()
      const result = await taskAPI.deleteTask(taskId)
      return result.kind
    },
    updateTask:async (data: { Description: string; UserID: string; Duration: string; Timestamp: string })=>{
      const taskAPI = new TaskApi()
      await taskAPI.setup()
      const result = await taskAPI.updateTask(data)
      return result.kind
    },
    getTasks:async (startdate?:string, enddate?:string)=>{
      const taskAPI = new TaskApi()
      await taskAPI.setup()
      const result = await taskAPI.getTasks(startdate, enddate)
      if (result.kind === "ok") {
        return result?.tasks
      } else {
        __DEV__ && console.tron.log(result.kind)
        return []
      }
    },
    saveTaskAction:async (data)=>{
      self.saveTasks(data)
    },
    clearStore:async()=>{
      self.saveTasks([])
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface TaskStore extends Instance<typeof TaskStoreModel> {}
export interface TaskStoreSnapshot extends SnapshotOut<typeof TaskStoreModel> {}
export interface TaskStoreSnapshotIn extends SnapshotIn<typeof TaskStoreModel> {}
export const createTaskStoreDefaultModel = () => types.optional(TaskStoreModel, {})

