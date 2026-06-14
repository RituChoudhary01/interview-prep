/**  to show All the databases
show dbs

my database is not listed. This is because the database is empty. An empty database is essentially non-existant.

change or create a database
you can change or create a new database by typing use then the name of the database.
create a new database called "blog"
use blog

***In Mongodb, a database is not actually created until it gets content!

Creating collection using mongosh
there are 2 ways to create a collection.
Method1
you can create a collection using the createCollection() database method.
db.createCollection("posts")
Method2
you can also create a collection during the inset process
we are here assuming object is a valid javascript is a valid javascript object post data:
db.posts.insertOne(object)
this will create the posts collection if it does not already exist.

***In mongodb a collection is not actually created until it gets content

Insert Documents
there are 2 method to insert documents into a mongodb database.
insertOne()
To insert a single document, use the insertOne() method
this method inserts a single object into the database

db.posts.insertOne({
title:"Post Title 1",
body:"Body of post.",
category:"News",
likes:1,
tags:["news","events"],
date:Date()
})

*** if you try to insert documents into a collection that does not exist, MongoDB will create the collection automatically.

insertMany()
to insert multile documents at once, use the insertMany() method.
this method inserts and array of objects into the database

db.posts.insertMany([
{
title:"Post Title 2",
body:"Body of post.",
category:"Event",
likes:2,
tags:["news","events"],
date:Date()
},
{
title: "Post Title 3",
body: "Body of post.",
category: "Technology",
likes: 3,
tags: ["news", "events"],
date: Date()    
}
])

Find Data
There are 2 methods to find and select data from a mongoDB collection, find() and findOne().
find()
To select data from a collection in mongoDB, we can use the find() method.
This method accepts a query object if left empty, all documents will be returned
db.posts.find();
findOne()
To select only one document, we can use the findOne() method.
This method accepts a query object. If left empty, it will return the first document it finds.
This method only returns the first match it finds
db.posts.findOne()
Querying Data
To query or filter data we can include a query in our find() or findOne() methods.
db.posts.find({category:"News"})
Projection
Both find method accept a second parameter called projection
this parameter is an object that describes witch fields to include in the results.
This parameter is optional if omitted,all fields will be included in the results.
This example will only display the title and date fields in the results.
db.posts.find({},{title:1,data:1})
Notice that the _id field is also included. This field is always included unless specifically excluded.
We use a 1 to include a field and 0 to exclude a field.
This time, let's exclude the _id field.
db.posts.find({},{_id:0,title:1,date:1})
***you cannot use both 0 and 1 in the same object. This only exception is the _id field. You should either specify the fields you would like to include or the fields you would like to exclude.

let's exclude the date category field. All other fields will be included in the results.
db.posts.find({},{category:0})

We will get an error if we try to specify both 0 and 1 in the same object.
db.posts.find({}, {title:1,date:0})

Update Document
To update an existing document we can use the updateOne() or updateMany() methods.
The first parameter is a query object to define which document or documents shoud be updated.
The second parameter is an object defining the updated data.
updateOne()
The updateOne() method will update the first document that is found matching the provided query.

let's see what the "like" count for the post with the title of "Post Title 1":
db.posts.find({title:"Post Title 1"})
\Now lets updated the "likes" on this post to 2. To do this, we need to use the $set operator
db.posts.updateOne({title:"Post Title 1"},{$set:{likes:2}})

Check the document again and you'll see that the "like" have been updated
db.posts.find({title:"Post Title 1"})

Insert if not found
if you would like to insert the document if it is not found, you can use the upsert option

update the document, but if not found insert it:
db.posts.updateOne(
{title:"Post title 5"},
{
$set:
{
       title: "Post Title 4",
        body: "Body of post.",
        category: "Event",
        likes: 5,
        tags: ["news", "events"],
        date: Date()
}
},{upsert:true}
)

updateMany()
The updateMany() method will update all documents that match the provided query.
Update likes on all documents by 1. For this we will use the $inc operator:
db.posts.updateMany({},{$inc:{likes:1}})
Now likes in all of the documents and you will see that they have all been incremented by 1.

Delete Documents
we can delete documents by using the methods deleteOne()  or deleteMany()
These methods accept a query object. THe matching documents will be deleted.
deleteOne()
The deleteOne() method will delete the first document that matches the query provided.
db.posts.deleteOne({title:"Post Title 5"})
deleteMany()
the deleteMany() method will delete all documents that match the query provided.
db.posts.deleteMany({category:"Technology"})

MongoDB Query Operators
There are many query operators that can be used to compare and reference document fields.
Comparison
The following operators can be used in queries to compare values:
$eq: Values are equal
$ne:Values are not equal
$gt:Values is greate than another value
$gte:Value is greater than or equal to another value
$lt:Value is less than another value
$lte:value is less than another value
$lte:value is less than another value
$in:Values is matched within an array

Logical
The following operators can logically compare multiple queries.
$and:Returns documents where both queries match
$or:Returns documents where either query matches
$nor:Returns documents where both queries fail to match
$not:Returns documents where the query does not match

Evaluation
The following operators assist in evaluating documents:
$regex:Allows the use of regular expressions when evaluating field values
$text:Performs a text search
$where:Uses a javaScript expresion to match documents

MongoDB update Operators
There are many update operators that can be used during document updates.
Fields
The following operators can be used to update fields:
$currentDate: Sets the field value to the current date;
$inc:Increments the field value
$rename:Renames the field
$set:Sets the value of a field
$unset:Remove the field from the document

Array
The following operators assist with updating arrays.
$addToSet:Adds distinct elements to an array
$pop:Remoes the first or last element of an array
$pull:Removes all elements from an array that match the query
$push:Adds an element to an array

MondoDB Aggregation Pipelines
Aggregation Pipelines
Aggregation operations allow you to group, sort, perform calculations, analyze data, and much more.
Aggregation pipelines can have one or more "stages". The order of these stages are important. Each stage acts upon the result of the previous stage.
ex:
db.posts.aggregate([
// Stage1:Only find documents that have more than 1 like
{
$match:{likes:{$gt:1}}
},
// stage2: Group documents by category and sum each categories likes
{
$group:{_id:"$category",totalLikes:{$sum:"likes"}}
}
])

MongoDB Aggregation $group
Aggregation $group
This aggregation stage groups documents by the unique _id expression provided.
Donot confuse this _id expression with the _id objectId provided to each document.
db.listingAndReviews.aggregate(
[{$group:{_id:"$property_type"}}]
)
This will return the distinct values from the property_type field.

Aggregation $limit
This aggregation stage limits the number of documents passed to the next stage.
db.movies.aggregate([{$limit:1}])
This will return the 1 movie from the collection.

MongoDB Aggregation $project
This aggregation stage passes only the specifired fields along to the next aggregation stage.
This is the same projection that is used with the find() method.
db.restaurants.aggregate([
{
$project:{
"name":1,
"cuisine":1,
"address":1
}
},
{
$limit:5
}
])
This will return the documents but only include the specified fields.
Notice that the _id field is also included. This field is always included unless specifically excluded.
We use a 1 to include a field and 0 to exclude a field.
You cannot use both 0 and 1 in the same object. The exception is the _id field. You should either specify the fields you would like to include or the fields you would like to exclude.

Aggregation $sort
This aggregation stage groups sorts all documents in the specified sort order.
Remember that the order of your stages matters.
Each stage only acts upon the documents that previous stages provide

db.listingAndReviews.aggregate([
{
$sort:{"accommodates":-1}
},
{
$project:{
"name":1,
"accommodates":1
}
},
{
$limit:5
}
])
This will return the documents sorted in descending order by the accommodates field.
The sort order can be chosen by using 1 or -1. 1 is ascending and -1 is descending.

Aggregation $match
THis aggregation stage behaves like a find. It will filter documents that match the query provided.

Using $match early in the pipeline can improve performance since it limits the number of documents the next stages must process.

db.listingsAndReviews.aggregate([
{$match:{property_type:"House"}},
{$limit:2},
{$project:{
"name":1,
"bedrooms":1,
"price":1
}}
])

This will only return documents that have the property_type of "House".

Aggregation $addFields
This aggregation stage adds new fields to documents.
db.restaurants.aggregate([
{
$addFields:{
avgGrade:{$avg:"$grades.score"}
}
},
{
$project:{
"name":1,
"avgGrade":1
}
},
{
$limit:5
}
])
This will return the documents along with a new field, avgGrade, witch will contain the average of each restaurants grades.score.

Aggregation $count
This aggregation stage counts the total amount of documents passed from the previous stage.
db.restaurants.aggregate([
{
$match:{"cuisine":"Chinese"}
},
{
$count:"totalChinese"
}
])
This will return the number of documents at the $count stage as a field called "totalChinese".

Aggregation $lookup
This aggregation stage performs a left outer join to a collection in the same database.
There are four required fields:
1. from:The collection to use for lookup in the same database
2. localField: The field in the primary collection that can be used as a unique identifier in the from collection.
3. foreignField: The field in the from collection that can be used as a unique identifier in the primary collection.
4 as:The name of the new field that will contain the matching documents from the from collection.

db.comments.aggregate([
{
$lookup:{
from:"movies",
localfield:"movie_id",
foreignField:"_id",
as:"movie_details",
},
},
{
$limit:1
}
])
This will return the movie data along with each comment.

Aggregation $out
This aggregation stage writes the returned documents from the aggregation pipeline to a collection.
The $out stage must be the last stage of the aggregation pipeline.
db.listingAndReviews.aggregate([
{
$group:{
_id:"$property_type",
properties:{
$push:{
name:"$name",
accommodates:"$accommodates",
price:"$price",
},
},
}.
},
{
$out:"properties_by_type"
},
])

The first stage will group properties by the property_type and include the name, accommodates, and price fields for each. The $out stage will create a new collection called properties_by_type in the current database and write the resulting documents into that collection.

Indexing and search
Mongodb Atlas comes with a full-text search engine that can be used to used to search for documents in a collection.

Creating an index
We,ll use the Atles dashboard to create an index on the "sample_mfilx" database.
1. From atles dashboard click on your cluster name then the Search tab.
2. Click on the Create Search Index button.
3. Use the Visual Editor and click Next.
4. Name your index, choose the Database and COllection you ant to index and click Next.
. If you name your index "default" you will not have to specify the index name in the $search pipeline stage.
. Choose the sample_mflix database and the movies collection.
5. Click Create Search Index and wait for the index to complete.

Running a query.
To use our search index, we will use the $search operator in our aggregation pipeline.
db.movies.aggregate([
{
$search:{
index:"default",
text:{
query:"star wars",
path:"title"
},
},
},
{
$project:{
title:1,
year:1,
}
}
])

The first stage of this aggregation pipeline will return all documents in the movies collection that contaain the word "star" or "wars" in the title field.
The second stage will project the title and year fields from each document.

Schema Validation
By default MOngoDB has a flesible schema.This means That there is not strict schema Validation set up initially
Schema validation rules can be created in order to ensure that all documents in a collection share a similar structure.

db.createCollection("posts", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [ "title", "body" ],
      properties: {
        title: {
          bsonType: "string",
          description: "Title of post - Required."
        },
        body: {
          bsonType: "string",
          description: "Body of post - Required."
        },
        category: {
          bsonType: "string",
          description: "Category of post - Optional."
        },
        likes: {
          bsonType: "int",
          description: "Post like count. Must be an integer - Optional."
        },
        tags: {
          bsonType: ["string"],
          description: "Must be an array of strings - Optional."
        },
        date: {
          bsonType: "date",
          description: "Must be a date - Optional."
        }
      }
    }
  }
})

This will create the posts collection in the current database and specify the JSON Schema validation requirements for the collection.

The mongoDB Data Api can be used to query and update data in a MOngoDB database without the need for Language Specific drivers.

Language drivers should be used when possible, but the MongoDB Data Api comes in handy when drivers are not available or drivers are overkill for the application.

Read and Write with the MongoDB Data Api
The MongoDB Data Api is a pre-configured set of HTTPS endpoints that can be used to read and write data to a MongoDB Altas database.
With the MongoDB Data API, you can create, read, update, delete or aggregatee documents in a MongoDb atles database.

Cluster Configuration
In order to use the Data API, you must first enable the functionality from the Atlas UI.
From the MongoDB atlas dashboard, navigate to Data API in the left menu.
Select data source(s) you would like to enable the API on and click Enable the Data API.

Access Level
By default, no access is granted. Select the access level you'd like to grant the Data API. THe choices are: No Access, Read Only, Read and Write, or Custom Access.
Data API Key
In order to authenticate with the Data API, you must first create a data API key.
Click Create Api Key, enter the name for the key, Then click Generate Api Key
Be sure to copy the API key and save it somewhere safe. You will not get another chance to see this key again.
Sending a Data API Request
**/

