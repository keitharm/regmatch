[![Stories in Ready](https://badge.waffle.io/keitharm/regmatch.png?label=ready&title=Ready)](https://waffle.io/keitharm/regmatch)
# regmatch
No need for perl, gawk, awk, sed, grep, egrep, and their flags (that may differ from OS to OS) that you have forgotten. Easily perform regex operations with grouping on the CLI using consistent flags!

## Install
    npm install regmatch -g
    
## Usage
regmatch requires 2 parameters: a regular expression and a file or string to perform the regex on.

The regex, modifiers, format, tile/text options must be supplied in the order below. The file/string must be the last option if it isn't stdin (you can have long options anywhere though, including the end).

`regmatch <regex> [modifiers] [format] <file OR "text"> [--raw, --json, --prettyjson]`

`echo "Also accepts from stdin!" | regmatch <regex> [modifiers] [format] [--raw, --json, --prettyjson]`

You can use long options however if you only need to use the `format` option for example

`regmatch <regex> --format '$0' file.txt` vs `regmatch <regex> '' '$0' file.txt`

Available long options:

- `format` = $ followed by the number of the grouped match, ex: `$0` for the 1st match, `$3` for the 4th match
- `modifiers` = modifiers to use with the regular expression
- `raw` = attempt to print only the match...displaying multiple groups may not work with this enabled
- `json` = json format
- `prettyjson` = human friendly json
    
## Example
##### file.txt
```
code: 1 | guid: a23fc942-575f-4c4e-be2b-423ac4370573
code: 2 | guid: 5935fe66-fe29-4175-96f7-ce51f1b0b594
code: 3 | guid: 4e0a4daa-26c2-4b2b-97f9-583effe1a18c
```
##### Commands (All of the commands below are the same but just in different formats)
    regmatch "code: (\d+).*guid: (.*-.*-.*-.*)" "g" '$0 $1' file.txt
    regmatch "code: (\d+).*guid: (.*-.*-.*-.*)" --modifiers "g" --format '$0 $1' file.txt
    regmatch --modifiers g --format '$0 $1' "code: (\d+).*guid: (.*-.*-.*-.*)" file.txt
    regmatch --format '$0 $1' "code: (\d+).*guid: (.*-.*-.*-.*)" "g" file.txt
    cat file.txt | regmatch --format "\$0 \$1" "code: (\d+).*guid: (.*-.*-.*-.*)" "g"
##### output
```
1 a23fc942-575f-4c4e-be2b-423ac4370573
2 5935fe66-fe29-4175-96f7-ce51f1b0b594
3 4e0a4daa-26c2-4b2b-97f9-583effe1a18c
```