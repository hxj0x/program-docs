## liunx常用命令

```sh
# 检查端口占用tcp、upd？
netstat -tulpn | grep 5005

# 根据进程id查看程序部署位置
ls -l /proc/40615/cwd

# 
```

## windows

```sh
# windows查看端口被系统占用了哪些
netsh int ipv4 show dynamicport tcp
netsh int ipv4 show dynamicport udp
netsh interface ipv4 show excludedportrange protocol=tcp
netsh interface ipv4 show excludedportrange protocol=udp
```