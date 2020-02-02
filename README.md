EPITECH C/C++ Headers
=====================

[![GitHub license](https://img.shields.io/github/license/Hirevo/epitech-c-cpp-headers)](https://github.com/Hirevo/epitech-c-cpp-headers/blob/master/LICENSE)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=Hirevo/epitech-c-cpp-headers)](https://dependabot.com)

This is a handler for EPITECH headers in C/C++ projects.
It can create them and updates them automatically.

[Link to the Visual Studio Code Marketplace extension page.](https://marketplace.visualstudio.com/items?itemName=nicolaspolomack.epitech-c-cpp-headers)

Features
--------

You can create a header for a new file by:

- Using the `epitech-c-cpp-headers.addHeader` command
- Pressing `ctrl+shift+h` (`cmd+shift+h` on macOS)

Each time you save a C or C++ file with a header, it will update it automatically.

You can configure the headers in a very simple manner by executing the `epitech-c-cpp-headers.setConfig` command.  
By default, it will execute it on launch when a configuration field is left unknown.

Requirements
------------

No dependancies

Extension Settings
------------------

This extension uses the following configuration entries:

- `epitech-c-cpp-headers.username`: Specify the username to use in headers (default: null)
- `epitech-c-cpp-headers.login`: Specify the login to use in headers (default: null)
- `epitech-c-cpp-headers.prompt`: Specify if the extension should prompt for unknown configuration fields (default: true)
- `epitech-c-cpp-headers.usePragmaOnce`: Specifies if '#pragma once' should be used as header guard instead of '#ifndef ...' (default: false)
- `epitech-c-cpp-headers.autoGenerateClasses`: Specifies if automatic C++ class generation is enabled (default: true)

Known Issues
------------

None

Release Notes
-------------

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

### 1.4.0

Reworked the edit mechanism allowing the edit history of the file to persist after any header update.

### 1.4.1

Fixed issues in README.md

### 1.5.0

Added support for Python, Shell scripts, C#, Objective-C, Java, LaTeX  
Added better support for C++  
Added End-of-line encoding independance, for inter-operability between different OSs  

### 1.6.0

Added auto-insertion of header define guards for C/C++ empty header files  
Added cursor auto-positionning, to set it ready to type  

### 1.7.0

Added internal multi-format support  
Implemented the new 2017 header format (Promo 2022)  

### 1.7.3

Changed pre-processors indent style for the 2017 header format  

### 1.7.4

Fixed C++ headers  
Fixed issue with config being saved as local instead of global  

### 1.8.0

Added support for '#pragma once' header guards (Thanks to @lodi-g for the pull request)  
Added C++ automatic class generator in source and header files  

### 1.8.1

Fixed scolar year in post2017 headers  

### 1.8.2

Fixed the day in pre2017 headers (Thanks to @SaShimy for the pull request)  

### 1.8.3

Reverted the 1.8.1 patch as it was not correct to begin with  

### 1.9.0

Added header auto-filling (with workspace name and filename, thanks to @lodi-g for the pull request)

### 1.9.1

Fixed issues with auto-filled headers (Thanks to @MrYannKee for the bug report and pull request)  
Fixed empty auto-filled headers for files without extensions (like Makefile)  

### 1.9.2

Added support for Rust files and C++ template files  

### 1.9.5

Added support for Haskell files  
Fixed issue where normal files could be flagged as C/C++ files for header generation  

### 1.12.0

Fixed indentation issue with auto-insertion of header define guards for C/C++ empty header files

### 1.13.0

Added ability to rename **`#ifndef`** header guards (Thanks to @ColColty for the pull request)

### 1.14.0

Added setting to toggle indentation of visibility specifiers in generated C++ class declarations.  
Indentation in generated code now respects user's preferences instead of always using tabs.  
(Thanks to @Gr1moire for the pull request introducing these two features)
