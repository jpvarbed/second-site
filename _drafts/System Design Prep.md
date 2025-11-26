---
layout: '@/layouts/post.astro'
date: '2025-11-25T20:25:23.033Z'
author:
  name: Jason Varbedian
sourceNotePath: >-
  /Users/jasonvarbedian/Documents/Obsidian/Stories/Books/Book-Like Things/System
  Design Prep.md
---
# Envelope Calculating
- 10 million seconds in a year
- 10,000 in a day
# Ranking 
- [Tweet search](https://www.hellointerview.com/learn/system-design/answer-keys/tweet-search) only store the like count when it passes specific milestones like powers of 2 or 10. Add ranking service that takes the top n tweets, get their current like count and sorts before retunring to user
	- key improvement here is only sending like update to the ingestion service when it has increased by a power of 10 and then reranking grabs more
# Youtube

# Hotel reservation
- you have room types
- you have two stage because of the reservation confirmation screen

# [Design a Local Delivery Service Like GoPuff](https://www.hellointerview.com/learn/system-design/answer-keys/gopuff)
- query availability of items, deliverable in 1 hour, by location
- customers should be able to order items
## non functional
- order from any dc within 1 hour delivery time
- availability requests should be fast (<100ms) to support search
- ordering should be strongly consistent (2 customers cant order the same product)
- support 10k dcs and 100k items in the catalog
- order volume will be O(1 m orders/day)
10 orders /second. could be 100 but easy to hit with any db
1 mil orders a day / 100k seconds /.05 * 100 = 20k queries/second for search (5% buy).

## API
```
get /availability?lat=LAT&long=LONG&items=ITEM1,Item2
POST /order
{
lat:LAT,
long:LONG,
items:ITEM1, ITEM2, ITEM3
}
```

## Core entities
start with most concrete physical or business entities (items, users) and working up to abstract ( orders, carts etc)
![[Screenshot 2024-09-01 at 10.59.51 AM.png]]
- note difference between item and item instance

## High level design
### Customers should be able to query availability of items
- Find dcs close enough to deliver in 1 hour. We also need a list of whats available from each
	- Insight: Sync dcs into memory of nearby service. Find those within 60 miles, then send to time travel service which will look at things like traffic
- get inventory availability from those dcs
	- insight: read replicas sharding by region zipcode. most queries will only hit one or two partition rather than whole data set. 
- ![[Screenshot 2024-09-01 at 1.13.16 PM.png]]
### customers should be able to order items
- strong consistency and can handle latency. check inventory, record order, update inventory atomically
- insight - orders have much lower qps. We can use serializable isolation level to ensure the transaction is atomic across an inventory table and order table in a postgresdb.
	- less good answer is 2 datastores with 3 phase commit with a transaction manager. this lets you use keyvalue store for inventory and relational for orders but you have to coordinate transactions which is more complex
- ![[Screenshot 2024-09-01 at 1.24.43 PM.png]]
- downside is if any of the items fail the whole order fails. This may or may not be desirable. E.g. device and its battery
- ![[Screenshot 2024-09-01 at 1.27.17 PM.png]]
## Deep Dive
### Cart reservations
- can use redis to lock items. TTL of 60 minutes. Each service has to be aware
- better solution: add a status flag of reserved and periodically check for expired reservations and release them. Update from reserved to sold
### optimization: late allocation of dcs
- we are running out of inventories in some dcs while others in the area are full. We need to better use inventory from the surrounding dcs.
- create a promise system, promise for an item to a user with the option of a set of DCs. Availability service will need to sum up all the promises and subtract them from the availability inventory. We will make a new allocation service to allocate promises to orders
- Resolving promises when an order is placed
- can do more advanced strategies now
## Summary
- To find DC's separate finding close by distance and close by traffic calculation
- For order consistency, can use tables in same db to update inventory and order
- For reservations, can add a status as reserved on the item instance
- For grabbing from the right dc, add a promise table, now take in order and promise and resolve to a dc instead of choosing as soon as they enter in the cart

# [Top-k youtube videos](https://www.hellointerview.com/learn/system-design/answer-keys/top-k)
## requirements
- clients should be able to query the top k videos (max 1000) for a given time period
- time periods should be limited to 1 {hour, day, month} and all time
70 billion views part day and 1 hour of youtube content is uploaded every second
## non-functional
- at most 1 min delay from view to tabulated
- results must be precise, not approximate
- system should be able to handle a massive number of views per second
- massive number of videos
- return results within 10s of ms
- economical. shouldnt need a 10k host fleet

## scale
700k tps views a second
1m videos a day
3.6b videos
4b videos * (8 bytes id + 8 byes count) = 64 gb. can keep in memory

## planning approach
1. index data from a very high volume stream, Most quantities will need to be precomputed
2. Typically have bottlenecks hidden behind bottlenecks. Solving one problem creates (at least) one more. Solve simplest and add complexity as we go
3. sliding time window adds more challenge. Start with all-time then figure out the rest

## Core entities
- video
- view
- time window
```
GET /views/top?window={WINDOW}&k={K}
Response:
{
    "videos": [
        {
            "videoId": // ...
            "views": // ...
        }
    ]
}
```

## High-level design
- try single host and then scale.
- Keep counts and heap in memory. View comes in, updates counts, and updates the top-k if that video is bigger than the biggest one
![[Screenshot 2024-09-01 at 2.02.30 PM.png]]
### Issues with basic - reliability & scale
- replicas of the single but they'd have to replay the stream
- We can put snapshots into blob storage 
- ![[Screenshot 2024-09-01 at 2.06.16 PM.png]]
- Now we have reliability but scale is tough and we have multi gb images
- use consistent hashing to partition the video ids. zookeeper can keep track of the partitions![[Screenshot 2024-09-01 at 2.08.40 PM.png]]
- 
- new top-k service which will merge all the partitions

## Deep dives
- how do we age out views?
- ![[Screenshot 2024-09-01 at 2.13.14 PM.png]]
- insight - two pointer where you are subtracting views. one is adding to all the counts and then an another edge is reading from an offset (hour, day, month). you keep 4 copies and 4x read. You also have to keep 2k instead of 1k because videos will fall out of k as you remove
- to handle read traffic we will add a 1 minute cache

## Summarize
- this is scale problem. Start off with simple and iterate as scale problems come up
- let your interviewer know you understand the complexity and going to start with something poor and iterate
- All of counts and top-k fit within memory of a single instance
- For reliability, keep snapshots in a blob storage
- For scale, consistent hash partition the videos and then a service will read from all the partitions
- For time expiry, keep a count and top-k for each time period. Have an offset for each time period that subtracts as views come in

# Uber
- super low latency for match
- consistency for matching
- do this one
- driver updates cant fit in memory. change clients to send more when driving or standing still. put what direction its going.

# [Web Crawler educative](https://www.educative.io/courses/grokking-modern-system-design-interview-for-engineers-managers/design-of-a-web-crawler)

## functional
- storing - system should be able to extract and store the content of a url in a blob store. Makes its url and content processable by the search engines for indexing and ranking purposes
- scheduling - system should have regular scheduling to update its blob stores records
## non functional
- scalability - should be distributed and multi threaded
- extensibility - support many file formats and comm protocols
- consistency - same set of rules for the data they make
- perf - self throttling on urls on a domain
- customized scheduling

## scale
- 5 billion web pages
- 2070 kb per web page
- metadata for a webpage is 500 bytes
- 10 PB of data
- 60ms per webpage is 9.5 years
- 3468 servers to complete the task in one day if one worker per machine, less if multithreaded
- 1 TB/sec or 277mb/sec per server
## Components
- **scheduler**
	- priority queue (URL frontier) - priority and updates frequency
		- queue is small in size but for scale reasons we want to split it up
		- separate queues for different priorities
		- ![[Screenshot 2024-09-02 at 12.07.07 PM.png]]
	- relational database - stores all urls with the params above.
- **dns resolver** - map hostnames to ip addresses for html content fetching. dns lookup is a time consuming process. cache ip addresses with their TTL
- **html fetcher** - downloads file content based on comm protocol. focus on http protocol for text
- **service host** - brain of the crawler
	- ![[Screenshot 2024-09-02 at 12.10.46 PM.png]]
- dedup and extractor
	- ![[Screenshot 2024-09-02 at 12.11.52 PM.png]]
	- Full Picture ![[Screenshot 2024-09-02 at 12.13.55 PM.png]]
	- How to know when to recall - based on time and if that domain has pages change increase their priority
### Improvements
- extensibility and multi-worker
- security enhancement design improvements
#### HTML Fetcher
- add ftp fetcher, update extractor and blob store for new file types
### Crawler traps
- query params, internal links, calendar pages, dynamic content, repeated/cyclic directories
- analyze url scheme, analyzing number of web pages on a domain
## Summary
- to get around rate limiting, use ip rotation and proxy servers. Introduce delays between requests and mimicking natural user behavior
- need to watch out for traps, need to eliminate duplicates

# [Design a parking lot](https://www.geeksforgeeks.org/designing-parking-lot-garage-system-system-design/#)
## Requirements
- signup and login
- parking space - actual time updates on occupancy and vacancy
- reservation system
- payment service
- navigation assistance
## non-functional
- low latency
- excessive availability

## scale
50k vehicles a month
.05 qps
200kb reservation?? 8mb/sec

![[Screenshot 2024-09-02 at 1.17.11 PM.png]]
## parking lot architecture
![[Screenshot 2024-09-02 at 1.18.17 PM.png]]


# [Web Crawler Again](https://www.hellointerview.com/learn/system-design/answer-keys/web-crawler)
- crawl from given set of seed urls
- extract text data from each web page and store the text for later processing

- adhere to robots
- crawl web in under 5 days
- handle 10b pages
- fault tolerance to handle failures gracefully
## API or system interface
input seed urls
output text data extracted from web pages
1. take seed url from frontier and request ip from dns
2. fetch html using ip
3. extract data
4. store text in a db
5. extract any linked urls from web pages and add them to the list of urls to crawl
6. repeat steps 1-5 until all urls have been crawled

## Fault tolerant and don't lose progress
- split things into smaller stages. EG get the html and then extracting the text
- store the html blob in blob storage and a db for url to blob
- sqs with exponential backoff. it has retry logic. need to make sure not try forever and move things to a DLQ

## Adherence to robots.txt
- limit to 1 request per second is standard
- respect disallow in robots
- save robots.txt for each domain we crawl. check in metadata db
- check crawl delay, if it hasnt passed then put it back on the queue
- rate limit check with redis. use jitter for retry so they dont all retry at once
## scale to 10b pages and efficiently crawl them
- 2mb page
- aws instance can handle 40 Gbps
- 400 Gbps /8 / 2 = 25k pages /sec. say 30% of bandwith = 7.5k pages /second
- 15.4 days for a single machine, 4 machines = 3.85 days
- scale parsers up and down with the crawlers
- dns caching, multiple dns providers and round robin

## Other topics
- crawler traps
- dynamic content would need headless browser like puppeteer to render and extract
- monitor service with datadog
- skip large files
- url scheduler to keep things going instead of having workers putting them in the queue directly

## Summary
- Don't forget about dns
- split things up for fault tolerance

# [Uber](https://www.hellointerview.com/learn/system-design/answer-keys/uber)
1. riders input a start location and destination and get an estimate
2. request a ride based on estimated fare
3. matched with a nearby driver
4. drivers should be able to accept/decline a request and navigate to pickup/dropoff

5. prioritize low latency matching
6. system should ensure strong consistency in ride matching to prevent any driver from being assigned 
7. handle high throughput, especially peak hours

## Core entities
- rider
- driver
- fare
- ride
- location
## API
```
POST /fare -> Fare
Body: {
  pickupLocation, 
  destination
}

POST /rides -> Ride
Body: {
  fareId
}

POST /rides -> Ride
Body: {
  fareId
}

```

## HLD riders should be able to input a start and end to get a fare

![[Screenshot 2024-09-05 at 9.26.51 AM.png]]
## Match to a driver
![[Screenshot 2024-09-05 at 9.29.18 AM.png]]
accept ride, need a notification service
![[Screenshot 2024-09-05 at 9.32.39 AM.png]]
## Deep Dive frequent driver location updates
10 mil drivers, update every 5 seconds is 2 million updates a second
redis geospatial commands like geoadd and georadius
![[Screenshot 2024-09-05 at 9.43.04 AM.png]]
## Deep dive system overload from frequent driver location updates while ensuring location accuracy
- adaptive location update intervals. send them when client is moving fast. less when stationary

## Deep dive prevent multiple ride requests from being sent to the same driver simultaneously
- distributed lock. In redis with TTL set to acceptance window of 10 seconds, ride is updated to accepted. Challenge is reliability of this db
![[Screenshot 2024-09-05 at 9.49.14 AM.png]]
- add queuing during peak for matching to drivers and riders
- shard for throughput
![[Screenshot 2024-09-05 at 9.50.28 AM.png]]

# [Saas billing](https://mecha-mind.medium.com/system-design-billing-system-844047e916ff)
- cost per usage of each service
- billing system should be able to show breakdown of the bill amount along with usage for each service for each user
- 30 day period but can query with start and end dates
- track payment
## non-functional
- highly available
- durability - no data lost
- at-most once for all billing. accurate as possible
- consistency - track across multiple regions
1 billion customers
500 million dau
50 services
1 million qps


## How to compute?
- For api $x per invocation
- For cpu $x per hour
- storage/db $x for each GB/s throughput of read/write queries
```
**usage_cost_per_unit**  
service_id, service_name, region, unit, per_unit_cost_in_usd
```

kafka api
```
topic: billing_<service_name>
**message_format**  
account_id, service_id, timestamp
```
kafka cpu (when process ends)
```
topic: billing_<service_name>
**message_format**  
account_id, service_id, start_timestamp, end_timestamp, duration
```
kafka storage when it make a query
```
topic: billing_<service_name>
**message_format**  
account_id, service_id, start_timestamp, end_timestamp, size_of_data
```

multiple kafka consumers read from topics
1. get per unit cost from a **usage_cost_per_unit** table
2. compute the cost by multiplying per unit with usage data in the message
3. insert
```
account_id, service_id, start_timestamp, end_timestamp, total_cost
```

log file and folders partitioned by 
```
<date>-<account_id>-<service_id>
```

## How to handle spanning multiple days?
- total_cost is proportionally divided between the 2 entries
## How to aggregate results at account and service levels
- for each account_id run background jobs using airflow, spark to aggregate the cost for each day, 2 days, 4 days etc
- **H(account_id, X, X+2^k)** = Total cost of customer from day X to X+2^k
## How to ensure at-most once writes to log files
- delete after read might be slow
- bloom filter to track which id has been added in log files. if transaction added bloom filter always says yes, might have false positive yes

## Tracking who paid?
NoSQL cassandra
```
usage data
account_id, start_date, end_datae, cost
```
- partition on account id.
- partition_id consistent hashing
- Logs: data/account_id/service_id. Written and uploaded to s3 buckets. hot partitioning issues 
![[Screenshot 2024-09-06 at 11.29.05 AM.png]]


# [Ad click](https://www.hellointerview.com/learn/system-design/answer-keys/ad-click-aggregator)
![[Screenshot 2024-09-06 at 11.49.27 AM.png]]
- stream processing write event. Flink or spark streaming to read events from the stream and aggregate them. Flush to db. More realistic to decrease the flink aggregation window than to decrease the spark job frequency.
- for hot shards we would add a random number to end of id
- ![[Screenshot 2024-09-06 at 11.52.08 AM.png]]
- how do we not lose any clicks? kafak and kinesis are fault tolerant. can keep retention period of 7 days. Flink has a feature called checkpointing where it writes its state to S3. can read last checkpoint and resume processing. checkpointing isnt useful with our small aggregation windows. Just read from stream again

## reconciliation
- transient errors, bad code pushes, out of order events could lead to slight inaccuracies. Periodic reconcillation job. kinesis spits out raw click to s3 and reprocess with spark and it will check for records
- ![[Screenshot 2024-09-06 at 11.56.13 AM.png]]
## protect against fake clicks
- sign impression id, store ids in cache
## query speed
- pre-aggregating data in different granularities

# [search](https://www.hellointerview.com/learn/system-design/deep-dives/elasticsearch)
- deep dive by hello
- search criteria, set of results
- document - json blobs
- index - collection of documents we want to make searchable
- mapping - telling which fields are sortable
```
{
  "properties": {
    "id": { "type": "keyword" },
    "title": { "type": "text" },
    "author": { "type": "text" },
    "price": { "type": "float" },
    "createdAt": { "type": "date" }
  }
}
```
- ![[Screenshot 2024-09-08 at 7.33.07 PM.png]]
- text & keyword. text is full text search, keyword is opaque categories. very fast but cant find fiction in nonfiction
- answer in as few requests as possible. reviews are in doc. if reviews are changing a lot or queries rarely touch them will be expensive
- ![[add_doc_to_index.png]]
- update it with version id to prevent collisions, can do field by field updates
- ![[Screenshot 2024-09-08 at 7.50.36 PM.png]]
- ![[elastic_search_queries.png]] 
- elastic search says how many hits, content, how many shards
- can put sorts in script, can sort by fields, can use score, relevance
- term frequency, inverse document frequency, favor words that dont appear in many documents
- pagination, stateful and stateless
	- ![[elasti_search_pagination.png]]
	- from 0, size 10. search after is preferable. id or date. the from/size needs you to get all the results. search after is a filter
	- how do you handle pagination where docs are being updated at the same time? elastic supports a point in time. 
	- pit keep_alive 1m, need to delete or let it expire
- how to use elastic search
	- not your primary database
	- best with read-heavy workloads
	- must tolerate eventual consistency (behind primary db)
	- denormalization is key (data is flattened into the parent document. eg store restaurant categories in resturant dc)
		- maybe include popular menu items without full inclusion
		- avoid joins
	- do you even need it
		- simple search in db might meet your needs, if you have billions you might need it
- airbnb has to search with availability, location and text search
## How elastic search works
- apache lucene
- ![[nodes_in_a_cluster.png]]
- coordinating node - API handler
- master nodes - need to be reliable, add or removes nodes, creating or deleting indicies. admin
- data node - lots of io, where data is stored
- ingest node - need cpu 
- ML - need gpu
- ![[Screenshot 2024-09-08 at 8.41.30 PM.png]]
- lucene index is 1:1 with a shard. lucene doesnt support. it has soft delete and insert.
- load them from memory. segment data is read only
	- ![[Screenshot 2024-09-08 at 8.52.41 PM.png]]
	- index is using more space/storage
	- columnar store, get  all the prices without getting all the rows
	- lucene uses docvalues. has the columnar fields
	- system makes a plan for "bill nye". can find docs with nye and then search those for bill
		- ![[Screenshot 2024-09-08 at 9.03.24 PM.png]]


## Summary
- you create a mapping, you sometimes want to denormalize
- for pagination can use point in time
- uses lucene under the hood with segments on shards. elastic search has a data, ML, coordination, ingest  and master node

- restaurant in doordash
```
{
  "id": "rest123",
  "name": "Pizza Palace",
  "cuisine": ["Italian", "Pizza"],
  "location": {
    "lat": 40.7128,
    "lon": -74.0060
  },
  "rating": 4.5,
  "price_range": 2,
  "popular_items": [
    {
      "id": "item456",
      "name": "Margherita Pizza",
      "price": 12.99
    },
    {
      "id": "item789",
      "name": "Pepperoni Pizza",
      "price": 14.99
    }
  ],
  "menu_summary": "pizza pasta salads desserts",
  "search_boost_terms": ["pizza", "Italian", "Margherita", "Pepperoni"]
}

## Meal Document:
{
  "id": "item456",
  "restaurant_id": "rest123",
  "name": "Margherita Pizza",
  "description": "Classic pizza with tomato, mozzarella, and basil",
  "price": 12.99,
  "category": "Pizza",
  "tags": ["vegetarian", "classic"],
  "ingredients": ["tomato", "mozzarella", "basil"]
}
```
 - availability could balance next 3 months every day and then range based for past that

```availability location type
{
  "id": "listing123",
  "title": "Beachfront Villa",
  "location": { "lat": 40.7128, "lon": -74.0060 },
  "price": 150.00,
  "minimum_nights": 2,
  "maximum_nights": 14,
  // ... other listing details ...
  
  "availability_summary": {
    "available_days_30": 20,
    "available_days_90": 75,
    "next_available_date": "2023-07-15",
    "last_updated": "2023-07-01T12:00:00Z"
  },
  
  "booked_dates": ["2023-07-10", "2023-07-11", "2023-07-12"]
}

## Separate Availability Index one listing per day per location
{
  "listing_id": "listing123",
  "date": "2023-07-15",
  "available": true,
  "price": 150.00,
  "minimum_nights": 2,
  "maximum_nights": 14
}

## Reservation Index (Optional)
{
  "id": "reservation456",
  "listing_id": "listing123",
  "start_date": "2023-07-10",
  "end_date": "2023-07-12",
  "guest_id": "guest789"
}

{
  "query": {
    "bool": {
      "must": [
        { "term": { "available": true } },
        { "range": { "start_date": { "lte": "2023-07-20" } } },
        { "range": { "end_date": { "gte": "2023-07-15" } } }
      ]
    }
  }
}
```

elastic search has a filter with geo distance
```
{
  "query": {
    "bool": {
      "must": [
        {
          "multi_match": {
            "query": "tacos",
            "fields": ["name^3", "cuisine^2", "description", "popular_dishes"]
          }
        }
      ],
      "filter": [
        {
          "geo_distance": {
            "distance": "5km",
            "location": {
              "lat": 40.7128,
              "lon": -74.0060
            }
          }
        }
      ]
    }
  },
  "sort": [
    {
      "_geo_distance": {
        "location": {
          "lat": 40.7128,
          "lon": -74.0060
        },
        "order": "asc",
        "unit": "km"
      }
    },
    "_score"
  ]
}
```

- geospatial db and indexing
	- redis geohash
	- postgres postgis extension
- filters on location and then text matching on this set of documents 
- bitmap intersections. roaring bitmaps can handle billions of items
- elastic search would plan the query.
- elastic search might 
- airbnb in aaws ![[Screenshot 2024-09-08 at 7.20.27 PM.png]]
- properties has create, update, delete, get property. propertyi images url, locality id with all the country address info
- route53 for domain/dns requirements
- cloudfront cdn
- ec2 cloud computing to rent virtual computers
- elasticcache is redis equiv in aws land
- elastic load balancer

# [Design Tinder](https://www.hellointerview.com/learn/system-design/answer-keys/tinder)
- users can specify filters and have other users recommended to them, filters can be on profile details and location
- user can swipe right/left on profiles one by one
- users get a match notif
non functional
- highly available
- scale to lots of daily users (20m daily actives, ~200 swipes, user/day on average)
- load recommended users fast and presentation of profiles one by one when swiping should have close to 0 loading time
- avoid showing user profiles that the user has previously been swiped on

user, swipe, match

## API
hit api again for more instead of pagination
session token or JWT
```
GET /feed?lat={}&long={}&distance={} -> User[]

POST /swipe/{userId}
Request:
{
  decision: "yes" | "no"
}
```
## Specify Filters and have other users recommended
key insight - we prepare feeds for the user, we prepare a user index with elastic search to build that index
will shard places like nyc with multiple shards

![[Screenshot 2024-09-08 at 9.11.42 PM.png]]
## Swipe left/right
- a lot of swipe data, 4b swipes a day
- cassandra
- partition by swiping_user_id
- ![[Screenshot 2024-09-08 at 9.15.07 PM.png]] downside is eventual consistency
## users get a match notif if they mutually swipe on each other
check for match on swipe
![[Screenshot 2024-09-08 at 9.16.50 PM.png]]

## avoid user profiles user has already swiped on
- create a bloom filter cache for swipes that feed builder reads
- can cache on client

## avoid stale feeds
- strict TTL for cached feeds (< 1 h), precompute for only active users,

## ensure reliable match creation
- yes swipe cache


# [Airbnb search talk 2015](https://www.youtube.com/watch?v=qeLekzZc3XU)
- availability, ranking score, location
- zookeeper via smart stack
- lucene
- forward index for ranking
- categorical and numerical properties like room type and maximum occupancy, calendar info, full text, positions indexed using lucene's spatial module (recursive prefex tree strategy). 40 fields per listing updated real time
- challenges: bootstrap index is slow, keep index in consistent in close to real time. 
- ![[airbnb_search_high_level.png]]
- CDC, binary log, insert, delete or update
- medusa stores intermediate store for context objects or thrift objects into redis. can bootstrap in 3 minutes
- ![[airbnb_flow.png]]ranking query is normally geo query or bounding box, dates, number of guests
- attempt to model host and how likely the host will make a positive decision
- ranking components: relevance (place), quality, bookability, personalization (budget, pref), desirability of location, image content analysis, new host promotion
- ![[airbnb_offline_ranking_calculation.png]]
- keep in a separate forward index structure. ranking data is updated in bulk. cant do lucene queries against those fields.
	- Doc1 -> ["apple", "banana", "cherry"]
- ![[life_of_a_query_airbnb.png]]
- pricing and social connection after limiting
- log scores from query, see if they inquired and booked, looked to see why results are ranked a certain way. test out different rankings
- ![[airbnb_ranking_debug_tool.png]]
- ranking change deployed to a % of users
- populator adds more data to the results before they are scored and ranked





# extra
distributed lock, same card for 10 different servers
card database, supports large scale access patterns, how are you going to implement distributed lock, lock on any other table
spend more time on requirements
abstraction level, keep abstraction level consistent. dont jump into detail level, chunk it. talk about high level and do later level. fraud detection. mentioned it too much. avoid generic statement like scaling. hear how you are going to do it. there is a system we need to add. hand waving statement.

taking care of security, man in middle but didnt offer solution. design interview is about solution. if you dont want to offer a solution. save those for the end. be specific and answer has to be concrete. talk about fields dont leave a hole. make sure you ask for feedback

i dont have example maybe you can ask a different scenario
