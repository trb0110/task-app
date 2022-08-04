import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import * as Types from "./api.types"

/**
 * Manages all requests to the API.
 */
export class Api {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  apisauce: ApisauceInstance

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
  setup() {
    // construct the apisauce instance
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "*/*",
        Authorization: `Basic Zm9vOmJhcg==`,
        Connection: "keep-alive",
        "Accept-Encoding": "gzip, deflate, br",
        "Content-Type": "application/json",
      },
    })
  }


  async login(username: string, pass: string): Promise<Types.GetLoginResult> {
    // make the api call
    const bodyData = {
      Username: username,
      Password: pass,
    }
    // console.log(bodyData)
    const response: ApiResponse<any> = await this.apisauce.post(`login`, bodyData)

    // console.log(response)

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    const convertUser = (raw) => {
      const data = {
        id: raw.user.UserID,
        name: raw.user.Username,
        role: raw.user.Role,
        token: raw.user.Token,
        preferredHours:raw.user.PreferredHours
      }
      return data
    }

    // transform the data into the format we are expecting
    try {
      const rawL = response.data
      const resultLogin: Types.User = convertUser(rawL)
      // console.log(resultLogin)
      return { kind: "ok", loginResult: resultLogin }
    } catch {
      return { kind: "bad-data" }
    }
  }

  async signUp(username: string, pass: string,hours?: string|number): Promise<Types.GetSignupResult> {
    // make the api call
    const bodyData = {
      Username: username,
      Password: pass,
      Role: "3",
      PreferredHours:hours?.toString()
    }
    // console.log(bodyData)
    const response: ApiResponse<any> = await this.apisauce.post(`user`, bodyData)

    // console.log(response)

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    const convertUser = (raw) => {
      const data = {
        resp: raw.resp
      }
      return data
    }

    // transform the data into the format we are expecting
    try {
      const rawL = response.data
      const resultSignUp: Types.HttpResponse = convertUser(rawL)
      // console.log(resultLogin)
      return { kind: "ok", signUpResult: resultSignUp }
    } catch {
      return { kind: "bad-data" }
    }
  }
}
