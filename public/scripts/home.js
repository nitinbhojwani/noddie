$(document).ready(function() {
    languages = {
        "names": {
            "c": "C",
            "cpp": "C++",
            "java": "Java",
            "csharp": "C#",
            "php": "PHP",
            "ruby": "Ruby",
            "python": "Python 2",
            "perl": "Perl",
            "haskell": "Haskell",
            "clojure": "Clojure",
            "scala": "Scala",
            "bash": "Bash",
            "lua": "Lua",
            "erlang": "Erlang",
            "javascript": "Javascript",
            "go": "Go",
            "d": "D",
            "ocaml": "OCaml",
            "pascal": "Pascal",
            "sbcl": "Common Lisp (SBCL)",
            "python3": "Python 3",
            "groovy": "Groovy",
            "objectivec": "Objective-C",
            "fsharp": "F#",
            "cobol": "COBOL",
            "visualbasic": "VB.NET",
            "lolcode": "LOLCODE",
            "smalltalk": "Smalltalk",
            "tcl": "Tcl",
            "whitespace": "Whitespace",
            "tsql": "T-SQL",
            "java8": "Java 8",
            "db2": "DB2",
            "octave": "Octave",
            "r": "R",
            "xquery": "XQuery",
            "racket": "Racket",
            "rust": "Rust",
            "fortran": "Fortran",
            "swift": "Swift",
            "oracle": "Oracle",
            "mysql": "MySQL"
        },
        "codes": {
            "c": 1,
            "cpp": 2,
            "java": 3,
            "python": 5,
            "perl": 6,
            "php": 7,
            "ruby": 8,
            "csharp": 9,
            "mysql": 10,
            "oracle": 11,
            "haskell": 12,
            "clojure": 13,
            "bash": 14,
            "scala": 15,
            "erlang": 16,
            "lua": 18,
            "javascript": 20,
            "go": 21,
            "d": 22,
            "ocaml": 23,
            "r": 24,
            "pascal": 25,
            "sbcl": 26,
            "python3": 30,
            "groovy": 31,
            "objectivec": 32,
            "fsharp": 33,
            "cobol": 36,
            "visualbasic": 37,
            "lolcode": 38,
            "smalltalk": 39,
            "tcl": 40,
            "whitespace": 41,
            "tsql": 42,
            "java8": 43,
            "db2": 44,
            "octave": 46,
            "xquery": 48,
            "racket": 49,
            "rust": 50,
            "swift": 51,
            "fortran": 54
        }
    };
    names = languages["names"];
    codes = languages["codes"];
    $.each(names, function(valueName, showName) {
        $("#lang").append($("<option>").val(codes[valueName]).text(showName));
    });
    var textarea = $('textarea[id="code"]').hide();
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/twilight");
    editor.getSession().setMode("ace/mode/javascript");
    editor.getSession().setValue(textarea.val());
    editor.setOptions({
        minLines: 30,
        maxLines: 50
    });
    editor.getSession().on('change', function() {
        textarea.val(editor.getSession().getValue());
    });
});

function changeLanguage() {
    language = $("#lang").val();
    language_code = $.map(codes, function(lang_val, lang) {
        if (lang_val == language) {
            return lang;
        }
    })[0];
    if (language_code == 'python3') {
        language_code = 'python';
    }
    editor.getSession().setMode("ace/mode/" + language_code);
}

function checkCode() {
    source = $("#code").val();
    input = $("#input").val();
    lang = $("#lang").val();
    api_key = $("#api_key").val();
    data = {
        "source": source,
        "input": input,
        "lang": lang,
        "api_key": api_key
    }
    $.ajax({
        type: "POST",
        url: 'api/v1/check-code',
        data: data,
        success: function(result) {
            result = JSON.parse(result);
            $("#extra_status").val(JSON.stringify(result.result, undefined, 4));
            stdout = result.result.stdout;
            stderr = result.result.stderr;
            if (result.result.stdout) {
                $("#output").val(stdout);
            } else if (result.result.errors != undefined) {
                $("#output").val('Validation Failed\n\n' + JSON.stringify(result.result.errors, undefined, 4));
            } else if (result.result.compilemessage != "") {
                $("#output").val('Compilation Failed\n\n' + result.result.compilemessage);
            } else {
                $("#output").val('Error in Code\n\n' + stderr);
            }
        },
        error: function(error) {
            console.log(error);
        }
    });
}