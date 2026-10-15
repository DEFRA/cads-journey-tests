export type GenerationScenariosResponse = {
  scenarios: Scenario[]
}

type Scenario = {
  name: string
  tableName: string
}
