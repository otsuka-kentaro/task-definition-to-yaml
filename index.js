import { ECS } from '@aws-sdk/client-ecs'
const client = new ECS({});

import { generate } from './yaml-generator.js'


client.describeTaskDefinition({ taskDefinition: process.env.TASK_DEFINITION }).then(
  (data) => {
    console.log('success to execute command');

    const file = `output/${process.env.TASK_DEFINITION}.yaml`;
    generate(file, data.taskDefinition);
    console.log(`success to write. file: ${file}`);
  },
  (error) => {
    console.error('faield to execute');
    console.error(error);
  },
  () => {
    exit();
  }
);
