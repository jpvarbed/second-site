---
layout: "@/layouts/post.astro"
title: Clean Code
excerpt: Review of Clean Code
date: "2014-12-29T01:01:00Z"
coverImage: "/assets/images/books/clean_code/cover.webp"
imgAlt: "Book cover"
audience: "Professional"
type: "Review"
subject: "Programming"
author:
  name: "Jason Varbedian"
---

Written by [Robert C. Martin](https://www.oreilly.com/library/view/clean-code-a/9780136083238/)
**Chapters Covered** All chapters

## TOC

## Synopsis

## Book Notes

### Chapter 1

**Sort** - naming identifiers are important
**tidiness/systematize** - a piece of code should be where you expect to find it
**cleaning** - don’t leave comments or wishes for the future
**standardization** - consistent coding style and set of practices
**discipline** - reflect on practices and be willing to change

It's your job to defend the code, manager's /pm's to defend the schedule

### Meaningful Names

- Name should tell you why it exists, what it does and how it is used.
- avoid misinformation, accountsList should just be accounts or group of accounts. Don't encode the type unless it's actually and list and even then avoid it.
- Length of a name should correspond to the size of its scope. Longer names are easier to search
- Don't want users to know I'm handing them an interface, don’t include the I. Call the implementation ShapeFactoryImp
- class names should have noun or noun phrase names Account, AddressParser. A class name should not be a verb
- method names should have verb or verb phrase
- one word per concept get/retrieve
- careful to not make a pun. If add means to combine two things and you add a new method that puts a single parameter in a collection use insert or append
- don't add gratuitous context accountaddress is fine for the instance but call the class address

### Functions

- Smaller: only those steps that are one level below the stated name. Can you extract another function from it with a name that is not merely a restatement of its implementation.
- top to bottom:the stepdown rule- read the program as though it were a set of TO paragraphs. The TO references a lower level of abstraction
- one switch statement, for polymorphism in a factory. Think employees with salaried, hourly, commissioned pay, is payday, deliver pay would all have switches which is bad.
- open/closed principle: extension shouldn't require modification. If you add a new kind of employee, you shouldn't have to change old code
- single responsibility principle: there should only be one reason to modify a class. If you have a class that compiles and prints a report, if the format or printer changes you have to change the class.
- monadic forms: asking a question, transforming, telling event
- avoid flag arguments: make two different functions
- dyadic functions: can often be made into classes where you make the output/out param a member
- have no side effects
- separate actions and queries
- error handling is one thing
- write the code first and then refine. Making sure it passes the unit tests as you go

### Comments

- comments are always failures
- informative, explanation of intent or clarification
- bad comments are the worst

### Formatting

- minimize vertical distance. How far a variable or method is used
- caller above callee
- horizontal alignment isn't important
- a source file is a hierarchy similar to an outline. Info important to the file, class, method and blocks in the method. Indentation shows this
- team rules trump individual so a reader can trust one source file to another

### Objects and Data Structures

- allow users to manipulate the essence of the data
  -objects hide their data behind abstractions and expose functions
- data structures expose their data and have no meaningful functions
- if you are adding data types use oo, functions use data structures
- **law of Demeter**: The method should not invoke methods on objects that are returned by any of the allowed functions. This helps keep date structures and objects separate.
- data transfer objects are classes with members and no functions. Bean are private but with setters/getters
- if you will add new behaviors use structures, new types use objects

### Error Handling

- if error handling obscures logic, then it's wrong
- write tests to force errors/exceptions and then fix your code
- checked exceptions violate open/closed principle
- define exception for caller/catch
- wrap third party APIs is a best practice
- return empty instead of null

### Boundaries

- It is maps or a third party interface. avoid returning it from, or accepting it as an argument to, public APIs.
- write learning/unittests for third party APIs
- code at boundaries needs clear separations and tests that define expectations
- can use adapter pattern

### Unit Tests

- first law: You may not write production code until you have written a failing unit test.
- second law: You may not write more of a unit test than is sufficient to fail, and not compiling is failing
- third law: You may not write more production code than is sufficient to pass the currently failing test
- tests enable change
- keep tests readable and clean, don't care about efficiency
- domain specific testing API
  **First:**
- Fast: Tests should be fast
- independent: Tests should not depend on each other
- repeatable: Tests should be repeatable in any environment
- self-validating: Pass or fail
- timely: Write tests just before product code

### Classes

- single responsibility. If you need something protected for a test then that rules.
- describe without using if, and, or, but
- many small drawers well defined or large drawers you toss everything into?
- it's ok to make it work and then finish
- cohesion:method should manipulate at least one variable. If all manipulate all that's perfect cohesion. If you have a subset using a subset then that's another class trying to get out.
- SQL used interfaces for the operations
