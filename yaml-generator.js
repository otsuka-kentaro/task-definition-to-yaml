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

function asignKeys(taskDefinition) {
  const copied = {};
  for (const key of taskDefinitionKeys) {
    // container_definitions は後で
    if (key == 'container_definitions') {
      continue;
    }
    copied[key] = taskDefinition[camel(key)];
  }

  // container_definitions 設定
  copied['container_definitions'] = [];
  const containerDefinitions = taskDefinition['containerDefinitions'];
  for (const containerDefinition of containerDefinitions) {
    const copiedContainerDefinition = {};
    for (const key of containerDefinitionKeys) {
      copiedContainerDefinition[key] = containerDefinition[camel(key)];
    }
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
export const generate = (file, taskDefinition) => {
  const copied = asignKeys(taskDefinition);
  const yamlText = yaml.dump(copied, { lineWidth: -1, sortKeys: sortKeys });
  fs.writeFileSync(file, yamlText);
}
