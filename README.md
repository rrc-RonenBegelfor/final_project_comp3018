# Project Overview

This project focuses on the creation of a HistoryAPI which currently houses information between three collections. Continents, Countries, Cities. The main idea is to have as many countries and cities with disastrous events data which have occurred in the modern era. This is my idea of teaching people about our history and things we should not repeat or learn how to prevent.

## Installation Instructions

In this section I would go over the prerequisites required for this project. This will include setup steps.

### Prerequisites

Installment of,

- Node.js
  - NPM
- Morgan
  - logging
- Firebase
  - with admin credentials
- dotenv
  - for environment variables
- Joi Validation
  - creating validaiton schemas
- SwaggerUI
  - local documentation

### Setup Steps

Installing dependencies:

Start with cloning the repository into a root directory,

```bash
git clone https://github.com/rrc-RonenBegelfor/final_project_comp3018
```

Then, to ensure all dependencies are installed after cloning, run the following

```bash
npm install
```

You will need a `.env` to store your credentials from firebase in, so do the following:

```env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY=your_private_key
PORT=3000
IPSTACK_API_KEY=your_ipstack_api_key
```

And now, you should be ready to run on the server:

```bash
npm run build
npm start
```

## API Request Examples

This section will include examples of how to make request to this API.

*It is recommended to get `Postman` or installing `Postman CLI`.*

*[Link to Postman Webiste](https://www.postman.com/)*

**Important Notes:**

Each CRUD operation requires a/n,

- existing user
  - admin, manager, historian, user
- authentication token
  - depends on the type of user, access differs between users.
- certain authorization level
  - depends on the type of user, authorization differs between users.

### Continents

The collection `continents` is exactly as it sounds. It houses all of the seven continents in the world, with its own separate `id` that acts as a primary/foreign key and its name. The `continents` collection features a `number` array which includes a collection of how many `human`, `natural`, and `human/natural` events there are in total that exist based on countries that have a foreign key of linked continent.

1. `GET` Continents operation

    This operation is used to get all the data within the database about Continents.

    You can also be more specific and request a continent by its generated unique id.

    - `GET` all continents

        ```bash
        postman request 'http://localhost:3000/api/v1/continents/'
        ```

    - `GET` continent by id

        ```bash
        postman request 'http://localhost:3000/api/v1/continents/{id}'
        ```

2. `POST` Continents operation

    This operation is used to create a continent.

    ```bash
    postman request POST 'http://localhost:3000/api/v1/continents/' \
    --header 'Content-Type: application/json' \
    --body '{...}'
    ```

    The following fields are required in the body:

    | Field | Type | Description |
    | ----- | ---- | ----------- |
    | name | string | Continent name |
    | continent_code | string | Continent initials |

    It is important to note that even though you have the field `number: {}` in your continentModel, it is **NOT** required in the `POST` body.

    Example of a valid body:

    ```yaml
    {
      "name": "Africa",
      "continent_code": "AF"
    }
    ```

    **Postman does not accept `commas (,)` after the last field.**

3. `PUT` Continents operation

    This operation is used to update (in this case, push) a continent's number and events values.

    It requires the user's id.

    ```bash
    postman request PUT 'http://localhost:3000/api/v1/continents/{id}' \
    --header 'Authorization: Bearer {{back-end-token}}' \
    --body ''
    ```

    There are no fields required but for updating, but to ensure not everyone can just utilize it, only a historian is allowed to call for an update. This can change.

4. `DELETE` Continents operation

    This operation is used to delete a continent using an id.

    ```bash
    postman request DELETE 'http://localhost:3000/api/v1/continents/{id}/'
    ```

### Countries

The collection `countries` is a little more complicated. Not only is updating it is probably a hassle, but also creating it as well. It requires at least 5 data array values, which you can consider a lot, but that is the amount of detail a country should have, as many events has occurred just to that country. I am essentially barely scratching the surface.

1. `GET` Countries operation

    This operation is used to get all the data within the database about Countries.

    You can also be more specific and request a country by its generated unique id.

    Another way to be more specific is requesting a country by quering a parameter of the continent's id.

    - `GET` all countries

        ```bash
        postman request 'http://localhost:3000/api/v1/countries/'
        ```

    - `GET` country by id

        ```bash
        postman request 'http://localhost:3000/api/v1/countries/{id}'
        ```

    - `GET` country by continentId queried parameter

        ```bash
        postman request 'http://localhost:3000/api/v1/countries?continentId=africa'
        ```

2. `POST` Countries operation

    This operation is used to create a country.

    ```bash
    postman request POST 'http://localhost:3000/api/v1/countries/' \
    --header 'Content-Type: application/json' \
    --body '{...}'
    ```

    The following fields are required in the body:

    | Field | Type | Description |
    | ----- | ---- | ----------- |
    | continentId | string | Continent id |
    | name | string | Country name |
    | data | [{}] | Country data |

    Once again, country data requires five objects of data filled.

    The following fields are required in the data array.

    | Field | Type | Description |
    | ----- | ---- | ----------- |
    | date | string | Continent id |
    | type | string | Country name |
    | description | string | Country str9jg |
    | damage | string | Country damage |
    | resolution | string | Country resolution |

    Example of a valid body (without five objects):

    ```yaml
    {
      "continentId": "EU",
      "name": "Latvia",
      "data": {
        "date": "2025-11-05",
        "type": "Natural",
        "description": "Tsunami",
        damage: "Low",
        resolution: "Evacuated every civilian and kept doing so until it was over."
      },...(5)
    }
    ```

    **Postman does not accept `commas (,)` after the last field.**

3. `PUT` Countries operation

    This operation is used to update (in this case, push) a continent's number and events values.

    It requires the user's id.

    ```bash
    postman request PUT 'http://localhost:3000/api/v1/countries/{id}' \
    --header 'Authorization: Bearer {{back-end-token}}' \
    --body ''
    ```

    Once again, an update operation requires that five items are pushed/updated within its use.

4. `DELETE` Countries operation

    This operation is used to delete a continent using an id.

    ```bash
    postman request DELETE 'http://localhost:3000/api/v1/countries/{id}/'
    ```

### Cities

The third and final collecftion `cities` has the same attributes as the `countries` collection but does not require at least five events and only one which relates to the city on it's biggest scale.

1. `GET` Cities operation

    This operation is used to get all the data within the database about the cities.

    You can be more specific and request a city by its unique id or by querying bya country's `countryId`/`country_code`.

    - `GET` all cities

        ```bash
        postman request 'http://localhost:3000/api/v1/cities/'
        ```

    - `GET` a city with unique id

        ```bash
        postman request 'http://localhost:3000/api/v1/cities/{id}'
        ```

    - `GET` a city with unique id

        ```bash
        postman request 'http://localhost:3000/api/v1/cities?countryId=CA'
        ```

2. `POST` Cities operation

    This operation is used to create a city.

    ```bash
    postman request POST 'http://localhost:3000/api/v1/cities/' \
    --header 'Content-Type: application/json' \
    --body '{...}'
    ```

    The following fields are required in the body:

    | Field | Type | Description |
    | ----- | ---- | ----------- |
    | countryId | string | Continent id |
    | name | string | Country name |
    | date | string | Event date |
    | type | string | Event type |
    | description | string | Event description |
    | damage | string | Event severity |
    | resolution | string | Event resolution |

    Example of a valid body:

    ```yaml
    {
      "countryId": "CA",
      "name": "Wiinnipeg",
      "date": "2025-11-05",
      "type": "Natural",
      "description": "Tsunami",
      damage: "Low",
      resolution: "Evacuated every civilian and kept doing so until it was over."
    }
    ```

    **Postman does not accept `commas (,)` after the last field.**

3. `PUT` Cities operation

    This operation is used to update a city.

    It requires the city's unique id.

    ```bash
    postman request PUT 'http://localhost:3000/api/v1/cities/{id}' \
    --header 'Authorization: Bearer {{back-end-token}}' \
    --body ''
    ```

    The following are optional when updating but when must be selected:

    | Field | Type | Description |
    | ----- | ---- | ----------- |
    | countryId | string | Continent id |
    | name | string | Country name |
    | date | string | Event date |
    | type | string | Event type |
    | description | string | Event description |
    | damage | string | Event severity |
    | resolution | string | Event resolution |

## Local Documenation

If you would like to access the local documentation to this project, you can do so by doing the following:

- Start the server

    ```bash
    npm start

    # or

    npm run start
    ```

- Open this link [Swagger UI](http://localhost:3000/api-docs/).

## Secure Environment Variable Setup

To start the setup of your secure environment variables, you need to ensure you have the following files in your root directory:

- `.env`
  - This file would contain your secrets.

- `.gitignore`
  - This file will be used to ignore your `.env` file as it contains your **secrets**.

`.env` example with Firebase:

```env
FIREBASE_PROJECT_ID=your_project_id_here
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nREPLACE_WITH_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_client_email_here
```

### Firebase Relations

The `.env` file helps you with passing your credentials to the Firebase much safely.

- project_id &rarr; FIREBASE_PROJECT_ID
  - The name of your project.
- client_email &rarr; FIREBASE_CLIENT_EMAIL
  - Your firebase provided service account email.
- private_key &rarr; FIREBASE_PRIVATE_KEY
  - Your **secret** authentication key.

These are all the credentials your Firebase would need for you to access it's services.

### Environment Variables in this Project

For this project you'd need just the following envrionment variables.

```env
NODE_ENV=development

PORT=3000


FIREBASE_PROJECT_ID=your_project_id_here
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nREPLACE_WITH_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_client_email_here

IPSTACK_API_KEY=your_ipstack_api_key
```

- NODE_ENV
  - Environment mode which helps distinguish between development and production modes.
- PORT
  - Which port the server is going to run or which port the server listens on.

Once you have all credentials set up, simply do the following in your `app.ts` file.

```bash
import dotenv from "dotenv"

dotenv.config()
```

Now, you can use your environment variables from anywhere in your code.

If you want to call your `IPSTACK_API_KEY`, you would,

```bash
const API_KEY = process.env.IPSTACK_API_KEY
```

This will store the API_KEY, which is not ideal, but just using this as an example. IF you go to the locationService.ts file, you would see how I am using the API_KEY just to help me fetch.
