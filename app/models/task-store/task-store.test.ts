import { TaskStoreModel } from "./task-store"

test("can be created", () => {
  const instance = TaskStoreModel.create({})

  expect(instance).toBeTruthy()
})
