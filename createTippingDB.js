// drop the db
use tippingdb
db.dropDatabase()

// create the db
use tippingdb

// create the collection
db.createCollection("team")
db.createCollection("match")
db.createCollection("user")
db.createCollection("userTips")

// populate the team collection (MISING: teamPosition, teamPoints, teamPercentage, gamesPlayed, gamesWon, gamesLost, gamesDrawed)
db.team.insertMany([
					{teamID: 'ADEL'},
					{teamID: 'BL'},
					{teamID: 'CARL'},
					{teamID: 'COLL'},
					{teamID: 'ESS'},
					{teamID: 'FRE'},
					{teamID: 'GEEL'},
					{teamID: 'GCFC'},
					{teamID: 'GWS'},
					{teamID: 'HAW'},
					{teamID: 'MEL'},
					{teamID: 'NMFC'},
					{teamID: 'PORT'},
					{teamID: 'RICH'},
					{teamID: 'STK'},
					{teamID: 'SYD'},
					{teamID: 'WCE'},
					{teamID: 'WB'}
])












