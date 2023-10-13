const fs = require("fs/promises");

async function fetch_page(offset) {
  let response = await fetch('https://lm-api-reads.fantasy.espn.com/apis/v3/games/fba/seasons/2024/segments/0/leaguedefaults/1?scoringPeriodId=0&view=kona_player_info', {
    'headers': {
      'accept': 'application/json',
      'accept-language': 'en-US,en;q=0.9',
      'cache-control': 'no-cache',
      'pragma': 'no-cache',
      'sec-ch-ua': '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'x-fantasy-filter': `{"players":{"filterStatsForExternalIds":{"value":[2023,2024]},"filterSlotIds":{"value":[0,1,2,3,4,5,6,7,8,9,10,11]},"filterStatsForSourceIds":{"value":[0,1]},"sortAppliedStatTotal":{"sortAsc":false,"sortPriority":3,"value":"102024"},"sortDraftRanks":{"sortPriority":2,"sortAsc":true,"value":"STANDARD"},"sortPercOwned":{"sortAsc":false,"sortPriority":4},"limit":50,"offset":${offset},"filterRanksForScoringPeriodIds":{"value":[1]},"filterRanksForRankTypes":{"value":["STANDARD"]},"filterStatsForTopScoringPeriodIds":{"value":5,"additionalValue":["002024","102024","002023","012024","022024","032024","042024"]}}}`,
      'x-fantasy-platform': 'kona-PROD-9dc82bfc44d7e7532124128bffed8cb10dd7e947',
      'x-fantasy-source': 'kona',
      //"cookie": "SWID=A65AB452-5C2E-43D5-C3D7-DA37877A21BA; AMCV_EE0201AC512D2BE80A490D4C%40AdobeOrg=-330454231%7CMCIDTS%7C19639%7CMCMID%7C73705156411713013909122604033123184060%7CMCAID%7CNONE%7CMCOPTOUT-1696810032s%7CNONE%7CvVersion%7C3.1.2; s_c24=1696802834524; s_ensNR=1697235669502-Repeat; OptanonConsent=isGpcEnabled=0&datestamp=Fri+Oct+13+2023+17%3A21%3A10+GMT-0500+(Central+Daylight+Time)&version=202212.1.0&isIABGlobal=false&hosts=&consentId=4aebe4bc-68e8-4421-951e-931b047c4e12&interactionCount=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0003%3A1%2CSSPD_BG%3A1%2CC0002%3A1%2CC0004%3A1%2CC0005%3A1&AwaitingReconsent=false",
      //"Referer": "https://fantasy.espn.com/",
      //"Referrer-Policy": "strict-origin-when-cross-origin"
    },
    'body': null,
    'method': 'GET'
  });
  return await response.json();
}

async function fetch_teams() {
  const response = await fetch('https://lm-api-reads.fantasy.espn.com/apis/v3/games/fba/seasons/2024?view=proTeamSchedules_wl', {
    'headers': {
      'accept': 'application/json',
      'accept-language': 'en-US,en;q=0.9',
      'cache-control': 'no-cache',
      'pragma': 'no-cache',
      'sec-ch-ua': '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '\"Windows\"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'x-fantasy-platform': 'kona-PROD-9dc82bfc44d7e7532124128bffed8cb10dd7e947',
      'x-fantasy-source': 'kona',
      //"cookie": "SWID=A65AB452-5C2E-43D5-C3D7-DA37877A21BA; AMCV_EE0201AC512D2BE80A490D4C%40AdobeOrg=-330454231%7CMCIDTS%7C19639%7CMCMID%7C73705156411713013909122604033123184060%7CMCAID%7CNONE%7CMCOPTOUT-1696810032s%7CNONE%7CvVersion%7C3.1.2; s_c24=1696802834524; s_ensNR=1697233374422-Repeat; OptanonConsent=isGpcEnabled=0&datestamp=Fri+Oct+13+2023+16%3A42%3A55+GMT-0500+(Central+Daylight+Time)&version=202212.1.0&isIABGlobal=false&hosts=&consentId=4aebe4bc-68e8-4421-951e-931b047c4e12&interactionCount=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0003%3A1%2CSSPD_BG%3A1%2CC0002%3A1%2CC0004%3A1%2CC0005%3A1&AwaitingReconsent=false",
      //"Referer": "https://fantasy.espn.com/",
      //"Referrer-Policy": "strict-origin-when-cross-origin"
    },
    'body': null,
    'method': 'GET'
  });
  return await response.json();
}

async function load_data() {
  await fs.mkdir('./downloads', { recursive: true });
  const playerFile = await fs.open("downloads/players.json", "w");
  playerFile.write("[");
  for (let i = 0; i < 1000; i += 20) {
    let page = await fetch_page(i);
    let isStart = true;
    for(let player of page['players']) {
      if (!isStart) {
        playerFile.write(",");
      } else {
        isStart = false;
      }
      await playerFile.write(JSON.stringify(player));
    }
  }
  await playerFile.close();
  const teamFile = await fs.open("downloads/teams.json", "w");
  const teamsData = await fetch_teams();
  const teams = teamsData["settings"]["proTeams"];
  await teamFile.write(JSON.stringify(teams));
  await teamFile.close();
}

load_data().then(function() {
  console.log("DONE");
}).catch(function(error){
  console.log(error);
});