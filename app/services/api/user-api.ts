import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import { loadString } from "../../utils/storage"
import {
  DeleteTaskResult,
  DeleteUserResult,
  GetTaskResult,
  GetUsersResult,
  PostTaskResult,
  PostUserResult,
} from "./api.types"

/**
 * Manages all requests to the API.
 */
export class UserApi {
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

  async addUser(data): Promise<PostUserResult>{
    try {
      const response: ApiResponse<any> = await this.api.post(
        "user", data
      )
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      const users = response.data.user

      return { kind: "ok", users }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async getUsers(): Promise<GetUsersResult>{
    const userId = await loadString("id")
    try {
      const response: ApiResponse<any> = await this.api.get(
        "user/",

        { userid: userId },
      )
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const users = response.data.user

      return { kind: "ok", users }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async updateUser(data): Promise<PostUserResult> {
    try {
      const response: ApiResponse<any> = await this.api.put(
        "user/", data
      )
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }
      const users = response.data.user

      return { kind: "ok", users }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }

  async deleteUser(userId): Promise<DeleteUserResult> {
    try {
      const response: ApiResponse<any> = await this.api.delete(
        "user/"+userId
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
