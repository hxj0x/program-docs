# springboot常用配置

```yaml
servlet:
multipart:
    max-file-size: 10MB
logging:
  level:
    root: info
  file:
    name: ./logs/${spring.application.name}.log
  logback:
    rollingpolicy:
      max-history: 7
      max-file-size: 20MB
```