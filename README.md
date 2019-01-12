[![N|Solid](http://www.greenchain-engineering.com/wp-content/uploads/2016/10/Web_logo2.png)](http://www.greenchain-engineering.com/)

# Greenchain Backend

API calls for the admin panel and MQTT service

## Installation

```sh
git pull
npm install
gcloud app deploy --project greenchain-software
```

## API Calls

### Systems

#### Fetch All
```sh
GET /api/v1/system/fetch/all
```

Returns JSON list with all the systems data.

#### Fetch ID
```sh
GET /api/v1/system/fetch/<ID>
```

Provide ID in url. Returns JSON object with systems data.

#### Add
```sh
POST /api/v1/system/add
```

Provide post data as 'data' in 'x-www-form-urlencoded'. Requires JSON object with systems data.
If you want to add a system with a particular ID, the 'id' value must be set in the JSON object.

```
data = {
  "id": <Set this if you want to choose the ID. If there are the same ID's it will be updated>,
  "gCapacity": <Number>,
  "rCapacity": <Number>,
  "system_model": <String>,
  "userKey": <String, gets assigned when a system is activated>,
  "active": <Boolean, should be set to false>
}
```

#### Update
```sh
POST /api/v1/system/update
```

Provide post data as 'data' in 'x-www-form-urlencoded'. Requires JSON object with systems data.
If you want to add a system with a particular ID, the 'id' value must be set in the JSON object.

```
data = {
  "id": <Set this if you want to choose the ID. If there are the same ID's it will be updated>,
  "gCapacity": <Number>,
  "rCapacity": <Number>,
  "system_model": <String>,
  "userKey": <String, gets assigned when a system is activated>,
  "active": <Boolean, should be set to false>
}
```

#### Activate
```sh
POST /api/v1/system/activate
```

Provide post data as 'data' in 'x-www-form-urlencoded'. Requires JSON object with the
system ID of the system to be activated. The id should be called 'hashed_id'. Currently using SHA256 to hash the ID.

#### Delete
```sh
DELETE /api/v1/system/remove/<ID>
```

Provide ID in url. Returns JSON object with systems data.

### Users

#### Fetch All
```sh
GET /api/v1/user/fetch/all
```

Returns JSON list with all the users data.

#### Fetch ID
```sh
GET /api/v1/user/fetch/<ID>
```

Provide ID in url. Returns JSON object with users data.

#### Add
```sh
POST /api/v1/user/add
```

Provide request data as 'data' in 'x-www-form-urlencoded'. Returns JSON object with users data.

#### Delete
```sh
DELETE /api/v1/user/remove/<ID>
```

Provide ID in url. Returns JSON object with users data.

### Greywater Schedulers

#### Fetch ID
```sh
GET /api/v1/schedulers/greywater/fetch/<ID>
```
Returns the schedules for the provided greywater system.

#### Add
```sh
POST /api/v1/schedulers/greywater/add
```

Provide request data as 'data' in 'x-www-form-urlencoded'. An ID and data for the scheduler is required.
```
data = {
  "id": <String, the ID of the system the scheduler belongs to>,
  "data": <Scheduler data>
}
```

#### Add Default
```sh
POST /api/v1/schedulers/greywater/add/default
```

Provide request data as 'data' in 'x-www-form-urlencoded'. An ID is required.
```
data = {
  "id": <String, the ID of the system the scheduler belongs to>
}
```

#### Update system
```sh
POST /api/v1/schedulers/greywater/update
```

Provide request data as 'data' in 'x-www-form-urlencoded'. An ID is required.
```
data = {
  "id": <String, the ID of the system the scheduler belongs to>,
  "data": <Scheduler data>
}
```

#### Delete
```sh
GET /api/v1/schedulers/greywater/delete/<ID>
```
Deletes the schedule for the provided system ID.

## Todos

 - User verification
 - Security

## License

MIT
