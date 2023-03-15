const enteredValue = parseInt(
  prompt("Choose maximum life for you and the monster: ", "100")
);

let chosenMaxLife = enteredValue;
if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
  alert('Invalid user input! Life for you and monster is now 100.');
  chosenMaxLife = 100;
}

let maxDamage = 10;
let clicks = 0;
let initialPlayerHealth = chosenMaxLife;
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;
let battleLog = [];

const LOG_EVENT_PLAYER_ATTACK = "ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "STRONG_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

const attackValue = Math.random() * maxDamage;
const monsterAttackValue = Math.random() * (maxDamage + 3.5);
const playerDamage = dealPlayerDamage(monsterAttackValue);

adjustHealthBars(chosenMaxLife);

function attackMonster() {
  attack("ATTACK");
}

function strongAttackMonster() {
  attack("STRONG_ATTACK");
}

function healPlayer() {
  let healLog = "PLAYER_HEAL";
  maxDamage = 10;
  let healValue = Math.random() * (maxDamage + 3);
  if (currentPlayerHealth >= chosenMaxLife - healValue) {
    alert("You can't heal to more than your max initial health!");
  } else {
    increasePlayerHealth(healValue);
    currentPlayerHealth += healValue;
    const playerDamage = dealPlayerDamage(monsterAttackValue);
    currentPlayerHealth -= playerDamage;
    writeToLog(healLog, healValue, currentMonsterHealth, currentPlayerHealth);
    checkWin();
  }
}

function attack(mode) {
  clicks++;
  console.log(clicks);
  maxDamage = mode === "ATTACK" ? 10 : 17;
  const damage = dealMonsterDamage(attackValue);
  currentMonsterHealth -= damage;
  initialPlayerHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(monsterAttackValue);
  currentPlayerHealth -= playerDamage;
  writeToLog(mode, damage, currentMonsterHealth, currentPlayerHealth);
  checkWin(currentPlayerHealth, currentMonsterHealth);
}

function reset() {
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

function writeToLog(ev, val, monsterHealth, playerHealth) {
  let logEntry;
  switch (ev) {
    case LOG_EVENT_PLAYER_ATTACK:
      logEntry = {
        event: ev,
        value: val,
        target: "MONSTER",
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth,
      };
      break;
    case LOG_EVENT_PLAYER_STRONG_ATTACK:
      logEntry = {
        event: ev,
        value: val,
        target: "MONSTER",
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth,
      };
      break;
    case LOG_EVENT_PLAYER_HEAL:
      logEntry = {
        event: ev,
        value: val,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth,
      };
      break;
    case LOG_EVENT_GAME_OVER:
      logEntry = {
        event: ev,
        value: val,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth,
      };
      break;
    default:
      logEntry = {};
  }
  battleLog.push(logEntry);
}

function showLog() {
  for (const logEntry of battleLog) {
    console.log(logEntry);
  }
}

function checkWin(currentPlayerHealth, currentMonsterHealth) {
  let gameLog = "GAME_OVER";
  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    alert("You would be dead utt the bonus life saved you!");
    setPlayerHealth(initialPlayerHealth);
  }
  if (currentMonsterHealth <= 0) {
    alert("YOU WON BY " + clicks + " TURNS!");
    alert("Press OK to restart the game!");
    writeToLog(gameLog, 0, currentMonsterHealth, currentPlayerHealth);
    reset();
  } else if (currentPlayerHealth <= 0) {
    alert("YOU LOST BY " + clicks + " TURNS!");
    alert("Press OK to restart the game!");
    writeToLog(gameLog, 0, currentMonsterHealth, currentPlayerHealth);
    reset();
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
    alert("YOU DRAW BY " + clicks + " TURNS!");
    alert("Press OK to restart the game!");
    writeToLog(gameLog, 0, currentMonsterHealth, currentPlayerHealth);
    reset();
  }
}

strongAttackBtn.addEventListener("click", strongAttackMonster);
attackBtn.addEventListener("click", attackMonster);
healBtn.addEventListener("click", healPlayer);
logBtn.addEventListener("click", showLog);
