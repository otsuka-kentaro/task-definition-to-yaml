# task-definition-to-yaml
existing task definition copy tool for [genova](https://github.com/metaps/genova)

## requirements
- node >= v14.8.0 (Top-Level await support)

## 実行
```shell
AWS_PROFILE=profile \
AWS_REGION=ap-northeast-1 \
TASK_DEFINITION_FAMILY={target-definition-family} yarn run start
```

### optional parameters
- AWS_PROFILE
- AWS_REGION
