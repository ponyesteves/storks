// for testing use
// const DB_URI = 'https://tefacturouy.cloudant.com/premiumfd_test',
//   DB_HEADERS = {
//     'Content-Type': 'application/json',
//     'Authorization': 'Basic aHVnaHRoZXJtaWduaWZmZXJpc3RpY2hhOmZhZDNlODMyYTRiYTg3NjhjMjI5MjYwNzJlODUwNDQyNTU3NWU4NWY=',
//     'User-Agent': 'request'
//   }

// for production
const DB_URI = 'https://couchdb.ceibo.co/premiumfd',
  DB_HEADERS = {
    'Content-Type': 'application/json',
    'Authorization': 'Basic cHJlbWl1bWZkOnBkMTIzNA==',
    'User-Agent': 'request'
  }

const request = require('request')
module.exports = {
  find: (selector) => {
    return new Promise((resolve, reject) => {
      let options = {
        url: `${DB_URI}/_find`,
        headers: DB_HEADERS,
        json: { selector: selector, limit: 100000 }
      }
      request.post(options, (error, res, body) => {
        if (!error && res.statusCode == 200) {
          resolve(body.docs)
        } else {
          reject({ error, res })
        }
      })
    })
  },
  get: (id) => {
    return new Promise((resolve, reject) => {
      let options = {
        url: `${DB_URI}/${id}`,
        headers: DB_HEADERS
      }
      request.get(options, (error, res, body) => {
        if (!error && res.statusCode == 200) {
          resolve(JSON.parse(body))
        } else {
          reject({ error, res })
        }
      })
    })
  },

  put: (doc) => {
    return new Promise((resolve, reject) => {
      let docs = []
      let options = {
        url: `${DB_URI}/${doc._id}`,
        headers: DB_HEADERS,
        json: doc
      }
      request.put(options, (error, res, body) => {
        if (!error && res.statusCode == 201)
          resolve(body.docs)
        else
          reject({ error, res })
      })
    })
  },
  bulk: (updateDocs) => {
    return new Promise((resolve, reject) => {
      let options = {
        url: `${DB_URI}/_bulk_docs`,
        headers: DB_HEADERS,
        json: { docs: updateDocs }
      }
      request.post(options, (error, response, body) => {
        console.log(response.statusCode)
        if (!error && response.statusCode == 201)
          resolve(body)
        else
          reject({ error, res })
      })
    })
  }

}
