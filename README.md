# task-definition-to-yaml
existing task definition copy tool for [genova](https://github.com/metaps/genova)

## requirements
- node >= v14.8.0 (Top-Level await support)

## 実行
```shell
AWS_PROFILE=profile \
AWS_REGION=ap-northeast-1 \
EXECUTION_ROLE_ARN={override execution_role_arn} \
TASK_ROLE_ARN={override task_role_arn} \
TASK_DEFINITION_FAMILY={target-definition-family} yarn run start
```

### optional parameters
- AWS_PROFILE
- AWS_REGION
- EXECUTION_ROLE_ARN
- TASK_ROLE_ARN
