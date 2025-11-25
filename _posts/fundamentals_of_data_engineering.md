---
title: Fundamentals of Data Engineering
excerpt: Data Engineering and Systems
date: "2023-07-17T12:23:00Z"
coverImage: "/assets/images/books/fundamentals_of_data_engineering/cover.jpeg"
type: "Review"
subject: "Book"
author:
  name: "Jason Varbedian"
---

## Who is this book for

Stitch together tech to serve the needs of downstream data consumers such as MML engineers and analysts

Data engineering lifecycle: data generation, storage, ingestion, transformation and serving

Cloud-first approach

### who should read

Mid to senior level software engineers, ds and analysts

Data novices read for high-level ideas and then look at materials at end of each chapter

### what you’ll learn and how it will improve your abilities 

How data engineering impacts your current role

How to cut through marketing hype and choose the right tech, architecture and processes

## Part 1 Foundation and Building Blocks

## Chapter 1 Data Engineering Described

Data engineering is a superset of business intelligence and data warehousing

Data engineer gets data, stores it, and prepares it for consumption

**Data engineering**  is the development, implementation, and maintenance of systems and processes that take in raw data and produce high-quality, consistent information that supports downstream use cases, such as analysis and machine learning. Data engineering is the intersection of security, data management, DataOps, data architecture, orchestration, and software engineering.

### Data engineering lifecycle

![Data Engineering Lifecycle](/assets/images/books/fundamentals_of_data_engineering/DataEngineeringLifecycle.jpeg)

Generation -> Storage -> Ingestion -> Transformation -> Serving

#### 1980 data warehousing to the web

Date warehouse comes from 1989 from ibm after sql and relational db.

Ralph Kimball and Inmon developed their techniques for modeling business logic in the data warehouse

#### Birth of contemporary data

2003 - google file system

2004 - map reduce

2006 - Hadoop

Amazon elastic compute cloud EC2

Infinitely scalable storage systems (amazon simple storage system S3)

DynamoDB

#### 2000s and 2010s Big Data engineering

Start of big data engineers. Maintained massive clusters of commodity hardware

“Big data is like teenage sex: everyone talks about it, nobody really knows how to do it, everyone thinks everyone else is doing it, so everyone claims they are doing it.” Companies were standing up Hadoop cluster to process just a few gigabytes

#### 2020s engineering for the data lifecycle

Open-source and third party tools [https://mattturck.com/data2020/](https://mattturck.com/data2020/)

Focus on managing and governing making it easier to use, discover and improve quality over ‘biggest data’

Privacy, anonymization, data garbage collection and compliance with regulations

#### Data Engineering and data science

Data engineering is upstream from data science. Provide the inputs used by data scientists
![Hierarchy of Data Science Needs](/assets/images/books/fundamentals_of_data_engineering/HierarchyOfDataScienceNeeds.jpeg)

70-80% spent toiling in the bottom 3 parts of the hierarchy

Data from various sources -> data engineering -> data science and analytics

### Data engineering skills and activities

Optimize along axes of cost, agility, simplicity, reuse and interoperability. Modern tools abstract and simplify workflows

DE does not build ML models, create reports or dashboards, perform data analysis, build performance indicators (KPIS)

### Data Maturity and the data engineer

**data maturity** - progression toward higher data utilization, capabilities and integration across the organization. The way data is leveraged as a competitive advantage

#### Stage 1: Starting with Data

Reports or analyses lack formal structure and most requests for data are ad hoc. DE team is small and plays several roles such as DS.

Data engineer should focus on the following in orgs in this stage:

- get buy-in from key stakeholders
- Define the right data architecture, determining business goals and competitive advantage you’re aiming to achieve
- Identify and audit data that will support key initiatives
- Build a solid data foundation for future data analysts. Maybe have to also generate these reports until the team is hired

Pitfalls at this stage:

- organizational willpower. Quick wins will likely establish tech debt
- Data team works in bubble without getting feedback
- use off-the-shelf turnkey solutions wherever possible
- Build custom solutions and code only where this creates a competitive advantage

### Stage 2: Scaling With Data

Formal data practices.
Challenge is creating scalable data architectures. Roles move from generalist to specialist

Goals:

- Establish formal data practices
- create scalable and robust data architectures
- Adopt devOps and DataOps practices
- Build systems that support ML
- Continue to avoid undifferentiated heavy lifting. Only code when its a competitive advantage
  Pitfalls:
- Temptation to adopt bleeding edge tech. Tech decisions should be driven by value they’ll deliver
- Main bottleneck is not nodes or storage but the data engineering team. Focus on simple
- Avoid framing yourself as a technologist, shift to communicating the practical utility of data

### Stage 3: Leading with Data

Company is data driven. Automated pipelines and systems allow people within the company to do self-service analytics and ML.
Introducing new data sources is seamless
Goals:

- create automation for seamless introduction and usage of new data
- Building custom tools and systems that leverage data
- Enterprisey aspects of data, data management and DataOps
- Create a community and environment where people can collaborate and speak openly, no matter their role or position.

Pitfalls:

- Complacency. Constantly focus on maintenance and improvement of risk falling back to a lower stage
- Technology distractions are most tempting

### Background and Skills of a Data Engineer

Must understand data and technology. Knowing about various best practices around data management. Know about options for tools and their tradeoffs. It’s a holistic practice understanding the business requirements

- Communicate with nontechnical and technical people
- How to scope and gather business and product requirements
- Control costs
- Learn continuously

#### Technical Responsibilities

Security, data management, data ops, data architecture, orchestration, software engineering

Data engineers focus on high-level abstractions writing pipelines within an orchestration framework but there will be need to dive in.
Languages to know:

- SQL -dbs and lakes
- Python - bridge between data engineering and science. ‘The second best language for everything’
- JVM languages - Apache open source projects. More performant
- Bash - scripting, ask or sed to process files

### Continuum of Data Engineering Roles, from A to B

Type A data scientist - A for analyst
Type b - b for building

Type a data engineer - abstraction. Manage lifecycle mainly by using entirely off-the-shelf products, managed services and tools
Type b - build data tools and systems that scale and leverage a company’s core competency. Found at stage 2 and 3

Internal vs external. Analysis vs features. External has much larger concurrency loads

DE sit between upstream data producers and downstream consumers

#### Upstream Stakeholders

Data architects - bridge between technical and nontechnical sides. Help design application data layers that are the source systems
software engineers - generating the internal data that engineers will consume and process. Application event data and logs

#### Downstream stakeholders

Data scientists - build forward-looking models to make predictions and recommendations
Data analysts - seek to understand business performance and trends. Focuses on past or present. Run SQL queries in a data warehouse or data lake. Power BI, looker or tableau.
ML Engineers and AI researchers - train models, design and maintain ML infrastructure

### Data in the C-suite

CEO - DE Provides a window into what’s possible with data.
CIO - internal tech
CTO - external facing applications. Normally DE reports here
CDO - company’s data assets and strategy. Oversee data products, strategy, initiatives and core functions. Occasionally manage DE
CAO - responsible for analytics, strategy and decision making for the business. May oversee DS and ML
Chief algorithms officer - recent innovation in c-suite. Experience as IC in DS or ML projects. Background in ML research. Conversant in current ML research and deep technical knowledge of their company’s ML initiatives

## Chapter 2 the Data Engineering Lifecycle

Move beyond viewing DE as a specific collection of data technologies. Become a data lifecycle engineer.

DE lifecycle turn raw data ingredients into a use end product.

The data engineering lifecycle is a subset of the data lifecycle.
Generation -> Ingestion -> Transformation 0

### Generation: Source Systems

#data #datascience #engineering #techbookclub #books
