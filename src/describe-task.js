import { ECS } from '@aws-sdk/client-ecs'
import { SSM } from '@aws-sdk/client-ssm'


export const getTask = async (profile, familyPrefix) => {
  process.env.AWS_PROFILE = profile
  const ECSClient = new ECS({});

  // 指定のタスク定義の最新を取得
  const definitions = await ECSClient.listTaskDefinitions({
    familyPrefix: familyPrefix,
    sort: 'DESC',
    maxResults: 1
  });
  if (definitions['taskDefinitionArns'].length == 0) {
    console.error(`no task  definitions found. familyPrefix: ${process.env.TASK_DEFINITION_FAMILY}`);
    process.exit();
  }
  const taskDefinitionArn = definitions.taskDefinitionArns[0];
  console.log(`taskDefinitionArn: ${taskDefinitionArn}`);

  const data = await ECSClient.describeTaskDefinition({ taskDefinition: taskDefinitionArn });
  return data.taskDefinition;
}

export const describeEnvironment = async (profile, taskDefinition, targetContainer) => {
  console.log(`describeEnvironment: ${taskDefinition['family']}`);

  const containerDefinitions = taskDefinition['containerDefinitions'];
  for (const containerDefinition of containerDefinitions) {
    if (containerDefinition['name'] != targetContainer) {
      console.log(`skipped continer: ${containerDefinition['name']}`);
      continue;
    }

    const environments = await parseEnvironment(profile, containerDefinition);
    return environments;
  }

  throw new Error('target container not found!');
}

export const parseEnvironment = async (profile, containerDefinition) => {
  const environments = {};

  process.env.AWS_PROFILE = profile
  const SSMClient = new SSM({});

  // 通常 env
  for (const environment of containerDefinition['environment']) {
    environments[environment['name']] = environment['value'];
  }

  // secret
  for (const secret of containerDefinition['secrets']) {
    var valueFrom = secret['valueFrom'];
    const regex = /arn:aws:ssm:ap\-northeast\-1:.*?:parameter/i;
    valueFrom = valueFrom.replace(regex, '');

    const result = await SSMClient.getParameter({ Name: valueFrom, WithDecryption: true });
    environments[secret['name']] = result.Parameter.Value;
  }

  return environments;
}
