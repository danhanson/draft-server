"use server";

/*
let player = {
  "draftAuctionValue":0,
  "id":3112335,
  "keeperValue":0,
  "keeperValueFuture":0,
  "lineupLocked":false,
  "onTeamId":0,
  "player":{
    "active":true,
    "defaultPositionId":5,
    "draftRanksByRankType":{
      "STANDARD":{
        "auctionValue":65,
        "published":false,
        "rank":1,
        "rankSourceId":0,
        "rankType":"STANDARD",
        "slotId":0
      },
      "ROTO":{
        "auctionValue":68,
        "published":false,
        "rank":1,
        "rankSourceId":0,
        "rankType":"ROTO",
        "slotId":0
      }
    },
    "droppable":false,
    "eligibleSlots":[4,9,10,11,12,13],
    "firstName":"Nikola",
    "fullName":"Nikola Jokic",
    "id":3112335,
    "injured":false,
    "injuryStatus":"ACTIVE",
    "jersey":"15",
    "lastName":"Jokic",
    "lastNewsDate":1686673231000,
    "ownership":{
      "activityLevel":null,
      "auctionValueAverage":71.29276315789474,
      "auctionValueAverageChange":3.9411502546689263,
      "averageDraftPosition":1.3966947151764635,
      "averageDraftPositionPercentChange":-0.03138057905080904,
      "date":1696770322426,
      "leagueType":0,
      "percentChange":0.015155213886231422,
      "percentOwned":99.92616406959036,
      "percentStarted":99.64927933055424
    },
    "proTeamId":7,
    "seasonOutlook":"Jokic is the reigning NBA Finals MVP, and before that the two-time NBA MVP, but he has been the fantasy basketball MVP for all three of those seasons. He has been the most consistent, unstoppable force in the league, averaging 26.0 PPG, 12.2 RPG, 8.7 APG over the last three campaigns. He increased his distribution last season, coming within two tenths of an assist of averaging a triple-double in truth, and with the way he dominated the postseason it is clear he actually has even a higher gear he can reach when called upon. And remarkably, Jokic is just now reaching his peak prime years at 28 years old...so, despite holding the crown, he still has upside.",
    "stats":[
      {
        "appliedAverage":60.26086956521739,
        "appliedTotal":4158.0,
        "averageStats":{
          "0":24.492753623188406,
          "1":0.6811594202898551,
          "2":1.2608695652173914,
          "3":9.826086956521738,
          "4":2.420289855072464,
          "5":9.420289855072463,
          "6":11.840579710144928,
          "7":0.0,
          "8":0.0,
          "9":2.5072463768115942,
          "10":0.057971014492753624,
          "11":3.579710144927536,
          "12":0.0,
          "13":9.36231884057971,
          "14":14.81159420289855,
          "15":4.942028985507246,
          "16":6.0144927536231885,
          "17":0.8260869565217391,
          "18":2.1594202898550723,
          "19":0.63209393,
          "20":0.82168675,
          "21":0.38255034,
          "22":0.65998043,
          "23":5.449275362318841,
          "24":1.0724637681159421,
          "25":1.3333333333333333,
          "26":9.82608696,
          "27":0.68115942,
          "28":33.65217391,
          "29":24.49275362,
          "30":11.84057971,
          "31":1.26086957,
          "32":3.57971014,
          "33":0.82608696,
          "34":0.72782084,
          "35":2.74493927,
          "36":0.35222672,
          "37":0.8405797101449275,
          "38":0.42028985507246375,
          "39":0.0,
          "40":33.65217391304348,
          "41":1.0,
          "42":69.0,
          "43":0.6956521739130435,
          "44":0.40606654
        },
        "externalId":"2023",
        "id":"002023",
        "proTeamId":0,
        "scoringPeriodId":0,
        "seasonId":2023,
        "statSourceId":0,
        "statSplitTypeId":0,
        "stats":{
          "0":1690.0,
          "1":47.0,
          "2":87.0,
          "3":678.0,
          "4":167.0,
          "5":650.0,
          "6":817.0,
          "7":0.0,
          "8":0.0,
          "9":173.0,
          "10":4.0,
          "11":247.0,
          "12":0.0,
          "13":646.0,
          "14":1022.0,
          "15":341.0,
          "16":415.0,
          "17":57.0,
          "18":149.0,
          "19":0.63209393,
          "20":0.82168675,
          "21":0.38255034,
          "22":0.65998043,
          "23":376.0,
          "24":74.0,
          "25":92.0,
          "26":9.82608696,
          "27":0.68115942,
          "28":33.65217391,
          "29":24.49275362,
          "30":11.84057971,
          "31":1.26086957,
          "32":3.57971014,
          "33":0.82608696,
          "34":0.72782084,
          "35":2.74493927,
          "36":0.35222672,
          "37":58.0,
          "38":29.0,
          "39":0.0,
          "40":2322.0,
          "41":69.0,
          "42":69.0,
          "43":48.0,
          "44":0.40606654
        }
      },
      {
        "appliedAverage":0.0,
        "appliedTotal":0.0,
        "externalId":"2024",
        "id":"002024",
        "proTeamId":0,
        "scoringPeriodId":0,
        "seasonId":2024,
        "statSourceId":0,
        "statSplitTypeId":0,
        "stats":{}
      },
      {
        "appliedAverage":0.0,
        "appliedTotal":0.0,
        "externalId":"2024",
        "id":"012024",
        "proTeamId":0,
        "scoringPeriodId":0,
        "seasonId":2024,
        "statSourceId":0,
        "statSplitTypeId":1,
        "stats":{}
      },
      {
        "appliedAverage":0.0,
        "appliedTotal":0.0,
        "externalId":"2024",
        "id":"032024",
        "proTeamId":0,
        "scoringPeriodId":0,
        "seasonId":2024,
        "statSourceId":0,
        "statSplitTypeId":3,
        "stats":{}
      },
      {
        "appliedAverage":0.0,
        "appliedTotal":0.0,
        "externalId":"2024",
        "id":"022024",
        "proTeamId":0,
        "scoringPeriodId":0,
        "seasonId":2024,
        "statSourceId":0,
        "statSplitTypeId":2,
        "stats":{}
      },
      {
        "appliedAverage":60.04225352112676,
        "appliedTotal":4263.0,
        "averageStats":{
          "0":25.577464788732396,
          "1":0.704225352112676,
          "2":1.295774647887324,
          "3":9.0,
          "6":12.295774647887324,
          "11":3.6056338028169015,
          "13":9.788732394366198,
          "14":16.197183098591548,
          "15":4.943661971830986,
          "16":6.0,
          "17":1.056338028169014,
          "18":2.9014084507042255,
          "19":0.604,
          "20":0.824,
          "21":0.364,
          "23":6.408450704225352,
          "24":1.056338028169014,
          "25":1.8450704225352113,
          "26":9.0,
          "27":0.7,
          "28":33.7,
          "29":25.5692,
          "30":12.3,
          "31":1.3,
          "32":3.6,
          "33":1.0,
          "34":0.76,
          "35":2.5,
          "36":0.36,
          "40":33.699999999999996,
          "42":71.0
        },
        "externalId":"2024",
        "id":"102024",
        "proTeamId":0,
        "scoringPeriodId":0,
        "seasonId":2024,
        "statSourceId":1,
        "statSplitTypeId":0,
        "stats":{
          "0":1816.0,
          "1":50.0,
          "2":92.0,
          "3":639.0,
          "6":873.0,
          "11":256.0,
          "13":695.0,
          "14":1150.0,
          "15":351.0,
          "16":426.0,
          "17":75.0,
          "18":206.0,
          "19":0.604,
          "20":0.824,
          "21":0.364,
          "23":455.0,
          "24":75.0,
          "25":131.0,
          "26":9.0,
          "27":0.7,
          "28":33.7,
          "29":25.5692,
          "30":12.3,
          "31":1.3,
          "32":3.6,
          "33":1.0,
          "34":0.76,
          "35":2.5,
          "36":0.36,
          "40":2392.7,
          "42":71.0
        }
      }
    ]
  },
  "ratings":{
    "0":{
      "positionalRanking":1,
      "totalRanking":1,
      "totalRating":4158.0
    }
  },
  "rosterLocked":false,
  "status":"WAIVERS",
  "tradeLocked":false,
  "waiverProcessDate":1696921200000
}
*/