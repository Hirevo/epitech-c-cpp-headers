# EPITECH C/C++ Headers

This is a handler for EPITECH headers in C/C++ projects.
It can create them and updates them automatically.

## Features

You can create a header for a new file by:
- Using the `epitech-c-cpp-headers.addHandler` command
- Pressing `ctrl+shift+h` (`cmd+shift+h` on macOS)

Each time you save a C or C++ file with a header, it will update it automatically.

You can configure the headers in a very simple manner by executing the `epitech-c-cpp-headers.setConfig` command.  
By default, it will execute it on launch when a configuration field is left unknown.

## Requirements

No dependancies

## Extension Settings

This extension uses the following configuration entries:

* `epitech-c-cpp-headers.username`: Specify the username to use in headers (default: null)
* `epitech-c-cpp-headers.login`: Specify the login to use in headers (default: null)
* `epitech-c-cpp-headers.prompt`: Specify if the extension should prompt for unknown configuration fields (default: true)

## Known Issues

None

## Release Notes

### 1.0.0

Initial release

### 1.1.0

Added support for Makefiles  
Added better internal multi-language handling

### 1.2.0

Added prompt to improve UX while configuring

### 1.3.0

Added the `epitech-c-cpp-headers.setConfig` command to reconfigure headers  
Fixed regex escape issues  
Fixed possible line mismatch on date updates  
Fixed date update on Makefiles

### 1.3.1

Format fix in README.md