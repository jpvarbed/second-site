---
layout: "@/layouts/post.astro"
title: CPP Con 2016
excerpt: Notes from the CPP Con
date: "2022-09-20T01:01:00Z"
coverImage: "/assets/images/events/Cpp_Con_2016/cover.png"
imgAlt: "Image post"
audience: "Professional"
type: "Recap"
subject: "C++"
author:
  name: "Jason Varbedian"
---

I attended the CPP Con in 2016. Here are my notes.

## TOC

## Keynote

**Speaker** Bjarne Stroustrup

Type and resource safety
Major changes in bursts, most changes aren't major
Cpus stop getting faster saved c++ from dying
Developers and designers disagree on what makes an extension good
Dev: short term, what I need now
Design: change the way people think
Long term and short term, theory and practice
C++ community is large and diverse. Consider transition and teachability

Major: changes the way people think about code
Auto is borderline
Isolated: doesn't change old code, no type system impact. Inline for header only global. Only one included

**Every extension does some harm**
Learning, tool burden. Outdated learning material
May only help small part of community
May delay other features
May encourage bad habits or error prone
Consider concurrency vs inline global

**Sometimes we must break**
Break loudly

Standards committee has no money. Only volunteers.
People disagree. Implicit vs explicit. Simple vs comprehensive, library vs language

**C++ is a victim of its success**
Stuck in the past
Separate decisions by differing groups of people. Design by committees

17 can deduce template from initializer list
Keep 3 year and 10 horizon

**Philosophy**
Fail early. Integrate
Maximize success. Not minimize failure
Doing nothing is also risky
Be confident. On average we've succeeded
Don't confuse simplicity and familiarity
A language for defining and using light weight a abstractions, primarily for software infrastructure and resource constrained applications

**Pros:**
Direct map to hardware
Zero overhead abstraction
Primarily industrial
Reward good programmers.

**Bjarne goals:**
Good error messages, concept based programming
Note: co routines?
Ts = technical specification

17
Variant, optional
Structured binding . Auto can define key/value

20
Operator dot smart references
Package manager
High level concurrency
Fp style pattern matching

Microsoft is shipping module Ts beta
Import std.io
Module calendar.date
Export
Core guidelines has 423 rules, 313 pages, 542 examples, 144 contributors

## Ben Deane (bdeane@blizzard.com)

## Summary

This document discusses the improvements made to C++ in dealing with types and illegal states. It defines types as a way for the compiler to know what opcodes to output and characterizes them by their operations and values. The document also explains how to determine the number of values a type can have and discusses the importance of designing with types to eliminate corner cases of bogus state spaces. It mentions the use of std::variant, std::optional, and phantom types for safety and describes the concept of total functions. The document concludes with a game of identifying function signatures and naming them.

## C++ has had a lot of improvement in

- Strengthening and expanding the capabilities for dealing with types

- FP makes illegal states unrepresentable

## What is a type

- A way for the compiler to know what opcodes to output

- The way data is stored

- Characterized by what operations are possible (behavioral)

- Determines the values that can be assigned

- The set of values that can inhabit an expression, may be finite or "infinite", characterized by cardinality

### Game: given a type, how many values it has

- bool: 2
- char: 256
- void: 0 but you can return
- Struct Foo{}: 1
- Enum with 3 values int8_t: 3
- Template `<typename t> struct Foo { T m;};:` cardinality of T

### Level 2: how many values

- `std::pair<bool, char>`: 512
- `Std::tuple<bool, bool, bool>`:8
- Two template struct: product of cardinalities
- When two types are concatenated into one compound type, we multiply the # of the inhabitants

### Level 3

- `Std::optional<char>`: 256 + 1
- `Std::variant<char, bool>`:258 256 + 2

### Level 4 function types: all are referentially transparent

- bool f(bool): 4, consider input to output combinations, always true, always false, the value, the converse
- Char f(bool): 256\*256. False can mean any of the 256, true can be any of the 256
- Char f(Foo) where Foo is a 3 value enum: 256*256*256
- Template `<class T, class U>` U f(t): U^|T|

- Identify mismatches between state spaces and the types used to implement them

- Std::variant reduces state space

- Example: Conection state
  - Enum class for connectionstate
  - Struct for connection
  - Some fields are valid at times. If disconnected no last ping time
  - Instead struct connection has a variant of one of the states as a struct. `E.g. struct Disconnected{}; struct Connected {connectionid}; std::variant{Disconnected, Connected}`

## Designing with types

- Eliminate corner cases of bogus state spaces

- The bigger the codebase the more vital the functionality, the more value there is in correct representation with types

- Phantom type: type isn't used in struct definition. Let's you tell the difference between a sanitized and unsanitized string. Define a struct around a class

  - Now your ExecuteQuery function only takes a struct with type Sanitized

- Total function:
  - A total function is a function that is defined for all inputs in its domain
  - Float sqrt(float f) is not total because of neg floats
  - Template `<typename T> const T& min(const T& a, const T& b)` is a total

## Game 2 function signature with no names attached, say what it's called

```C++
- Template <typename T> T f(T); -> identity
- Template <typename T> T f(bool, T, T); -> select
- Template <typename T, typename U> U f(function<U(T), t); -> apply
- Template <typename T> vector<T> f(vector<T>); ->reverse, shuffle
- Template <typename T> T f(vector<T>); It's a partial function - the vector might be empty but T& vector<T>::Front() exists.Optional<T>
```

## C++ 17 In Breadth

Speaker Alisdair Meredith

This document discusses C++ bodies and resources related to the language. It covers the community site for C++ at large, isocpp.org, and the official site for the C++ standard, wg21. It also provides information about the C++ standard releases, including their durations and the number of meetings held. The document notes the growth of the C++ standard library and the near misses for C++17, including concepts and coroutines. It also lists the features added or removed in different standard versions, including forwarding references, default member initializers, contiguous iterators, and universal random bit generators. Finally, the document discusses C++17 features, such as UTF8 character literals, if constexpr, constexpr lambda expressions, and deducing templates from constructors.

## C++ bodies

- Isocpp.org - community site for C++ at large
- Search wg21 to find official site

## C++ standard releases

- 98 first standard (7 years, 21 meetings)
- 03 TC1 (5 years, 10 meetings)
- 11 second standard (8 years, 21 meetings)
- 14 revised standard (3 years, 4 + 2 meetings)
- 17 next revision (3 years, 6+2? meetings)

## C++ ballot review

- Ballot opened at the start of July, closes in October
- Report and fix problems, do not request new features
- Expect to spend two meetings resolving comments, finishing first week of March 2017
- Send to ISO for final ballot and publish by the end of the year

## Growth of standard

- C++11 had more changes to library than core
- At the beginning 46% pages were core, 54 library. In 2014, the library has twice as many pages

## Near misses for 17

- Concepts
- Coroutines MS had one way, ASIO had another
- Rebase to c11 library
- Update reference to C11
- Include header synopses for all `<cstd\*>` headers
- Add C library functions to the indices
- Deprecate some C++14 headers: ccomplex, cstdalign, cstdbool, and ctgmath
- Do not support some C headers like thread.h

## Core vocab

- Forwarding references: `template <typename T> void fn(T&&)`
- Default member initializers: `struct X { Data d = {arg, list}; };`
- Templated entity: template, member of a class template, template member of a non-template class

## Library vocab

- Contiguous iterators:
  - New iterator category without a tag
  - Can do pointer arithmetic on address of dereferenced elements
  - Array, basic_string, and vector have these
- UniversalRandom BitGenerator (not number generator)
  - Generate sequences of random bits
  - Not intrinsically numbers, which use larger groupings

## Removed by 11

- Char \*str = "literal';

## Removed by 14

- Gets

## Core Removed by 17

- Trigraphs: ??= ??1 ??/
- Register keyword (meaning of), reserved for future
- Operator++ on bool
- Auto deduction is never an initializer_list
- Exception specifications are part of the function type (`void g1() noexcept;` and `void g2()` are no longer the same type)
- Inheriting constructors simply call the base class directly rather than add new overloads

## Library features removed in 17

- Auto_ptr
- Bind1st, bind2nd, mem_fun, mem_fun_ref, ptr_fun, random_shuffle

## Language deprecations

- Static const data member definitions: prefer inline variables

## Library deprecations

- Is_literal
- Uncaught_exception -> uncaught_exceptions
- std::iterator

## Literals: 17

- UTF8 character literals `u8'u'`
- Hexadecimal floating point: `double d = 0x1234p123;`

## Attributes

- Can put attributes on namespaces
- Attributes on enumerators, e.g., `[[deprecated]]`
- Should not warn on unrecognized attributes in foreign namespaces
- Using for attribute namespaces

## Aggregates

- Aggregates allowed empty base classes
- `struct empty{};`
- `struct integer : empty {int value;};`
- `integer x

## Colonies, Performance, and Why You Should Care

Author: Matt Bentley, [www.plflib.org](http://www.plflib.org)

> "We should forget about small efficiencies about 97% of the time: premature optimization is the root of all evil. Don't pass up that 3% when you identify the critical code." - Paraphrased from Donald Knuth

## Problems with Vector

- Poor erase performance for large amount
- Poor insertion performance due to reallocation
- Insert invalidates pointers/iterators to all elements
- Requires single contiguous memory block which increases chance of allocation failures
- Most game data, described
- Elements within containers utilize elements within other containers
- Order unimportant for most part
- Small to medium-sized classes and structs the norm. not scalar, (SoA is exception)
- Erasing or deactivating occurs frequently in realtime
- Creating new objects and adding them into a game in realtime also common
- Don't always know in advance how many elements there will be (anywhere between 10 and 100,000 objects)
- Memory usage and constraints often critical considerations
- Generally don't want containers which allocate upon initialization (example: libstdc++ deque).
- Example quad tree for collision

## Workarounds

- Use boolean flag to indicate something is erase, slow to iterate, fast erasure
- Utilize secondary vector of indexes to iterate over the vector of elements. Erase from the vector of indexes only. Fast iteration, erasure can still be slow
- Neither solution frees erased element memory, slow insertion

## Colony is the Solution to These Issues

- Uses multiple memory blocks, prevents element reallocation on insertion
- Blocks are freed to OS once empty
- Blocks must be removable with low performance cost and without pointers to elements being invalidated

### Concrete

- Chained-group allocation pattern for element storage
- Doubly linked intrusive list of group structures containing memory blocks, block metadata, and skipfields
- Skipfields allow O(1) insert

### Problems with Boolean Skipfields

- ++ iteration is O(random), iterations require O(1) operations
- Boolean skipfield creates branching code in the iterator
- Counts the jumps/empty elements
- Skipfield block = number of erased elements

-To see full explanation for skipfield block, see plf paper on [plflib.org](http://www.plflib.org)\_

## Performance Results

- Colony really starts to distinguish itself for real game time scenarios.
- Delete/add elements with 1-10% elements per minute.
- Standard implementations really start to lose past 1%
- Time how long it takes to simulate 30 minutes for each implementation
- Colony useful for medium-high modification scenarios (> 1% of elements inserted/erased per 3600 iterations)
- Pointer_deque or indexed_vector for low modification scenarios (< 2% of elements inserted/erased per 3600 iterations)

## Transaction Data Structures

- Many-core processors are here (e.g., 72 x86 cores)
- Non-blocking data structures
- Progress guarantees: wait-freedom, lock-freedom, obstruction-freedom
- Linearizability: compositional, container libraries (e.g., libcds, tervel, tbb)
- These structures lack composite operations (e.g., move/delete, insert). In concurrent operation, it leaves the sets in inconsistent states
- Atomicity + isolation = strict serializability
- STM (software transactional memory) cons:
  - Memory instrumentation exhibits large overhead
  - Low-level memory conflicts do not translate to high-level semantics
- Compare-and-swap (CAS) synchronization primitive
- CAS-based retry loop
- Descriptor object
- Cooperative execution
- Queued-based multi-resource lock
  - First to guarantee FIFO fairness
  - Unbounded number of resources
  - Excels at high levels of contention
- Acquire: CAS loop to advance tail

## Exceptions

- Allow programmers to focus on the meaningful parts of the code
- Only catch exceptions when you are going to do something
- `int integraldiv(int num, int denom);`
- Options for expressing disappointment:
  - Printing something out doesn't help
  - Set up a contract. No 0. Puts burden on caller
  - Crash program. Radical but has merit. Ok if can crash
  - Add status result for success. Msft uses this
  - Can return pair with result and status like Go
  - Can return `optional<int>`
  - Throw `divide_by_zero`. Don't have info to do something. If caller doesn't care, then will crash. You'll see obvious bugs
  - In most cases, no point in catching. Do something or rethrow
- Basic array class
  - Have to grow, assign `T` both might throw
  - If the `T` assignments fail after allocation, you'll leak. Should catch to delete then throw or use RAII
- Need to know `except.terminate`
- Can use constexpr with pair or throwing version
- Purpose of exceptions: move error handling out of main code
- Pros:
  - Don't affect natural interface of functions
  - Alternative code path for unusual situations
  - They don't pollute normal code path
- Cons:
  - Alternative path can be confusing
  - Non-zero cost
  - Can be abused
  - Difficulty with boundaries. See Lippincott functions
- Costs
  - Generate 5 million integers starting from -100
  - If less than 0 throw or return
  - Try stack unwinding with no errors
  - 3% slower but compiler implementations are old. Not bad for our uses
- STL
  - Throws for `vector.at`, when your types fail, `bad_alloc`
- Boost.graph uses exceptions when it does find something
- Use for:
  - Constructors
  - Code that isn't a tight loop
- Not:
  - I/O
  - Tight loops

## Talking To C Programmers About C++

## Languages for Embedded Software

## Introduction

- One lesson: when it comes to persuasion… "if you're arguing, you're losing." Mike Thomas
- Languages for embedded software have evolved over time
  - In the beginning: assembler
  - Late 1970: c
  - Mid 1990: c++
  - Since 2005 c++ going down c going up in es usage. C++ distant second
- Problem: C++ isn't thriving in application domains where it should
- Solution: Get the word out in interesting way

## Comparing C and C++ Performance

- Compare using class and structure for memory mapped struct
- Class also mapped
- Actually get data to compare c and c++ to see if the is a perf problem. Use 3 vintages of compilers
- C++ was faster in all cases
- Reader response was negative. C++ hides things, if you used inheritance it would have been slower etc…

## Understanding People's Mindset

- Second law of consulting: "No matter how it looks at first, it's always a people problem"
- Tmm too much misinformation
- We make decisions based on our world view and emotional decisions. This carries over to c/c++
- Motivated reasoning: We make gut level decisions and use intellect to rationalize the decision.
- The mind is like the rider on an elephant.
- Address other groups concerns
  - Consider hierarchist/egalitarian vs community/individualist
- Motivated numeracy: An otherwise numerate person will likely misunderstand data if understanding it challenges his/her beliefs
- Frames filter facts: For fact to be believed it must fit existing frames
- Loss aversion: Fear of loss = 2 \* (desire for gain)
- "It won't be less efficient." can't negate this frame
- The only way to get someone to do something is by making them want to do it

## Concrete Suggestions

- Develop real insight into, and appreciation of, the c++ type system
- Data types simplify programming
- `-operator` overloading
- What's a data type?
  - A bundle of compile-time properties for an object
  - Size and alignment, set of valid values, set of permitted operations, prohibited operations
  - Implicit type conversion
- `int x[10]` what type? Array of 10 elements of int
- Array decay is temporary
- Array copy in c has to have overload for every array type and size. C++ can use templates
- Who cares: C programmers will still use arrays with c++

## General Trends

Types are one of the most important parts of c++

The standard library is huge part of everyone's efforts and the c++ community. We should be using it.

Concepts are going to enable stricter type checking for templates

Std::variant/optional will reduce state space of function values

Header only projects are growing because of templates, optimizations and ease of use

Reflection and modules will make managing large amounts of code way easier

## The Strange Details of std::string at Facebook

Speaker: Nicholas Ormrod

**Questions:**
What different string implementations exist?
What goes wrong when you try to optimize?

What is the most efficient string implementation?
**Why are they important:**
`<string>` is the most-included file at Facebook
Accounts for 18% of all CPU time spent in std

There are simple ways to optimize strings
Maybe this is an implementation?

```C++
Struct string {
Int size;
Int cap;
Char data*
};
```

Gcc string `(version < 5)`
-copy on write (pre c++11)
-all empty strings all point to empty 25 byte

**Fbstring**

Author Andrei Alexandrescu : Sheer Folly
Small string: 25 bytes
Keeps number of free spaces is in the last byte. When full the null terminator/0 is in the end
Size() assembly includes a branch to check if small or not gcc string does not
Fbstring.size() is faster because gccstring.size() has to check the heap and different page

**Testing replacing std::string with folly::fbstring**
1% performance win for every c++ program

**Killing the null terminator**
Fbstring lazily wrote \0
Added a mode that eagerly wrote ^ as terminator
C_str(), data(), will append \0

Had a blocking bug from a server team:

```cpp
Const char \* c_str() const {
…
**Added if (data[size()] != '\0')**
Data[size()]='\0';
Return data;
}
```

This breaks when page alloc, malloc, and null terminator check align. Funny how this was found

**Gcc string (version >= 5)**
Has ss0, only 15 byte capacity
Data, size very fast. Move is no longer memcopy
Size, 32, is power of 2 but size is 33% larger than fbstring
Strangeness no more!
Small string optimization is in, copy on write is out
Memory layout is important

## Keynote Developing Blockchain

**Social Credit and Blockchain**

- Social credit: instead of borrowing money, exchange ious
- Balances are tracked automatically
- Settlement is done as needed
- Default requires abandoning the currency

## Private Blockchain

- Participants are controlled
- Attacks can be mitigated
- Can react to legal process
- Can be managed
- Bitcoin has no way to recover or guard
- Good for organization of frenemies
- Redundancy is built in
- Can be self-governing

## Ledgers

- Banks have ledgers
- People want different things from ledgers
- Ledgers should not be islands
- Make payments across ledgers
- It has to be a neutral standard

## Failure conditions

- Sender wants fast release
- Sender must trust connector or task risk
- Connector does not want to incur risk
- Risk stems from inability to get receipt to the other ledger

## Byzantine General Problem

- Each side should commit if, and only if, the other side will
- At some point, at least one side must commit irrevocably
- But that will never happen unless on side commits irrevocably first
- But can't commit irrevocably until we know the other side has
- TCP does not guarantee both sides see an error
- High-value payments in ILP is a bg problem
- Consensus is a bg problem
- The double-spend problem is a bg problem
- PBFT
- Byzantine agreement protocol
- Non-faulty nodes agree
- Combines nicely with crypto

## Public Blockchains

- Must be fortresses
- Code is public
- Vulnerabilities are painful
- Development slower, maybe 10x
- Public apis
- Everyone has to switch, no betas for certain people
- Development challenges
- Resource management
- Keep up with the network
- Respond to remote queries
- Respond to local queries
- Have to cache
- Performance
- Blockchains do not scale horizontally
- Checking signatures is a big part, but people don't share keys
- Not all transactions can be parallel
- Isolation
- Transactions must be deterministic
- Some designs fail catastrophically otherwise

## Meeting Challenges with C++

- Bitcoin's primary implementation is in c++
- Move semantics
- Expensive types can have value semantics
- Copies are only made when necessary
- Often requires no code changes
- When it does, they're usually minimal
- Lambdas
- Enables visitor patterns
- Preserves layering, container holds its own lock
- Allows work to be deferred and dispatched
- Makes co-routines simple
- Compile-time polymorphism
- Polymorphic code gets fully-optimized
- It can even inline
- Responsibilities can be separated

## NuDB

- Key/value store
- Header only
- Templated visitor pattern

## AAAARGH Adopting almost always auto reinforces good habits

Andy Bond - Blizzard git.io/vi7EE
![alt text](/assets/images/events/Cpp_Con_2016/cpp_0.png "Use Auto")

## Almost-always-auto idiom

- Prefer deduced rather than explicit types
- "write code against interfaces, not implementations" - Herb Sutter
- Controversial effect on code readability vs flexibility

### Variables

- `auto&&` for general purpose locals
  - works with l and r values
  - it extends rvalue lifetime
  - works with non-copyable and non-movable types
- `const auto&` for gp immuatlbe locals
- `auto` when copy or move construction is desired
- `auto*`, `auto&`, and `decltype(auto)` are avoided

### Member variables

- Const members are limited to integral types

### Arrays

- Arrays of `auto` are not valid
- `std::experimental::make_array`

### Functions

- For returning locals or rvalues

### Lambdas

- `auto&&` for lambdas with local variables

### Observations from version 0

- A few reusable deducing functions
- Lots of difficult converting arrays to AAA style
- Individual spells are harder to spot at a glance

## AAA for branching

- Looks insane
- Expects and enforces a regular pattern for each branch

## Looping

- `std::for_each`, meant for modifying not output
- Or use accumulate-ish template
- Most standard algorithms do not support mutating range contents

## The Speed of Concurrency: Is Lock Free Faster

Speaker: Fedor G Pikus
Why do we try to write lock-free programs (duh, it's faster)
This talk is about writing efficient concurrent programs, with c++ examples
Practical concurrency in everyday applications

![alt text](/assets/images/events/Cpp_Con_2016/cpp_1.png "when to lock-free")
![alt text](/assets/images/events/Cpp_Con_2016/cpp_2.png "when to go lock free for real")

Writing lock-free programs is hard
Writing correct lock-free programs is even harder

**Rule #1:**
Never guess about performance
**Rule #2:**
Measurements must be relevant

**Cost of data sharing:**
`Atomic<int> x;` ++x from many threads
But runs slower with more threads. Cache line locks

**3 ways of synchronizing data:**
Wait free (may be impossible) Compare and swap (CAS)
Lock free (may be very hard)
Locks

**All mutexs are locks, but not all locks are mutexes**
Spinlock vs mutex
Spinlock is better than atomic and cas for most numbers of threads

**Notes from battlefield:**
Locks can be very efficient
Wait-free implementation with atomic operations is simpler and usually faster (when such exists)
Lock-free implementations using compare-and-swap are not unviersally faster than good locks. Need many threads
Usually with enough threads, lock-based implementations will fall behind:

- enough may be a lot

**Nodal container:**
Atomic push_front to linked-list
This does not work.

![alt text](/assets/images/events/Cpp_Con_2016/cpp_3.png "when to go lock free practical")
T sun memory barrier
ABA problem -> head changed from A to B to A because malloc reuses memory
Consider a shared_ptr. This solves ABA problem

**Are shared pointers thread safe?**
Reference count is incremented/decremented atomically
We need atomic shared pointer (can't have weak ref)

```C++
Atomic_load(std::shared_ptr<t>)
Std::atmoic_shared_ptr<T> in c++17
```

Atomic::exchange(reserved_value) can take ownership of N\*

- if we read reserved value try again, someone else has ownership
  If we read !reserverd_value, we own inrecrement N
- restore the old value of N\* release ownership
  This is really a spinlock using the pointer itself as a lock
  Atomic(shared_ptr) vs atomic_shared_ptr vs locking_shared_ptr
  P=q while q = p
  Locks win

**Queue**
Atomic head and tail, cas on head, and per-element ready flag
We want to measure throughput of elements
Spinlock better than this implementation
`Queue<int_512>` atomic queue runs the best
Why? Lock-guarded queue copies the element under lock
Lock-free queues copy elements on all threads independently

**"Minimally-locked" queues circa 2008: essentially a queue of pointers, memory allocation and copying is done outside of the critical section**

- memory allocation could be a problem if it does not scale
- very good if elements are already allocated by the callers and queueing pointers is ok

**Trylock queue**
Array of pointers, or ring buffer

**Doing what comes naturally**
Some perf differences come from the way they are "naturally" used
Sometimes we can learn a technique from lock-free but use it in locking programs

Lock-free: slow to get access if more than 2-3 shared variables are used or CAS loop is used
Locking: usually longer wait if access is denied, but uses less cpu time while waiting

Lock algorithms can use trylock to compute something else useful instead of waiting

**When to write lock-free code**
When perf is critical (and measured!)
For data structures with "access everywhere" global lock for all accesses is slow
Lock-free tends to win enough threads (enough can be a lot)
When synchronization is possible with 1-2 shared variables (even better, wait free)
Can you do something useful instead of waiting
The newer the hardware, the more likely the spinlock will win
