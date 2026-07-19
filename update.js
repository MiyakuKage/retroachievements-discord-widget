const fs = require("fs");

const username = process.env.RA_USERNAME || process.argv[2];
const secretkey = process.env.RA_SECRET_KEY || process.argv[3];

if (!username || !secretkey) {
  console.error("Missing RetroAchievements configuration. Set RA_USERNAME as a variable and RA_SECRET_KEY as a secret, or pass them as arguments.");
  process.exit(1);
}

async function main() {
  const profileUrl = `https://retroachievements.org/API/API_GetUserProfile.php?u=${username}&y=${secretkey}`;

  const response = await fetch(profileUrl);
  const userData = await response.json();

  const lastUnlockUrl = `https://retroachievements.org/API/API_GetUserRecentAchievements.php?u=${username}&y=${secretkey}&m=10000`;

  const lastUnlockResponse = await fetch(lastUnlockUrl);
  const lastUnlockData = await lastUnlockResponse.json();

  
  const lastGameUrl = `https://retroachievements.org/API/API_GetGame.php?i=${userData.LastGameID}&y=${secretkey}`;
  
  const lastGameResponse = await fetch(lastGameUrl);
  const lastGameData = await lastGameResponse.json();

  console.log("User Data:", userData);
  console.log("Last Unlock Data:", lastUnlockData);
  console.log("Last Game Data:", lastGameData);
  
  const output = {
    username: userData.User,
    avatar: userData.UserPic,
    points: userData.TotalPoints,
    retropoints: userData.TotalTruePoints,
    lastUnlock: lastUnlockData[0]?.Title || null,
    lastUnlockImage: lastUnlockData[0]?.BadgeURL ? "https://media.retroachievements.org/" + lastUnlockData[0].BadgeURL : null,
    lastGamePlayed: lastGameData.Title || null,
    lastGamePlayedImage: lastGameData.GameIcon ? "https://media.retroachievements.org/" + lastGameData.GameIcon : null,
    updated: new Date().toISOString()
  };

  fs.writeFileSync(
    "retroachivos.json",
    JSON.stringify(output, null, 2)
  );
}

main();