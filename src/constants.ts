
export const Eols = ["", "\n", "\r\n"]

export const SupportedLanguages = {
    "c": "c",
    "h": "c",
    "cpp": "cpp",
    "hpp": "cpp",
    "cc": "cpp",
    "hh": "cpp",
    "C": "cpp",
    "H": "cpp",
    "cxx": "cpp",
    "hxx": "cpp",
    "c++": "cpp",
    "h++": "cpp",
    "Makefile": "Makefile",
    "py": "Python",
    "sh": "Shell",
    "tex": "LaTeX",
    "java": "Java",
    "cs": "C#",
    "m": "ObjectiveC"
}

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
        preProcessorStyle: "	#"
    },
    commentStart: { c: "/*", cpp: "/*", Makefile: "##", Python: "##", Shell: "##", LaTeX: "%%", Java: "/*", "C#": "/*", ObjectiveC: "/*" },
    commentMid: { c: "**", cpp: "**", Makefile: "##", Python: "##", Shell: "##", LaTeX: "%%", Java: "**", "C#": "**", ObjectiveC: "**" },
    commentEnd: { c: "*/", cpp: "*/", Makefile: "##", Python: "##", Shell: "##", LaTeX: "%%", Java: "*/", "C#": "*/", ObjectiveC: "*/" }
}

export const Days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
export const Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
