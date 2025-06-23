---
title: "How to: 4 Creators"
author: "Gerrit Renner"
keywords: ["how to", "creators", "teachers", "slides", "examples", "layouts", "demonstrations"]
requirements: ["none"]
description: "How to create slides using markdown."

---

# How to: 4 Creators

--- 
<!-- .slide: id="elearning-markdown" -->
## Odea elearning x markdown
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! For creating slides, we recommend using **markdown** .

***

-! Markdown is a lightweight markup language that allows you to format text easily.

***

-> This tutorial will show how this works in Odea elearning.

<!-- /position -->
<!-- position={row: 1, column: 2} -->
1. Step: create a new `.md` file with a meaningful name and store it in `elearning/topics/`
2. Step: open the file in an `IDE` or `text editor` of your choice.

***

-> continue with the next slide to learn about the basic structure of a markdown file.
<!-- /position -->
<!-- /layout -->

--- 

<!-- .slide: id="markdown-structure" -->
## Basic structure of a markdown file
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! A markdown file consists of a `header` and `content`.

***
-> The `header` contains metadata about the file, such as the title, author, keywords, requirements, and description.

***

-> The `header` is written in `YAML` format and is enclosed by `---` at the beginning and end.
<!-- /position -->
<!-- position={row: 1, column: 2} -->
Example of a header:

```
---
title: "How to: 4 Creators"
author: "Gerrit Renner"
keywords: ["how to", 
           "creators", 
           "teachers", 
           "..."]
requirements: ["none"]
description: "How to create slides using markdown."
---
``` 

-> continue with the next slide to learn about the content of a markdown file.
<!-- /position -->
<!-- /layout -->

---

<!-- .slide: id="markdown-content" -->
## Content of a markdown file
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! The content of a markdown file is written in plain text and can be formatted using markdown syntax.

***

-> The content can contain headings, paragraphs, lists, links, images, and more.

***

-> To mark the end of a slide, you can use the `---` syntax.
<!-- /position -->
<!-- position={row: 1, column: 2} -->
Example of content:

```
---
YAML header
---

## My first slide

This is my first slide.

---
```

-> continue with the next slide to learn about the syntax of markdown.
<!-- /position -->
<!-- /layout -->

---