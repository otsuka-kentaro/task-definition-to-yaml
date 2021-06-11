import { ECSClient } from './src/client.js'
import { generate } from './src/yaml-generator.js'


// 指定のタスク定義の最新を取得
const definitions = await ECSClient.listTaskDefinitions({
  familyPrefix: process.env.TASK_DEFINITION_FAMILY,
  sort: 'DESC',
  maxResults: 1
});
if (definitions['taskDefinitionArns'].length == 0) {
  console.error(`no task  definitions found. familyPrefix: ${process.env.TASK_DEFINITION_FAMILY}`);
  exit();
}
const taskDefinitionArn = definitions.taskDefinitionArns[0];
console.log(`taskDefinitionArn: ${taskDefinitionArn}`);

const data = await ECSClient.describeTaskDefinition({ taskDefinition: taskDefinitionArn });
console.log(data.taskDefinition);

const file = `output/${process.env.TASK_DEFINITION_FAMILY}.yaml`;
await generate(
  file,
  data.taskDefinition,
  process.env.EXECUTION_ROLE_ARN,
  process.env.TASK_ROLE_ARN,
  process.env.SECRET_TO_ENVIRONMENT == 'true'
);
console.log(`success to write. file: ${file}`);;
