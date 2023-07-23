---
layout: "@/layouts/post.astro"
title: The Mythical Man Month
excerpt: Review of The Mythical Man Month
date: "2023-03-18T12:53:00Z"
coverImage: "/assets/images/books/mythical_man_month/cover.webp"
imgAlt: "Cover"
audience: "Professional"
type: "Review"
subject: "Book"
author:
  name: "Jason Varbedian"
---

Written by [Fred Brooks](https://www.oreilly.com/library/view/mythical-man-month-the/0201835959/)
20th edition
**Chapters Covered** 1-7

## Synopsis

The book discusses the challenges of managing large software development projects and offers solutions to common problems. Covers project planning, staffing, communication, conceptual integrity, and system design. The author stresses the importance of clear communication, division of labor, and careful project management to ensure the success of a software development project. He also emphasizes the need for conceptual integrity in system design and discusses the benefits of separating architectural effort from implementation. The book provides insights and practical advice that are still relevant today for anyone involved in managing or working on a large software project.

## Review

This is a classic and seminal work in software engineering. It is THE software engineering book.
Every project, product and engineering effort I've ever done has used some of the concepts laid out in this book.

## Who Should Read This Book?

Every software engineer, manager, ic, director and head of engineering. You probably are already living this life.

## My Book Notes

### Preface

1st edition preface says there have been conferences but it’s not in shape for a systematic textbook treatment

Was a hardware guy mostly. This book is a belated answer to tom waton’s questions as to why programming is hard to manage

The critical need to be the preservation of the conceptual integrity of the product itself

### Chapter 1 tar pit

Everyone has trouble and gets stuck like in tar pits

Garage duos do something really cool why not always duos.

Program vs programming product - tested, works for everyone on a wide range of inputs, documentation. Programming product costs 3x a program.

Programming system is a collection of interacting programs

Programming system component must conform in syntax and semantics and only use a certain number of resources

Must be tested with other system programs and tested in combinations

Programming systems product cost nine times as much but is the truly useful object

#### The joys of the craft

1.  Sheer joy of making things
2.  Pleasure of making things that are useful to other people
3.  Fascination of solving complex problems and puzzles
4.  The joy of always learning which springs from the nonrepeating nature of the task. The problem is ever new
5.  Working in such a tractable medium. Works only slightly removed from pure thought-stuff. He builds his castles in the air. One types the correct incantation on a keyboard, and a display screen comes to life, showing things that never were nor could be.

It’s fun because it gratifies creative longings built deep within us and delights sensibilities we have in common with all men

#### The woes of the craft

1.  one must perform perfectly. Humans are not accustomed to being perfect and adjusting to the requirement is the most difficult part of learning
2.  Dependence on another persons programs not just a person
3.  Designing grand concepts is fun, finding nitty little bugs is just work. Hours of tedious, painstaking labor
4.  Debugging has a linear convergence or quadratic sort at the end where each last bug takes more time to find than the first
5.  The product on which one has labored appears obsolete. Already colleagues and competitors are in hot pursuit of new and better ideas. Obsolescence of an implementation must always be measured against another existing implementation not unrealized concepts

### Chapter 2 the mythical man-month

More projects have gone awry for lack of time than all other cases combined

1.  Our techniques for estimating are poorly developed, assume all things will go well.
2.  Fallaciously confuse effort with progress, assumption that men and months are interchangeable
3.  Because we are uncertain with our estimates, we aren’t stubborn enough about asking for more time
4.  Schedule progress is poorly monitored
5.  When schedule slippage is recognized, natural response is to add manpower which is like adding gasoline to a fire

This chapter leaves monitoring and considers other aspects

#### Optimism

All programmers are optimists. Perhaps hundreds of frustrations drive away all but those who focus on the end goal. “This time it will surely run or I just found the last bug”

The idea, the implementation, the interaction the mind of the maker. Interaction is when program is run

Mentions Christian doctrine. Would be very weird to see in a book today.

The incompleteness and inconsistencies of our ideas become clear only during implementation. This is why writing, experimentation and “working out” are essential disciplines

We often blame the medium because its not ours like the idea (paint dries weird, wood splits wrong)

**Because our medium is tractable, we expect few difficulties in implementation, hence our optimism.** Our ideas are faulty and they have bugs. Sometimes we will have no problems on a probability distribution but the prob of no bugs on a big project is vanishingly small.

#### The man month

Cost varies as the product of men and number of months but progress does not. It is a dangerous and deceptive unit of measurement. It implies men and month are interchangeable

Only interchangeable when a task can be partitioned with no communication among them

The bearing of a child takes 9 months no matter how many women

If it can be partitioned but need communication you must add on work for communication & training on the project goals, strategy and plan.

If each part must be separately coordinated with each other part, effort increases as n(n-1)/2. 3 requires 3 times as much as 2, 4 requires six times as much as 2.

[Figure 2.4]
![alt text](/assets/images/books/mythical_man_month/figure_2_4.webp "Time To Execute")

#### Systems test

- 1/3 planning
- 1/6 coding
- 1/4 component test and early system test
- 1/4 system test, all components in hand

Different from normal:

1.  Planning is larger than normal and barely enough. Does not include time for research
2.  The half of the schedule devoted to debugging of completed code is much larger than normal
3.  The part that is easy to estimate is given only 1/6 of the schedule

Delay on the systems test is disastrous since the delay comes at the end and no one is aware until almost the delivery date. Has psychic damage, project is fully staffed so cost per day is at max

#### Gutless estimating

The urgency of the patron may govern the scheduled completion but it cannot govern the actual completion

Omelette not set in 2 minutes the customer can wait or eat it raw, cook can turn up the heat but then its burned in one part, raw in another

It is difficult to make a vigorous, plausible and job-risking defense of a hand wavy estimate based on hunches. We need to publish data on productivity

#### Regenerative schedule disaster

If you miss the first milestone, take no small slips and reschedule enough that you won’t have to reschedule again.
You can also trim.
If you add more men, you will need longer in the systems testing portion. This is why running with an integrated branch as early as possible is important
Adding manpower to a late software project makes it later.

### Chapter 3 the surgical team

Young managers prefer a small sharp team. Everyone prefers that to mediocre
How does one build large systems on a meaningful schedule?

#### The problem

The small team is too slow for really big system. If you tried to do the 5000 man hour job with 10, 7 times more productive, 7 times more communication efficient.

#### Harlan mills proposal

Each segment of a large job be like a surgical team rather a hog butchering. Instead of each member cutting away, one does the cutting and the others give him every support.

Who are the anesthesiologists and nurses?:
**Surgeon** - tech lead, chief programmer, 10 years experience, great talent, systems and application knowledge
**Co-pilot** - alter ego of the surgeon, able to do any part of the job but less experienced. Share in the design as a thinker. Represents his team is discussion of function and interface with other teams. Knows all code, researches alternative design strategies, writes code
**Admin** - surgeon is boss and has last word on personnel, raises, space but he must spend none of his time. This person handle the business, legal etc
**Editor** - surgeon is responsible for generating the documentation. The editor takes the draft and criticizes it, reworks it, provides references
**Secretary** for admin and editor
**Program clerk** - not really necessary now. Maybe like ops?
**Tester** - qa. Is an adversary
**Language lawyer/expert** - talent is different from the surgeon. Finds ways to do difficult, obscure or tricky things. One lawyer can service 2-3 surgeons
**Scaling up**
Is it possible to put 200 people? You only have to coordinate the 20 surgeons. The entire system must have conceptual integrity and requires a system architect to design it all from the top down.

### Chapter 4 aristocracy, democracy and system design

#### Conceptual integrity

Most European cathedrals show differences in plan or style between parts built in different generations by different builders. Reims cathedral looks wonderful b/c 8 generations of builders sacrificed their ideas to stick to the design.

**Conceptual integrity is the most important consideration in system design**

1.  How is conceptual integrity to be achieved
2.  Does not this argument imply an elite or aristocracy of architects and a horde of plebeian implementers whose talents and ideas are suppressed?
3.  How does one keep the architects from drifting off into the blue with unimplementable or costly specifications?
4.  How does one ensure every detail is communicated to the implementers, properly understood by him, and accurately incorporated

#### Achieving Conceptual Integrity

Ease of use is the purpose the ratio of function to conceptual complexity is the ultimate test of system design.

Simplicity is not enough. Things need to be straightforward. The user has to learn about the unexpected combinations of basics. Every part must reflect the same philosophies and the same balancing of desiderata. Ease of use, then dictates unity of design

#### Aristocracy and Democracy

Separation of architectural effort form implementation is a powerful way of getting conceptual integrity

_Architecture_ - the complete and detailed specification of the user interface. Architect is an agent of the user, bring to bear the best features as opposed to interests of the salesman etc
Architecture is what happens, implementation is how. For a clock consists of the face, the hands and the winding knob

The author argues that conceptual integrity is more important than many good features and ideas that do integrate with a system’s basic concepts.

The setting of external specifications is not more creative work than the designing of implementation, just different. The cost-performance ratio of the product will depend most heavily on the implementer.

“Form is liberating”. External provision of an architecture enhances, not cramps, the creative style of an implementing group. **In an unconstrained implementing group, most thought and debate goes into architectural decisions, and implementation proper gets short shrift.**

#### What Does the Implementer Do While Waiting?

The author had a choice of having the architecture manager and his team of 10 do the specs but the implementer manager said they can do it together with his 150 dudes. The architecture manager said they could do it in 10 months which was 3 over schedule.

The author should have gone with the architecture manager because it added more time to make the specs and much more time for debugging

### Chapter 5 The Second-System Effect

If one separates responsibility for functional specification from responsibility for build a fast cheap product what makes it happen? Careful and sympathetic communication between architect and builder

#### Interactive Discipline for the Architect

Architect can cut the design or challenge the estimate by suggesting cheaper implementations.

To do the latter successfully architect must:

1.  Remember that the builder has the inventive and creative responsibility for the implementation; so the architect suggests, not dictates
2.  Always be prepared to suggest a way of implementing anything he specifies, and be prepared to accept any other way that meets the objectives as well
3.  Deal quietly and privately in such suggestions
4.  Be ready for forego credit for suggested improvements

Normally the builder will suggest some changes, often he is right.

#### Self-Discipline — The Second-System Effect

Be spare and clean, put frill and embellishment away for next time.

The first system is finished, has demonstrated a mastery of that class and is ready to build a second. The second is the most dangerous system a man ever designs.

Second system tendency is to over-design, using all the ideas and frills that were sidetracked because the architect can’t tell yet what is particular and what is generalizable.

For OS/360 example, 26 bytes for handling December 31 on leap years

Another second system effect is to refine techniques who‘s existence has been made obsolete \* I did not understand any of the examples but tl;dr don’t overengineer when you can switch tech

Exert extra self discipline on second system to avoid extrapolation of functions

Assign each function a value: capability x is worth not more than m bytes of memory and n microseconds per invocation.

Project manager can stay aware of the special temptations

### Chapter 6: passing the word

How shall the manager ensure that everyone hears, understands and implements the architects decisions

#### Written specifications — the manual

Necessary but not sufficient. External specification of the product. Every detail of what the user sees, must refrain from describing what the user doesn’t see (implementation)

Style must be precise, full and accurately detailed

Must repeat essentials since users will often refer to just one definition

10 men made the ideas for principles of operation but only 2 can write it. There will be a host of mini decisions which are not of full-debate importance.

Must describe what is not prescribed as carefully as what is

#### Formal Definitions

English or other language is not naturally a precision instrument

Formal definitions are precise and complete since gaps are easy to see but they lack comprehensibility

“Never go to sea with two chronometers; take one or three”

Same with prose and formal definitions. One has to be the standard. Formal definition as standard and prose as descriptive or can go vice versa

A formal definition is an implementation and so can an implementation serve as a formal definition

Can use a simulator. Side effects may occur which is over specification

Must refrain from modifications to the implementation while it is the standard

Direct Incorporation

Design the declaration of the passed parameters or shared storage

#### Conferences and Courts

Meetings are necessary. Hundreds of man-to-man must be supplemented by larger and more formal gatherings.

Two levels:
Weekly half-day conference of all the architects, plus official representatives of the hardware and software implementers and market planners. Chief architect presides

Proposals are distributed in writing before the meeting. A new problem is discussed a while. Emphasis on creativity rather than merely decision. Invent many solutions to problems, then a few solutions are passed to one or more of the architects for detailing

If consensus emerges well and good, if not the chief decides. Minutes are kept and decisions are formally, promptly and widely disseminated

1.  The same group meets weekly for months, no time to bring people up to speed
2.  The group is bright, resourceful and well versed, deeply involved in the outcome. No one has an ‘advisory’ role. Everyone is authorized to make binding commitments
3.  When problems are raised, solutions are sought both within and outside the obvious boundaries
4.  Focuses attention, forces decision and avoided committee drafted inconsistencies
5.  Clear vesting of power in chief avoids compromise and delay

Some decisions don’t wear well, not accepted or bring up appeals. Every 6 months have a 2 week Supreme Court sessions. Held just before major freeze dates for the manual

The project managers presided. 200 items mostly minor

#### Multiple Implementations

Machine and manual don’t agree, the manual usually loses for it can be changed cheaper and quicker. When there are multiple implementations this isn’t so. Things will be built tighter if there are at least 2 implementations

#### The Telephone Log

Encourage the puzzled implementer to telephone the responsible architect rather to guess and proceed.

Architect records every question and every answer from implementers. Every week collate from all architects and distribute

#### Product Test

PM’s best friend is his daily adversary, the independent test org

### Chapter 7 Why did the Tower of Babel fail?

The lord fucked everyone up because they would be too powerful with one language?

#### A Management Audit of the Babel Project

Let us look at this as a retro

1.  A clear mission? Yes, although naively impossible. The project failed long before it ran into this fundamental limitation of reaching heaven
2.  Manpower? Plenty of it
3.  Materials? Abundant
4.  Time? No hint of time constraint
5.  Tech? Masonry was well understood

It failed because of communication and its consequent, organization. Bad feelings and group jealousies

### Communication in the Large Programming Project

How shall teams communicate:

1.  Informally. Good telephone service and a clear definition of inter group dependencies will encourage calls (messages)
2.  Meetings. Regular project meetings. Teams giving technical briefings to smoke out misunderstandings
3.  Workbook

### The Project Workbook

Structure imposed on the documents that the project will be producing - basically a wiki
Why - technical prose is almost immortal. Can trace customer manual back to first design
Tomorrow’s memos/marketing comes from todays designs.
Control distribution of information. Not to restrict to make sure that relevant gets to all the people who need it

Covers how you would do it in the past

But important part would be to look at the daily change summary

Organization in the large programming project

N workers then there are n^2-n/2 interfaces with potentially 2^n teams. The purpose of organization is to reduce the amount of communication

Tree structure for no man can serve two master does not match communication. Essentials any sub tree must have to be effective:

1.  A mission
2.  A producer
3.  A technical director or architect
4.  A schedule
5.  A division of labor
6.  Interface definitions among the parts

**Producer** - assembles the team, divides the work, establishes the schedule. Communication outside team upwards and sideways. Shifting resources, pattern of communication inside of the team

**Technical director** - conceives of the design to be built, how it will look from the outside, sketches internal. Serves as a limit on the system complexity

Organizations must be designed around the people available; not people fitted into pure-theory organizations

**The producer and the technical director may be the same man.** Very small teams 3-6 programmers. On larger projects not usually. The man with strong management talent and strong technical talent is rarely found. Thinkers are rare, doers are rarer and thinker-doers are rarest

On a large project both roles are a full time job or more. It is hard for producer to delegate enough to have technical time. It is impossible for the director to delegate without compromising conceptual integrity

**The producer may be the boss, the director his right-hand man**

Talk privately about issues, give subtle symbols of status to director. The job least well done by pm is to utilize the technical genius who is not strong on management talent.

**The director may be boss, and the producer his right-hand man.** Maybe more suitable for small teams

## Book Club Notes

Book was in 1971 so what kind of project was this.

People and time are not interchangeable

Have to onboard them and get them onto speed

If you add more people you have to communicate more

Each person adds possibly N more links

Datedness - yearly council would be like a pr today or a design review

Liked characterization of architect

Concept of being a tester is outdated

Team analogy still applies but everyone is evaluated the same was as what's your output

Surgeon and co-surgeon and people who support them

He's a bit of a romantic and talks about the joy and woes of the craft.

He is rare blend but if someone who was an asshole it would be a hard system to follow.

Developing a system and maintaining an existing system.

Technical director for making a new system and producer for maintaining

Every chapter started off with a reference to a biblical fable because those were more culturally well known. Maybe now we'd use succession.

I liked the telephone log of questions to seniors released and then have everyone the weekly updates to the wikis.

Advocated for having one person be the ultimate decision maker

"Authority is acquired from the very momentum of accomplishment"

"The obsolescence of an implementation must be measured against other existing implementations, not against unrealized concepts"

Now you can build massive things with very few people. The amount you get per line

But expectations are much higher

Project workbook -> wiki

"Conceptual integrity is the most important consideration in system design"

Systems test

1/3 planning

1/6 coding

1/4 component test and early system test

1/4 system test, all components in hand

When you miss your first milestone, default assumption is that the rest of the estimates were right. This happens in real life. Gutless estimating

Act like you have infinite money and go make a thing. But then once you do they add constraints.

When you were reading about the surgical team were you dreaming of being the surgeon. Then there was so many clerks and non-coders

Toolsmith, language lawyer/expert, co-pilot, secretary manager/pm

Post-mortem - normally could have caught but the other person didn't have enough context

Just big enough for 2 people and reviewing your code back and forth

Should we always have a code buddy

Should you always throw away your first thing?  
I think 99% of the time if it’s longer than 6 months you'll re-write because you forgot about some abstraction.

Kind of like the prototype stage of a build

Having done a V2 is it much better than being on a team without a v2 trying to maintain v1.

A lot of times your objective changes during your V1 which has pretty detrimental affect on your codebase.
