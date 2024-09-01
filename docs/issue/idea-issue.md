# idea常见问题

## 找不到jdk

https://intellij-support.jetbrains.com/hc/en-us/community/posts/360009821700-Cannot-find-JDK-for-module

```txt
I had the same issue, that happened after every IDE update. It turned out to be an issue with the settings synchronisation. 

Maybe my finding will help other people to fix the issue. Noteworthy: I do use the deprecated Sync Repository Plugin. 

When using the Sync Repo functionality all JDK are stored in %APPDATA%\JetBrains\IntelliJIdea<Version>\settingsRepository\repository\jdk.table.xml. I checked the XML and content is fine. Also the reference on the JDK inside the project files (mainly <projectdir>\.idea\misc.xml) is correct. 

However IntelliJ seems to have a seperate copy of all settings under %APPDATA%\JetBrains\IntelliJIdea<Version>\options. The jdk.table.xml there suddenly was missing some of the JDK entries. Copying the original jdk.table.xml from the settings repository checkout fixed the issue instantly, even without a restart.
```