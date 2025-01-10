# git

```shell
# 配置git走代理，7890是 Clash for Windows 的代码地址
git config --local http.proxy 127.0.0.1:7890
git config --local https.proxy 127.0.0.1:7890

git config --local --unset http.proxy
git config --local --unset https.proxy
```

```shell
# 配置某个仓库提交的用户名和邮箱
git config --local user.email "xxx@qq.com"
git config --local user.name "xxx"
```