import * as fs from 'fs'
import * as yaml from 'js-yaml'
import { camel } from 'snake-camel'

const taskDefinitionKeys = [
  'execution_role_arn',
  'family',
  'network_mode',
  'task_role_arn',
  'network_mode',
  'container_definitions',
];
const containerDefinitionKeys = [
  'name',
  'image',
  'memory',
  'memory_reservation',
  'port_mappings',
  'essential',
  'entry_point',
  'command',
  'environment',
  'secrets',
  'readonly_root_filesystem',
  'linux_parameters',
  'log_configuration',
  'docker_labels'
];

function asignKeys(taskDefinition, execution_role_arn, task_role_arn) {
  const copied = {};
  for (const key of taskDefinitionKeys) {
    // container_definitions は後で
    if (key == 'container_definitions') {
      continue;
    }
    copied[key] = taskDefinition[camel(key)];
  }
  // role の上書き指定
  if (execution_role_arn) {
    copied['execution_role_arn'] = execution_role_arn;
  }
  if (task_role_arn) {
    copied['task_role_arn'] = task_role_arn;
  }

  // container_definitions 設定
  copied['container_definitions'] = [];
  const containerDefinitions = taskDefinition['containerDefinitions'];
  for (const containerDefinition of containerDefinitions) {
    const copiedContainerDefinition = {};
    for (const key of containerDefinitionKeys) {
      copiedContainerDefinition[key] = containerDefinition[camel(key)];
    }

    // image の tag を {{tag}} に変換
    const imageArnSplited = copiedContainerDefinition['image'].split(':');
    imageArnSplited[imageArnSplited.length - 1] = '{{tag}}';
    copiedContainerDefinition['image'] = imageArnSplited.join(':');

    copied['container_definitions'].push(copiedContainerDefinition);
  }

  return copied;
}

const sortKeys = (a, b) => {
  return taskDefinitionKeys.indexOf(a) >= taskDefinitionKeys.indexOf(b) ? 1 : -1;
}

/**
 * @param taskDefinition AWS SDK の describe task definition で取得したデータを指定
 */
export const generate = (file, taskDefinition, execution_role_arn, task_role_arn) => {
  const copied = asignKeys(taskDefinition, execution_role_arn, task_role_arn);
  const yamlText = yaml.dump(copied, { lineWidth: -1, sortKeys: sortKeys });
  fs.writeFileSync(file, yamlText);
}
