---
id: bad87fee1348bd9aedf0887a
title: Headline with the h2 Element
challengeType: 0
videoUrl: 'https://scrimba.com/p/pVMPUv/cE8Gqf3'
forumTopicId: 18196
---

## Description

<section id='description'>
Using image, second most important heading and paragraph elements achieve the layout.
</section>

## Instructions

<section id='instructions'>
   1.Write a <code>div</code> element in the body.
   2. In <code>div</code> element write an <code>img</code> element with src attribute value "https://drive.google.com/open?id=1FcfljeJtHeGpcRMjpa8RbPR2jnXIXMUU" and alt attribute value "HTML logo".
   3. Insert <code>h2</code> element and write "HTML" text as heading after <code>img</code> element.
   4. Insert <code>p</code> element and write "Hyper Text Markup Language (HTML) is a markup language for creating a webpage" text as paragraph.
</section>

## Tests

<section id='tests'>

```yml
tests:
  - text: Should have <code>img</code> element..
    testString: assert(($("img").length > 0));
  - text: Should have <code>h2</code> element..
    testString: assert(($("h2").length > 0));
  - text: Should have <code>p</code> element..
    testString: assert(($("p").length > 0));
  - text: <img> element should contain attribute src and have value "https://homepages.cae.wisc.edu/~ece533/images/airplane.png"
    testString: assert($('img').eq(0).attr('src') == "https://homepages.cae.wisc.edu/~ece533/images/airplane.png");
  - text: <img> element should contain attribute alt and have value "HTML".
    testString: assert($('img').eq(0).attr('alt') == "HTML");
  - text: The <code>div</code> element should have <code>img</code> <code>h2</code> <code>p</code> as children.
    testString: assert($("div").children("p").length === 1 && $("div").children("h2").length === 1 && $("div").children("img").length === 1);
  - text: The <code>h2</code> tag should have an <code>name</code> attribute set to "training".
    testString: assert($('h2').eq(0).attr('name') == "training");
```

</section>

## Challenge Seed

<section id='challengeSeed'>

<div id='html-seed'>

```html
<h1>Hello World</h1>
```

</div>

</section>

## Solution

<section id='solution'>
  
```html
<h1>Hello World</h1>
<h2>CatPhotoApp</h2>
```

</section>
