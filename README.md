# Food Delivery Backend

Food delivery backend. Built on Node and Express and using MongoDB as the database.

## Routes
### Market
- GET api/market - all markets
- GET api/market/:id - all foods market
- POST api/market/ - add new market
- POST api/market/:id - add new food to market

### Auth
- POST api/users/signup - singup
- POST api/users/login - login
- POST api/users/:id - get user by id

### Order
- POST api/order - place an order

### Admin
- POST api/admin/login - login admin
- POST api/admin/signup - signup admin
- GET api/admin/market - get a restaurant admin
- PATCH api/admin/market - patch a restaurant admin
- POST api/admin/filter - create new filter for foods
- DELETE api/admin/filter - delete filter
- POST api/admin/food - create a restaurant food
- PATCH/DELETE api/admin/food/:id - update/delete restaurant food
- GET api/admin/orders - get all orders the restaurant
