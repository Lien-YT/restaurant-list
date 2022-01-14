const express = require('express')
const exphbs = require('express-handlebars')
const restaurants = require('./restaurant.json').results
const app = express()
const port = 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))

// index page route
app.get('/', (req, res) => {
  res.render('index', { restaurants })
})

// show page route
app.get('/restaurants/:restaurant_id', (req, res) => {
  const {restaurant_id} = req.params
  const restaurant = restaurants.find( 
    data => data.id === Number(restaurant_id))
  res.render('show', { restaurant })
})

// search result route
app.get('/search', (req, res) => {
  if (!req.query.keywords) {
    res.redirect('/')
  }
  
  const inputKeyword = req.query.keywords
  const keyword = req.query.keywords.trim().toLowerCase()
  const restaurant = restaurants.filter(
    data => data.name.toLowerCase().includes(keyword) || 
      data.category.includes(keyword)
  )
  
  if (restaurant.length === 0) {
    // 想增加彈跳警告視窗，不過經查詢似乎需是用 JS 完成而非 Node.js
    res.redirect('/')
  } else {
    res.render('index', { restaurants: restaurant, inputKeyword })
  }
})

app.listen(port, () => {
  console.log(`Listening on http://localhost:${ port }`)
})
