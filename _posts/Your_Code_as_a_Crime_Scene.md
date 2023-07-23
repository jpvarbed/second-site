---
layout: "@/layouts/post.astro"
title: Your Code as A Crime Scene
excerpt: Review of Your Code as A Crime Scene
date: "2023-01-28T12:23:00Z"
coverImage: "/assets/images/books/your_code_as_a_crime_scene/cover.webp"
imgAlt: "Image post"
audience: "Professional"
type: "Review"
subject: "Book"
author:
  name: "Jason Varbedian"
---

Written by [Adam Thornhill](https://www.oreilly.com/library/view/your-code-as/9781680500813/).
Suggested by Thiago Ghisi in his "[22 Technical Books that impacted \[his\] career](https://typefully.com/thiagoghisi/the-22-technical-books-that-impacted-my-career-WXha6fW)"

**Chapters Covered** 1, 5, 6, and 8

## TOC

## Synopsis

Your Code as A Crime Scene encourages readers to view their code as a reflection of their organization's relationships and communication patterns. The book provides heuristics and tools for detecting problematic code, improving architecture, and detecting architectural decay.
It stresses the importance of paying attention to the PRs they review, and how the way teams are structured can influence the output of their code. The author explains how to use his custom tool for code analysis looking at spacing and change locality. From what I read, the book provided guidance on what to do but not how to prevent issues from occurring. Overall, the book offers valuable insights and tools for software developers and managers looking to improve their codebase and team communication.

## Review

I found this book had some interesting insights but overall not that useful to my job.
There are a bunch of useful ways of thinking about code and thinking. The author talked about how humans are limited to being able to have 4-7 concepts in our working memory at once so if we can 'chunk' concepts.

## Who Should Read This Book

I think an independent consultant or contractor who has to help on a big codebase could learn some useful techniques from this book.

## My Book Notes

## Chapter 1

Central idea: we’ll never be able to understand complex, large-scale systems just by looking at a single snapshot of the code

Be able to examine a large system and immediately get a view of its health.

Blends forensic psychology and software evolution

Facts and Fallacies of Software Engineering - Robert Glass argues that maintenance is the most important phase in software development

40-80% of a software projects budget go towards maintenance

Understanding the product is the dominant maintenance activity. It’s easy after that. Primary task is to understand it

- Part 1 - how you detect problematic code
- Part 2 - shows how you can improve your architecture

- Part 3 - shows how you organization affects your code

We’re using the same brain as the one lighting fires in caves. Tailing complexity has to start with how our brain thinks

## Chapter 5 judge hotspot with the power of names

Heuristics to pass quick judgments on hotspots

Hotspots are 4-6% of the code base. Names help a program fit in your head.

Biggest bottleneck is size of the working memory. 3-7 items in memory simultaneously. We can’t expand the items but can make each item carry more information. We call this chunking

We group computations into named functions. Each name is chunk. Good names make it easier to work with the chunks

We try to infer the purpose and representation just from the name of the class or function

**Good:**

- Descriptive and expresses intent. Concurrentqueue, tcp listener
- Expresses a single concept, fewer responsibilities

- Suggest intent and usage. Chat connection

**Bad:**

- Carry little information, convey no hints, statemanager
- Conjunctions - and, or.

- Suffix’s - manager, util, impl

Investigate a hotspot by its name

Abstractentitypersister. Abstract means to take away and its stlll 4000 lines

Limitations of heuristics

Availability bias - how easily examples come to mind. Asked people about most likely cause of death, chose the more dramatic over more common.

## Chapter 6 calculate complexity trends from your code’s shape

Slope and indentation of code shows us some how complex it is

Look at negative space. Complexity_analysis.py

Saw some graphs of complexity. Useful for just starting

## Chapter 8 detect architectural decay

Analyze temporal coupling

How many times two modules have been changed in the same commit

Simple coupling algorithms are best

Catch architectural decay

High degree of temporal coupling goes with high defect rates.

Limiting to more recent commits performed worse. This is because they assumed code gets better over time but without refactors it gets worse

Enable continuing change

Successful software will add new features and we must continuously work to prevent a deteriorating structure.

## Book Club Notes

Been judging my code subconsciously. She's been judging her code based on the shape but didn't realize she was doing it.

How much information can be derived from relatively simple info. How much the file was being touched. \*interesting how more advanced analysis was worse

Didn't say how to avoid this problem. How the repository will be a reflection of the relationship in the repo. Ship the org chart.

Build time regressions. Coupled from build point of view and change view. Should these files be related. Are they related in ways that are unexpected. Build dependency from files that aren't related at all.

Last chapter was interesting. Work is very related. Crazy deadline for the project. Adding more engineers. All new to the codebase. +1 conscious vs subconscious. More conscious about readability. Is it worth refactoring to make it more readable. +1 on maybe needed to have read the whole book. Telling us what to do but not how to prevent it.

Dillon tried running the tools but he hasn’t updated on his website. He found a file they run the flight system through because you have to update user guids.

Pay more attention to the prs shes been reviewing. Straightforward things we can pay attention to.

Super excellent silos written by one guy but hes the only one changing those files. User vs use-e relationship of that code.

An additional lever you didn't know about for code. Might not be part of the computer that’s the problem. Not just the way you write tests and code but the way you structure teams influences the output.

Chunking and 3-7 things you can think about at once. A lot of systems and weird edge cases. 10+ sort of things to think about
