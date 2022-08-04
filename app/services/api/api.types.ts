import { GeneralApiProblem } from "./api-problem"
import { Task } from "../../models"

export interface User {
  id: number
  name: string
  password?: string
  role?: string
  token?: string
  preferredHours?:string
}
export interface HttpResponse {
  resp?: string
}

export type GetLoginResult = { kind: "ok"; loginResult: User } | GeneralApiProblem
export type GetSignupResult = { kind: "ok"; signUpResult: HttpResponse } | GeneralApiProblem


export type PostTaskResult = { kind: "ok"; tasks: Task } | GeneralApiProblem
export type DeleteTaskResult = { kind: "ok"} | GeneralApiProblem
export type GetTaskResult = { kind: "ok"; tasks: Task[] } | GeneralApiProblem

export type PostUserResult = { kind: "ok"; users: User } | GeneralApiProblem
export type DeleteUserResult = { kind: "ok"} | GeneralApiProblem
export type GetUsersResult = { kind: "ok"; users: User[] } | GeneralApiProblem
export type GetUserResult = { kind: "ok"; user: User } | GeneralApiProblem

