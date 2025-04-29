# nvm安装

## liunx

https://juejin.cn/post/7390666931428343819


```sh
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
vi ~/.bashrc

export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node/
export NVM_IOJS_ORG_MIRROR=https://npmmirror.com/mirrors/npm/
source ~/.bashrc
nvm ls-remote --lts
nvm use xxx
```