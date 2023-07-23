---
layout: "@/layouts/post.astro"
title: Clean Coder
excerpt: Review of Clean Coder
date: "2016-05-29T01:01:00Z"
coverImage: "/assets/images/books/clean_coder/cover.webp"
imgAlt: "Book cover"
audience: "Professional"
type: "Review"
subject: "Programming"
author:
  name: "Jason Varbedian"
---

Written by [Robert C. Martin](https://www.oreilly.com/library/view/clean-coder-the/9780132542913/.)
**Chapters Covered** 1-10, 14

## TOC

## Synopsis

## Book Notes

### Foreword

Robert worked on a project where he leaned on the technical team to get things done.

At the end they needed documents from the legal team to finish.

The business manager didn't want to pressure the legal team because they were professionals but felt fine doing that to the technical staff

This book is step by step how to present yourself and interact as a professional.

To be treated like professionals that means sticking with estimates and goals.

Preface:  
Anecdote about the challenger launch. The engineers at Morton Thiokol pushed even at the eleventh hour to stop the launch because the o-rings wouldn't keep their seal at such low temperatures.

Pre-requisite introduction:  
Define what it means to be a professional programmer

Anecdote about working at asc when he was 17. His computer card program didn't compile and his supervisor helped fixed it and then fired him.

He then worked fixing off line printers for a year and got hired as programmer after that.

He and a few other programmers worked 70-80 hour weeks for 8 months and shipped a working product and quit after they got 2% raises. After that he didn't have a job for a while.

He humbly asked his old boss for his job back at a lower salary and hired him.

### Chapter 1 Professionalism

####Taking responsibility
When a nonprofessional makes a mess the company cleans it up.
When a professional makes a mess he cleans it up.
Professionalism is all about taking responsibility.

He shipped code without testing the routine so he could ship on time and save face. He wasn't concerned about the customer

No customers would have lost data and no service managers would have called.

#### First, do no harm

**Do no harm to function**  
Your error rate should approach zero. Writing perfect software is impossible but that doesn't mean you aren't responsible for the errors.
**QA should find nothing**  
every time QA, or worse a user, finds a problem, you should be surprised, chagrined, and determined to prevent it from happening again.
**You must Know it works**  
Test it 100%. The only way to know it works is to test it 100%.
**Automated QA**  
The entire QA procedure for his project, FitNesse, is the execution of the unit and acceptance tests
**Do no harm to structure**  
Fundamental assumption underlying all software projects is that software is easy to change.
You must be able to make changes without exorbitant costs
Always make some random act of kindness to the code whenever you see it
**Work ethic**  
Your career is your responsibility. It is not your employer's responsibility to train you or to send you to conferences.
40 hours a week to your employer and 20 hours a week to your career. 3 hours a day. This avoids burnout because you do things that reinforce that passion
**Know your field**

- Design patterns: You ought to able to describe all 24 patterns in the GOF book and have a working knowledge of many of the patterns in the POSA books
- Design principles: you should know the SOLID principles and have a good understanding of the component principles
- Methods: XP, scrum, lean, kanban, waterfall, structured analysis, and structured design
- disciplines: you should practice tdd, object-oriented design, structured programming, continuous integration, and pair programming
- artifacts: you should know how to use: UML, DFDs, structure charts, petri nets, state transition diagrams and tables, flow charts, and decision tables
  **Continuous learning**  
  Woe to architects who stop coding, programmers who stop learning new languages, developers who fail to learn new disciplines and techniques
  **Practice**
  Practice doing a small programming problem
  **Collaboration**
  The second best way to learn is to collaborate with other people
  **Mentoring**  
  The best way to learn is to teach. Nothing will drive facts and values into your head faster and harder than having to communicate them
  **Know your domain**  
  It is your responsibility to understand the domain of the solutions they are programming.
  When you enter a new domain read a book or two on the topic. Know enough to recognize and challenge specification errors
  **Identify with your employer/customer**
  Avoid an us vs them mentality. Make sure the features you are developing are really going to address your employer's needs
  **Humility**  
  Professionals know they are arrogant and are not falsely humble. A professional knows his job and takes pride in his work.
  First to laugh as the butt of a joke and does not ridicule others

### Chapter 2 Saying No

The project manager said the project had to go live on that date and it was a disaster.

Managers job is to pursue and defend their objectives as aggressively as they can.

The why about why something takes longer normally doesn't matter

Saying no when the stakes are high is the most important time

Being a team player means representing what work you can do

Avoid saying that you'll try. That means you were holding something in reserve

Avoid passive aggressive behavior when you know the other person will fail. Get out ahead of it

Anecdote about getting a black Friday app done in two weeks. They told the developer the app was simple, add features later, extend the deadline so that they always work harder to meet it.

The fault lies with the developer who tried to be a hero which isn't being a professional. Said no to the two week deadline, no when there's no web service. Don't stop writing unit tests

### Saying Yes

Commitment has three parts:

- You say you'll do it
- You mean it
- You actually do it

**Recognizing lack of commitment**
Words and phrases to look out for
Need/should. "We need to get this done."
Hope/wish "I hope to get this done by tomorrow"
Let's "let's meet sometime"
**Commitment**
You always have something that's under your control and that you can commit to doing
I will… By… Tuesday
**Reasons you might not mean the commitment**
You rely on person x to get this done. Get what you can done
You don't really know if it can be done. Commit to specifc actions
It wouldn't work because sometimes I just won't make it. Let everyone know as soon as you know you need more time to change goals.
Creating a language of commitment may sound a bit scary, but it can help many of the communication problems programmers face today - estimations, deadlines, and face to face communication mishaps. You'll be as a serious developer who lives up to their word.

**How to say yes**
Maybe, maybe not is a type of try
When given a binary question you must answer no if your estimation doesn't fit.
A professional has a responsibility to maintain certain standards. His code needs to be tested, and needs to have tests. His code needs to be clean. And he has to be sure he hasn't broken anything else on in the system
Work hard to find creative ways to make "yes" possible

### Chapter 4 Coding

Having error sense closes the feedback loop
Behavior, mood, and attitude while writing code

- Your code must work.
- Your code must solve the problem set for you by the customer
- Your code must fit well in the existing system.
- Your code must be readable by the other programmers
  Eight good hours a day

**Worry code**
Handle your personal issues. Don't let them distract you as your code will be trash

**The zone**
Avoid the zone as you stop thinking about the big picture. Good for practice

**Music**
The author thinks this takes away from your concentration and at best helps you enter the unproductive zone

**Interruptions**
Be polite. Don't be mad if someone gets you out of the zone

**Writer's block**
Sometimes from lack of sleep. Finding a pair partner helps

**Debugging time**
Find ways to approach 0

**Subconscious**
You miss elegant solutions because the creative part of your mind is suppressed by the intensity of your focus

**Being late**
You will be late. Keep a best case, nominal and worst case estimate. Update daily
Don't include hope. Don't plan for the best case

**Overtime**
Only for short time like two or three weeks, you can afford it, there is a back up plan in place. The last part is a deal breaker

**Define done**
Everyone should follow this for tasks. Acceptance testing fits here

**Help**
You need help. Too hard to do it yourself.
As a professional you must also help others
Resign your self to helping and don't appear rushed
You must also accept and ask for help when needed

**Mentoring**
Professional duty to mentor and to seek out mentors

### Chapter 5 Test Driven Development

**Tdd:**
You must write a failing test before production code
You must not write more of a test then is sufficient to fail (compiling counts)
You must not write more production code then is sufficient to pass the test

**Benefits**
You have the courage to ship and change and clean
Code steadily improves when we can clean instead of rots

**Documentation** unit tests make great documentation

### Chapter 6 Practicing

Professionals practice
Keep turn around time low. Build times in seconds

**Coding dojo**
Practice solving new exercises or the same exercise but doing Tdd or hot keys better
Kata by your self or
Wasa versus. One programmer writes a test and the next tries to write code to pass it
Broaden your experience

### Chapter 8 Testing Strategies

Testing is not a matter of a few unit and acceptance tests.
QA should find nothing.
They are part of the team

They should work with business to create specifications and requirement documents to make automated acceptance tests

**Test automation pyramid**
**Unit tests**
Written by programmers for programmers. Specify the system at the lowest level. As close to 100% as is practical. Coverage as opposed to running without verifying behavior

**Component tests**
Written against individual components. These encapsulate business rules. Output matches input. Any other components are mocked.

Written by QA and business with assistance from development. Composed in a component testing environment such as fitnesse.

Cover roughly half the system and mostly happy path.

**Integration tests**
Assemble groups of components and test how well they communicate with each other. Other parts are mocked. Choreography tests they do not test business rules. Plumbing tests that sometimes look at performance or throughput. Typically not part of the continuous integration suite since it takes longer to run.

**System tests**
Execute against the entire integrated system. Does not test business rules directly

Covers perhaps 10%. Written by architects and tech leads

**Manual exploratory tests**
Bug bash. Not scripted

### Chapter 9 Time Management

You are expected to use your time as efficiently and effectively as possible.

**Meetings**
Meetings cost about $200 per attendee
They are necessary and huge time wasters

**Decline**
It is your responsibility to know when to decline meetings. Your manager is your biggest ally in declining. Balance this with helping people

**Leaving**
Don't be afraid to leave if the meeting goes off agenda

**Stand up**
What did I do yesterday?
What am I going to do today?
What's in my way?20 seconds each

**Iteration planning meetings**
Estimation and business value have already been calculated. 5 minutes each.
Meeting should take 5% of time in Iteration

**Focus-manna**
We run out of focus. If you feel that take a break. Physical activities like yoga recharge and increase focus mana

**Input vs output**
Writing software is a creative exercise. We must also have creative input from things like books

**Pomodoro technique**
Called tomatoes.
25 minutes of uninterrupted and then 5 minutes for distractions

**Avoidance**
Priority inversion
Avoid raising the priority of other work when you are avoiding the highest priority item. You are a professional

**Blind alleys**
When you encounter a blind alley quickly realize you are in one and have the courage to back out

**Marshes, bogs, swamps, and other messes**
Messes slow you down but you don't stop. You make progress though sheer force
The way back is shorter right now then ever will be in the future

### Chapter 14 Mentoring, Apprenticeship, And Crafts

In the 70s there weren't many senior programmers

He was fired from his first job but a mentor would have been helpful

His first mentors were watching and reading books

He describes how doctors do apprenticeship and internships.

New grads need supervision
