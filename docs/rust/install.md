# windows上安装rust

建议先安装VS，勾选 C++相关开发工具

> https://rsproxy.cn/#home 使用字节的镜像

```powershell
# 设置环境变量
[System.Environment]::SetEnvironmentVariable("RUSTUP_DIST_SERVER", "https://rsproxy.cn", "Machine")
[System.Environment]::SetEnvironmentVariable("RUSTUP_UPDATE_ROOT", "https://rsproxy.cn/rustup", "Machine")
```

https://www.rust-lang.org/zh-CN/tools/install 下载"rustup-init.exe"安装程序

点击运行 rustup-init.exe，默认就行

重新打开一个命令后，执行`rustc -V`验证是否安装成功

安装完成后,编辑 ~/.cargo/config.toml (应该是新建)

```toml 
[source.crates-io]
replace-with = 'rsproxy-sparse'
[source.rsproxy]
registry = "https://rsproxy.cn/crates.io-index"
[source.rsproxy-sparse]
registry = "sparse+https://rsproxy.cn/index/"
[registries.rsproxy]
index = "https://rsproxy.cn/crates.io-index"
[net]
git-fetch-with-cli = true
```

## 尝试写一个HelloWorld


```powershell
# 创建项目
```
