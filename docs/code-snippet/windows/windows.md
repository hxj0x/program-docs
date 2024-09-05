# windows常用命令

## 处理端口占用

```sh
# 查找某个端口监听的程序
netstat -ano | findstr 18081
#   TCP    0.0.0.0:18081          0.0.0.0:0              LISTENING       29668
#   TCP    [::]:18081             [::]:0                 LISTENING       29668

# 根据PID查询对应的进程信息
tasklist | findstr "29668"
# java.exe                     29668 Console                    8    955,232 K

# 停止某个PID对应的进程
taskkill /T /F /PID 29668
# 成功: 已终止 PID 21820 (属于 PID 29668 子进程)的进程。
# 成功: 已终止 PID 29668 (属于 PID 22136 子进程)的进程。
```