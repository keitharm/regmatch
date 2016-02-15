[![Stories in Ready](https://badge.waffle.io/keitharm/regmatch.png?label=ready&title=Ready)](https://waffle.io/keitharm/regmatch)
# regmatch
No need for perl, gawk, awk, sed, grep, egrep, and their flags that you have forgotten. Easily perform regex operations with grouping on the CLI.

## Install
    npm install regmatch -g
    
## Usage
`regmatch <file OR "text"> <regex> [modifiers] [--raw]`

`echo "Also accepts from stdin!" | regmatch <regex> [modifiers] [--raw]`
    
## Example
##### file.txt
```
code: 1 | guid: a23fc942-575f-4c4e-be2b-423ac4370573
code: 2 | guid: 5935fe66-fe29-4175-96f7-ce51f1b0b594
code: 3 | guid: 4e0a4daa-26c2-4b2b-97f9-583effe1a18c
```
`regmatch file.txt "code: (\d+).*guid: (.*-.*-.*-.*)" "g"`
##### output
```
[ [ '1', 'a23fc942-575f-4c4e-be2b-423ac4370573' ],
  [ '2', '5935fe66-fe29-4175-96f7-ce51f1b0b594' ],
  [ '3', '4e0a4daa-26c2-4b2b-97f9-583effe1a18c' ] ]
```


