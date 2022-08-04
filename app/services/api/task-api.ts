import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import * as Types from "./api.types"
import { DeleteTaskResult, GetTaskResult, PostTaskResult } from "./api.types"
import { loadString } from "../../utils/storage"
import moment from "moment"

/**
 * Manages all requests to the API.
 */
export class TaskApi {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  api: ApisauceInstance

  /**
   * Configurable options.
   */
  config: ApiConfig

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  async setup() {
    const tok = await loadString("token")
    this.api = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "*/*",
        Authorization: `Basic Zm9vOmJhcg==`,
        Connection: "keep-alive",
        "Accept-Encoding": "gzip, deflate, br",
        "Content-Type": "application/json",
        Bearer:tok
      },
    })
  }

  async addTask(data): Promise<PostTaskResult>{
    try {
      console.log(data)
      const response: ApiResponse<any> = await this.api.post(
        "task/", data
      )
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      const tasks = response.data.tasks

      return { kind: "ok", tasks }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async getTasks(startdate?:string, enddate?:string): Promise<GetTaskResult>{
    const userId = await loadString("id")
    try {

      let params = {userid: userId}
      if(startdate&&startdate?.length>0){
        params.startdate=startdate
      }
      if(enddate&&enddate?.length>0){
        params.enddate=enddate
      }
      console.log(params)
      const response: ApiResponse<any> = await this.api.get(
        "task/",
         params
      )
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const tasks = response.data.tasks

      return { kind: "ok", tasks }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async updateTask(data): Promise<PostTaskResult> {
    try {
      const response: ApiResponse<any> = await this.api.put(
        "task/", data
      )
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      const tasks = response.data.tasks

      return { kind: "ok", tasks }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async deleteTask(taskId): Promise<DeleteTaskResult> {
    try {
      const response: ApiResponse<any> = await this.api.delete(
        "task/"+taskId
      )

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      return { kind: "ok" }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
}
