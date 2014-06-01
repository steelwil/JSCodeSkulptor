#!/bin/sh
# usage ./toJS source.py output.js
sed '
s/\t/    /g
s/elif/else if (/
s/else:/else {/g
s/math./Math./g
s/True/true/g
s/False/false/g
s/self/this/g
s/def /function /g
s/^#/\/\//g
s/# /\/\/ /g
s/):/) {/g
s/str(/String(/g
s/(this, /(/g
s/(this)/()/g
/global /d
/import /d
s/class /function /g
s/:$/) {/g
s/return false/return false;/
s/return true/return true;/
s/Math.pi/Math.PI/g
s/Math.e/Math.E/g
s/type/typeof/g
s/None/null/g'  <$1 >$2
