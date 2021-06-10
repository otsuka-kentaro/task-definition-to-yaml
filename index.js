import { ECS } from '@aws-sdk/client-ecs'
const client = new ECS({});

import { generate } from './yaml-generator.js'


// 指定のタスク定義の最新を取得
const definitions = await client.listTaskDefinitions({
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

const data = await client.describeTaskDefinition({ taskDefinition: taskDefinitionArn });
console.log(data.taskDefinition);

const file = `output/${process.env.TASK_DEFINITION_FAMILY}.yaml`;
generate(file, data.taskDefinition);
console.log(`success to write. file: ${file}`);;
