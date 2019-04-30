
export const Eols = ["", "\n", "\r\n"];

export const SupportedLanguages = {
    "c": "c",
    "h": "c",
    "cpp": "cpp",
    "hpp": "cpp",
    "tpp": "cpp",
    "ipp": "cpp",
    "cc": "cpp",
    "hh": "cpp",
    "C": "cpp",
    "H": "cpp",
    "cxx": "cpp",
    "hxx": "cpp",
    "c++": "cpp",
    "h++": "cpp",
    "go": "Go",
    "Makefile": "Makefile",
    "py": "Python",
    "sh": "Shell",
    "tex": "LaTeX",
    "java": "Java",
    "cs": "C#",
    "m": "ObjectiveC",
    "rs": "Rust",
    "hs": "Haskell",
    "lhs": "Haskell"
};

export const Syntax = {
    pre2017: {
        headerMadeBy: "Made by ",
        headerLogin: "Login   ",
        headerLoginBeg: "<",
        headerLoginMid: "",
        headerLoginEnd: ">",
        headerStarted: "Started on  ",
        headerLast: "Last update ",
        headerFor: " for ",
        headerIn: " in ",
        domaineName: "",
        offsetHeaderFile: 13,
        preProcessorStyle: "# "
    },
    post2017: {
        offsetHeaderFile: 10,
        preProcessorStyle: "#"
    },
    commentStart: { c: "/*", cpp: "/*", Makefile: "##", Python: "##", Shell: "##", LaTeX: "%%", Java: "/*", "C#": "/*", ObjectiveC: "/*", Rust: "//", Haskell: "--", Go: "//" },
    commentMid: { c: "**", cpp: "**", Makefile: "##", Python: "##", Shell: "##", LaTeX: "%%", Java: "**", "C#": "**", ObjectiveC: "**", Rust: "//", Haskell: "--", Go: "//" },
    commentEnd: { c: "*/", cpp: "*/", Makefile: "##", Python: "##", Shell: "##", LaTeX: "%%", Java: "*/", "C#": "*/", ObjectiveC: "*/", Rust: "//", Haskell: "--", Go: "//" }
};

export const Days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
