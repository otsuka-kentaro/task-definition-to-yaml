import { getTask, describeEnvironment } from './src/describe-task.js'

const profileA = process.env.PROFILE_A;
const profileB = process.env.PROFILE_B;

const familyA = process.env.TASK_DEFINITION_FAMILY_A;
const familyB = process.env.TASK_DEFINITION_FAMILY_B;

const taskA = await getTask(profileA, familyA);
const taskB = await getTask(profileB, familyB);

console.dir(taskA);
console.dir(taskB);

const taskAEnvironments = await describeEnvironment(profileA, taskA, process.env.CONTAINER_A);
const taskBEnvironments = await describeEnvironment(profileB, taskB, process.env.CONTAINER_B);

console.dir(taskAEnvironments);
console.dir(taskBEnvironments);


console.log('diff environments');

const diff = [];

for (const [key, value] of Object.entries(taskAEnvironments)) {
  console.log(`${key}: ${taskBEnvironments[key]}`);
  if (!taskBEnvironments[key]) {
    const d = { name: key };
    d[familyA] = value;
    d[familyB] = null;
    diff.push(d);
    continue;
  }

  if (value != taskBEnvironments[key]) {
    const d = { name: key };
    d[familyA] = value;
    d[familyB] = taskBEnvironments[key];
    diff.push(d);
  }
}

for (const [key, value] of Object.entries(taskBEnvironments)) {
  if (!taskAEnvironments[key]) {
    const d = { name: key };
    d[familyA] = null;
    d[familyB] = value;
    diff.push(d);
    continue;
  }
}

diff.sort(function(a, b) {
  return a['name'].localeCompare(b['name']);
});

console.dir(diff);
