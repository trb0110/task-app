import { TaskModel } from "./task"

test("can be created", () => {
  const instance = TaskModel.create({})

  expect(instance).toBeTruthy()
})
