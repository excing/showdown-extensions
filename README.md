# showdown-extensions
An extension in showdown documents using markdown syntax

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
 1. [showdown, raphael, underscore, js-sequence-diagrams](https://cdn.jsdelivr.net/combine/npm/showdown@1.5.0,npm/raphael@2.2.7,npm/underscore@1.9.1,npm/js-sequence-diagrams@1000000.0.6)
 2. [prismjs](https://cdn.jsdelivr.net/combine/npm/prismjs@9000.0.1,npm/prismjs@9000.0.1/components/prism-java.min.js,npm/prismjs@9000.0.1/components/prism-javascript.min.js,npm/prismjs@9000.0.1/components/prism-go.min.js,npm/prismjs@9000.0.1/components/prism-powershell.min.js,npm/prismjs@9000.0.1/components/prism-python.min.js,npm/prismjs@9000.0.1/components/prism-sql.min.js):
 3. [flowchart](https://cdnjs.cloudflare.com/ajax/libs/flowchart/1.11.3/flowchart.min.js)
 4. [MathJax(default)](https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-AMS_CHTML&latest)

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
