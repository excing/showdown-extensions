# showdown-extensions
An extension in showdown documents using markdown syntax

[Sample](http://excing.github.io/sample/extensions_sample.html)

- what is showdown

Showdown is a Javascript Markdown to HTML converter, based on the original works by John Gruber. Showdown can be used client side (in the browser) or server side (with NodeJs).

Check a live Demo here [http://demo.showdownjs.com/](http://demo.showdownjs.com/)

Click [showdown github](https://github.com/showdownjs/showdown)

- what is showdown extensions

Showdown allows additional functionality to be loaded via extensions

see [showdown extensions wiki](https://github.com/showdownjs/showdown/wiki/extensions)

## Usage:

```java
var markdown = `# showdown-extensions`;
var converter = new showdown.Converter({extensions: ['exension-name_1', 'exension-name_2']}),
    html      = converter.makeHtml(markdown);
console.log(html);
```

[TOC]

## [showdoan-full-extensions.js](https://github.com/excing/showdown-extensions/blob/master/showdoan-full-extensions.js)

It contains all extensions, and rendering the subsequent operation has been completed.

you will need:

 1. [showdown](https://github.com/showdownjs/showdown)
 2. [prismjs](https://github.com/PrismJS/prism)
 3. [raphael](https://github.com/DmitryBaranovskiy/raphael)
 4. [underscore](https://github.com/jashkenas/underscore)
 5. [js-sequence-diagrams](https://github.com/bramp/js-sequence-diagrams)
 6. [flowchart.js](https://github.com/adrai/flowchart.js)
 7. [MathJax](https://github.com/mathjax/MathJax)
 
recommend cdn:
 1. [jsdelivr](https://www.jsdelivr.com/)
 2. [cdnjs](https://cdnjs.com/):

recommend version:
 - showdown: 1.5.0
 - prismjs: 9000.0.1 (from jsdelivr cdn)
 - raphael: 2.2.7
 - underscore: 1.9.1
 - js-sequence-diagrams: 1000000.0.6 (from jsdelivr cdn, this version can use the `raphael` library)
 - flowchart.js: 1.11.3
 - MathJax: 2.7.5

## extension list:

### mathjax ([mathjax-extension.js](https://github.com/excing/showdown-extensions/blob/master/mathjax-extension.js))

Support for writing math formulas using `LaTex` syntax, then you can use the [Mathjax](https://github.com/mathjax/MathJax) plugin to display math formulas in web pages.

#### Example:

![](https://github.com/excing/showdown-extensions/blob/master/example/math_formulas_example.png)

#### Markdown syntax:

Please use `$` and `$$` to edit.

- Edit in a single line

```
The square area formula is: $S=a^2$.
```

- Multi-line editing

```
$$
\begin{alignat*}{2}
    x& = y_1-y_2+y_3-y_5+y_8-\dots
    &\quad& \\
    & = y’\circ y^* && \\
    & = y(0) y’ && 
\end{alignat*}
$$
```

### diagrams ([diagrams-extension.js](https://github.com/excing/showdown-extensions/blob/master/diagrams-extension.js))

Support for text format sequence diagrams and flowcharts, then you can use the [js-sequence-diagrams](https://github.com/bramp/js-sequence-diagrams) and [flowchart.js](https://github.com/adrai/flowchart.js) to display them.

#### Example:

sequence diagrams

![](https://github.com/excing/showdown-extensions/blob/master/example/flowcharts_example.png)

flowchart

![](https://github.com/excing/showdown-extensions/blob/master/example/sequence_diagrams_example.png)

#### Markdown syntax:

use ` ```seq` and ` ```flow` to edit.

- sequence diagrams

```
Title: Here is a title
A->B: Normal line
B-->C: Dashed line
C-->C: Point to self
C->>D: Open arrow
D-->>A: Dashed open arrow
```

- flowchart

```
st=>start: Start:>http://www.google.com[blank]
e=>end:>http://www.google.com
op1=>operation: My Operation
sub1=>subroutine: My Subroutine
cond=>condition: Yes
or No?:>http://www.google.com
io=>inputoutput: catch something...
para=>parallel: parallel tasks

st->op1->cond
cond(yes)->io->e
cond(no)->para
para(path1, bottom)->sub1(right)->op1
para(path2, top)->op1
```

### video ([video-extension.js](https://github.com/excing/showdown-extensions/blob/master/video-extension.js))

Support for the syntax of video display.

#### Example:

![](https://github.com/excing/showdown-extensions/blob/master/example/video_example.png)

#### Markdown syntax:

Simple:

```
![](http://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_640_3MG.mp4)
```

Whole:

```
![alt text](url =wxh "title")
```

You can also use units:

```
=100x80     simple, assumes units are in px
=100x*      sets the height to "auto"
=80%x5em   width of 80% and height of 5em
```

#### Support video format

- video/webm
- video/mp4
- video/ogg

### catalog ([catalog-extension.js](https://github.com/excing/showdown-extensions/blob/master/catalog-extension.js))
 
Support <h1> to <h6> catalog display.

Direct introduction.

