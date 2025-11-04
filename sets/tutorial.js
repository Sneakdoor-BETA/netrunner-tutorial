//CARD DEFINITIONS FOR special mentor-only cards
var tutorial = [];
function SharedTutorialFunction(str) {
	console.log("Phase: "+str);
    if (this.tutorialIncrementer < this.tutorialSteps.length) {
      if (str == this.tutorialSteps[this.tutorialIncrementer].str) {
        this.tutorialIncrementer++;
        this.tutorialSteps[this.tutorialIncrementer - 1].action.call(this);
      }
    }
}

tutorial[5] = {
  title: "Tutorial",
  imageFile: "30076.png",
  player: runner,
  link: 0,
  cardType: "identity",
  subTypes: ["Natural"],
  hideTags: true,
  hideCredits: false,
  hideClicks: false,
  hideMU: false,
  hideCoreDamage: true,
  hideHandSize: false,
  hideBadPublicity: true,
  tutorialIncrementer: 0,
  //each step has a triggering phase identifier string and a function action to take
  tutorialSteps: [
    {
      //Welcome to Netrunner
      str: "",
      action: function () {
        //blank string means start-of-game init
        skipShuffleAndDraw = true;
		forcePreventCombinePhase = true; //prevent glitches
        Math.seedrandom(0);
        corp.creditPool = 7;
        runner.creditPool = 5;
		//set up field
		RunnerTestField(30076, //identity
			[], //heapCards
			[30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30028,30029], //stackCards
			[30020,30020,30027,30030,30030], //gripCards
			[30015], //installed
			[], //stolen
			cardBackTexturesRunner,glowTextures,strengthTextures);
		CorpTestField(30077, //identity
			[], //archivesCards
			[30042,30042,30042,30042,30042,30042,30042,30042,30042,30042,30042,30042,30042,30042,30042,30042,30042,30042,30042,30042,30042,30042,30042,30042,30042,30042,30042,30042,30042,30042,30042,30042,30042], //rndCards
			[30073,30037], //hqCards
			[], //archivesInstalled
			[30074], //rndInstalled
			[30074], //hqInstalled
			[[30042,30073]], //remotes (array of arrays)
			[], //scored
			cardBackTexturesCorp,glowTextures,strengthTextures);
		corp.identityCard.faceUp=true; //not sure why this is needed but it is
		corp.RnD.ice[0].rezzed=true;
		corp.HQ.ice[0].rezzed=true;
        ChangePhase(phases.corpStartDraw);
        TutorialMessage("在教程的最后部分，我们将以公司视角进行。\n\n你可以查看你的面朝下安装的卡牌，但潜袭者不行。",true);
      },
    },
    {
      str: "Corp 2.1",
      action: function () {
		TutorialCommandMessage = {}
        TutorialMessage("*升级*可以安装到任意服务器，而不仅仅是远程服务器。\n\n从手牌拖动[逐月狼秘密开发部]到总部或研发中心的位置并松开以安装它。");
		TutorialBlacklist = ['purge','draw','gain',corp.HQ.cards[0],corp.remoteServers[0],null,corp.archives];
      },
    },
    {
      str: "Corp 2.2*",
      action: function () {
		TutorialCommandMessage = {}
        TutorialMessage("[逐月狼秘密开发部]的卡牌名称前面有一个小菱形标志，所以这是一张*独有*卡牌。\n\n在同一时刻，只能有一张同名独有卡牌处于已安装且牌面朝上的状态",true);
		TutorialBlacklist = null;
      },
    },
    {
      str: "Corp 2.2",
      action: function () {
		TutorialCommandMessage = {};
		currentPhase.requireHumanInput=true;
        TutorialMessage("升级、资产和议案都安装在服务器的*根目录*中，防火墙则安装在*保护*服务器的位置。\n\n将[尼可营销计划]安装到远程服务器的根目录中。");
		TutorialBlacklist = ['purge','draw','gain',corp.HQ.cards[0]];
        TutorialReplacer = function (input) {
          if ( MouseIsOverServer(corp.HQ) || MouseIsOverServer(corp.RnD) || MouseIsOverServer(corp.archives) || MouseIsOverServer(null) ) {
			TutorialMessage("在正常游戏中，你可以选择安装到哪台服务器。\n\n在本教程中，选择已存在的远程服务器。");
			return true;
		  }
          return false;
		};
      },
    },
    {
      str: "Corp Install",
      action: function () {
		corp.installingCards[0].renderer.storedPosition.x = corp.remoteServers[0].xStart;
		corp.installingCards[0].renderer.destinationPosition.x = corp.remoteServers[0].xStart;
		corp.installingCards[0].renderer.sprite.x = corp.remoteServers[0].xStart;
		TutorialBlacklist = null;
		TutorialCommandMessage = {};
		var icepositionx = corp.remoteServers[0].ice[0].renderer.destinationPosition.x;
		var rootpositionx = corp.remoteServers[0].root[0].renderer.destinationPosition.x;
		var icepositiony = corp.remoteServers[0].ice[0].renderer.destinationPosition.y;
		var rootpositiony = corp.remoteServers[0].root[0].renderer.destinationPosition.y;
		var notrashmsg = "这种情况下，我们可以轻松支付安装更多防火墙到这个服务器的安装费用。\n\n选择完成安装（不销毁更多卡牌）.";
        if (corp.remoteServers[0].root.length == 1 || (corp.HQ.cards.length == 1 && corp.HQ.cards[0].title == "什一税") ) {
			notrashmsg = "一台远程服务器的根目录中，在资产或议案之外可以容纳任意数量的升级，所以没有必要销毁[逐月狼秘密开发部]。\n\n选择结束安装（不销毁更多卡牌）。";
			TutorialMessage("服务器的根目录中可以容纳任意数量的升级。\n\n当安装一张卡牌到一台服务器的根目录时，公司可以选择销毁此处已有的任意卡牌（拖动到档案库）。.");
		}
		else {
			TutorialMessage("当安装防火墙时，公司可以销毁保护该服务器的任意防火墙，以减少安装费用。\n\n潜袭者在安装程序时也可以如此做，以腾出内存单元。");
		}
        TutorialReplacer = function (input) {
          if (input == "trash" || ( input.card && (input.card == corp.remoteServers[0].root[0] || input.card == corp.remoteServers[0].ice[0] ) ) ) {
			corp.remoteServers[0].ice[0].renderer.sprite.x = icepositionx;
			corp.remoteServers[0].root[0].renderer.sprite.x = rootpositionx;
			corp.remoteServers[0].ice[0].renderer.sprite.y = icepositiony;
			corp.remoteServers[0].root[0].renderer.sprite.y = rootpositiony;
			corp.remoteServers[0].ice[0].renderer.forceIceRotation = true; //fix glitch
            TutorialMessage(notrashmsg);
		  }
          else return false;
          return true;
        };
      },
    },
    {
      str: "Corp 2.2*",
      action: function () {
		TutorialCommandMessage = {}
        TutorialMessage("");
		TutorialBlacklist = null;
      },
    },
    {
      str: "Corp 2.2",
      action: function () {
		TutorialMessage("安装[什一税]以保护远程服务器。\n\n一台服务器可以由任意数量的防火墙保护，但每有一层防火墙，后续防火墙的安装费用就增加1信用点。");
		TutorialBlacklist = ['purge','draw','gain'];
        TutorialReplacer = function (input) {
          if ( MouseIsOverServer(corp.HQ) || MouseIsOverServer(corp.RnD) || MouseIsOverServer(corp.archives) || MouseIsOverServer(null) ) {
			TutorialMessage("在正常游戏中，你可以选择安装到哪台服务器。\n\n在本教程中，选择已存在的远程服务器。");
			return true;
		  }
          return false;
		};
      },
    },
    {
      str: "Corp Install",
      action: function () {
		  runner.identityCard.tutorialSteps[4].action();
      },
    },
    {
      //Corp discard phase
      str: "Corp 3.1",
      action: function () {
        TutorialMessage("");
      },
    },
    {
      str: "Run 4.3",
      action: function () {
		TutorialCommandMessage = {}
        TutorialMessage("每当潜袭者通过一层防火墙后，其进入*移动*阶段。\n\n他选择是否继续或退出潜袭。\n在本次潜袭中，潜袭者选择继续潜袭。",true);
		TutorialBlacklist = null;
      },
    },
    {
      str: "Run 4.5",
      action: function () {
		TutorialCommandMessage = {}
        TutorialMessage("");
		TutorialBlacklist = null;
      },
    },
    {
      str: "Run 4.5",
      action: function () {
		TutorialCommandMessage = {}
        TutorialMessage("潜袭者通过了最后一层防火墙并选择不退出潜袭。\n现在公司有机会再潜袭者侵入服务器前激活卡牌。\n\n激活[逐月狼秘密开发部]。");
		TutorialBlacklist = null;
        TutorialReplacer = function (input) {
          if ((input=='n')&&(!corp.remoteServers[0].root[0].rezzed)) {
			TutorialMessage("在大多数情况下，安装的卡牌在激活前都处于无效状态。\n\n激活[逐月狼秘密开发部]。");
			return true;
		  }
          return false;
		};
      },
    },
    {
      str: "Run 4.6.2",
      action: function () {
		TutorialCommandMessage = {}
        TutorialMessage("[逐月狼秘密开发部]生效意味着潜袭者必须花费额外的时点或信用点以侵入服务器。",true);
		TutorialBlacklist = null;
      },
    },
    {
      str: "Run 5.2",
      action: function () {
		TutorialCommandMessage = {}
        TutorialMessage("当潜袭者侵入服务器时，其读取服务器根目录中的所有卡牌（逐张读取）。",true);
		TutorialBlacklist = null;
      },
    },
    {
      str: "Run Accessing",
      action: function () {
		TutorialBlacklist = null;
		if (accessingCard) {
			if (accessingCard.title == "尼可营销计划") TutorialBlacklist = ["trash"];
		}
      },
    },
    {
      str: "Run Accessing",
      action: function () {
		TutorialBlacklist = null;
		if (accessingCard) {
			if (accessingCard.title == "尼可营销计划") TutorialBlacklist = ["trash"];
		}
      },
    },
    {
      str: "Run Accessing",
      action: function () {
		TutorialBlacklist = null;
		if (accessingCard) {
			if (accessingCard.title == "尼可营销计划") TutorialBlacklist = ["trash"];
		}
      },
    },
    {
      str: "Run 6.4",
      action: function () {
		TutorialCommandMessage = {}
        TutorialMessage("牌背上的眼睛图标代表其正在被潜袭者查看。\n\n眼睛不是游戏规则的一部分，这只是为了方便演示。",true);
		TutorialBlacklist = null;
      },
    },
    {
      str: "Runner 1.3",
      action: function () {
		TutorialCommandMessage = {}
        TutorialMessage("");
		TutorialBlacklist = null;
      },
    },
    {
      str: "Runner 2.2",
      action: function () {
		TutorialCommandMessage = {}
        TutorialMessage("一些卡牌具有在你回合开始时执行的效果。\n\n激活[尼可营销计划]从而使其在你回合开始时生效。");
        TutorialReplacer = function (input) {
			//there is a first n but not sure why
			if (input=='n') {
				TutorialReplacer = function (secondinput) {
				  if ((secondinput=='n')&&(!corp.remoteServers[0].root[0].rezzed)) {
					TutorialMessage("在大多数情况下，安装的卡牌在激活前都处于无效状态。\n\n激活[尼可营销计划]。");
					return true;
				  }
				  return false;
				};
			}
			return false;
		};
		TutorialBlacklist = null;
      },
    },
    {
      str: "Runner 2.3",
      action: function () {
		TutorialCommandMessage = {}
        TutorialMessage("");
		TutorialBlacklist = null;
      },
    },
    {
      //End of tutorial
      str: "Corp 1.2",
      action: function () {
        currentPhase.requireHumanInput=true;
		TutorialCommandMessage = {}
		TutorialWhitelist = null; //not using whitelist
        TutorialMessage("你已经学会基础规则了！\n\n现在可以尝试使用起始牌组自由对战了。");
        TutorialReplacer = function (input) {
		  window.location.href = 'engine.html?ap=6&p=r&r=N4IglgJgpgdgLmOBPEAuEB2AbCANCAZyQLigFsBxAQ1IHcqVUBtLXVgRgCZcueBmHgBYeAVlE8AHLk4AGaXM7tpSzq1XSMG6VM46dATmmG+ck7jN9ul8wL63BAXQC+QA&c=N4IglgJgpgdgLmOBPEAuEB2DIA0IDOS+cUAtgOICGJA7pSqgNoDMGOr7AnFzgCwAMfQbwBMfAKwS+ANhl82vNtN45lqpRtXdp3DIL04MARkMmMY84YvNDNjCvuHJGZ+IC6AXyA';
          return true;
        };
      },
    },
  ],
  Tutorial: SharedTutorialFunction,
};
tutorial[4] = {
  title: "Tutorial",
  imageFile: "30076.png",
  player: runner,
  link: 0,
  cardType: "identity",
  subTypes: ["Natural"],
  hideTags: true,
  hideCredits: false,
  hideClicks: false,
  hideMU: false,
  hideCoreDamage: true,
  hideHandSize: false,
  hideBadPublicity: true,
  tutorialIncrementer: 0,
  //each step has a triggering phase identifier string and a function action to take
  tutorialSteps: [
    {
      //Welcome to Netrunner
      str: "",
      action: function () {
        //blank string means start-of-game init
        skipShuffleAndDraw = true;
        Math.seedrandom(0);
        corp.creditPool = 5;
        runner.creditPool = 5;
		//set up field
		RunnerTestField(30076, //identity
			[], //heapCards
			[30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30028,30029], //stackCards
			[30020,30020,30027,30030,30030], //gripCards
			[30026,30034], //installed
			[], //stolen
			cardBackTexturesRunner,glowTextures,strengthTextures);
		CorpTestField(30077, //identity
			[], //archivesCards
			[30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30075,30075], //rndCards
			[30075,30075,30071,30071], //hqCards
			[], //archivesInstalled
			[30074], //rndInstalled
			[30074], //hqInstalled
			[[30045,30073],[30067]], //remotes (array of arrays)
			[], //scored
			cardBackTexturesCorp,glowTextures,strengthTextures);
		corp.identityCard.faceUp=true; //not sure why this is needed but it is
		corp.RnD.ice[0].rezzed=true;
		corp.HQ.ice[0].rezzed=true;
		corp.remoteServers[0].root[0].advancement=1;
		corp.remoteServers[1].root[0].advancement=1;
        ChangePhase(phases.corpStartDraw);
		TutorialMessage("公司的一个基础行动是通过花费1时点和1信用点以*推进*一张卡牌（放置1枚推进指示物到该卡牌上）。\n\n只有部分卡牌可以被推进（所有的议案和一些文本提到可以被推进的卡牌）。",true);
      },
    },
    {
      //Corp action
      str: "Corp 2.2",
      action: function () {
		TutorialCommandMessage = {}
		TutorialWhitelist = ["advance",corp.remoteServers[1].root[0],"n"];
        TutorialMessage("");
      },
    },
    {
      //Corp action
      str: "Corp 2.2",
      action: function () {
		TutorialCommandMessage = {}
		TutorialWhitelist = ["advance",corp.remoteServers[1].root[0],"n"];
        TutorialMessage("");
      },
    },
    {
      //Corp action
      str: "Corp 2.2",
      action: function () {
		TutorialCommandMessage = {}
		TutorialWhitelist = ["advance",corp.remoteServers[1].root[0],"n"];
        TutorialMessage("");
      },
    },
    {
      //Corp post-action
      str: "Corp 2.2*",
      action: function () {
		TutorialCommandMessage = {}
		TutorialWhitelist = null; //not using whitelist
		corp.remoteServers[1].root[0].advancement=4; //hack because the fourth token hasn't rendered yet
		Render();
        TutorialMessage("在其回合中，公司使用了3次推进行动。\n\n每次推进都花费1时点和1信用点，所以他一共花费了3时点和3信用点。",true,function() {
			corp.remoteServers[1].root[0].advancement=4; //completes the above hack because otherwise there will be 5
		});
      },
    },
    {
      //Corp discard phase
      str: "Corp 3.1",
      action: function () {
        TutorialMessage("公司达到了议案的推进需求并且选择将其*计分*。\n\n计分一个议案不需要花费时点，但只能在公司回合开始时或公司进行完一个行动后进行。",true,function(){
			TutorialMessage("公司的*分数区*现在有2点议案分数。\n\n一旦达到7点议案分数，公司就会获胜（使用起始牌组时只要6点即可）。",true);
		});
      },
    },
    {
      //Runner turn
      str: "Runner 1.3",
      action: function () {
		currentPhase.requireHumanInput=true;
		TutorialMessage("远程服务器中已推进的卡牌可能是一个议案。\n\n潜袭该服务器。");
		TutorialWhitelist = null; //not using whitelist
		TutorialBlacklist = ['draw','gain','play','install'];
        TutorialReplacer = function (input) {
          if (input == corp.archives || input == corp.RnD || input == corp.HQ) {
            TutorialMessage(
              "如果服务器根目录中的一张卡牌已推进，通常这是一个议案。\n\n选择该远程服务器。"
            );
		  }
          else return false;
          return true;
        };
      },
    },
    {
	  //Run initiated
      str: "Run 2.1",
      action: function () {
		  TutorialMessage("");
	  },
    },
	{
		//Approaching Tithe
		str: "Run 3.1",
		action: function () {
			TutorialBlacklist = null; //not using blacklist
			TutorialMessage("该防火墙会造成*网域伤害*。\n\n游戏中有几种伤害类型，都会导致潜袭者随机弃除一张手牌。",true);
		},
	},	
	{
		//Taking damage
		str: "Run Subroutines",
		action: function () {
			TutorialMessage("潜袭者的手牌称为*操控器*。\n如果潜袭者的操控器没有卡牌时受到伤害，则公司获胜。\n\n公司不会受到伤害，但如果其研发中心耗尽则会输掉游戏。",true);
		},
	},
    {
	  //Movement
      str: "Run 4.1",
      action: function () {
		  TutorialMessage("");
	  },
    },
    {
	  //Finish encounter
      str: "Run EncounterEnd",
      action: function () {
		  TutorialMessage("由于防火墙是一张公司卡牌，其文本是从公司视角写的。\n\n所以当‘获得1信用点’子进程结算时，公司（而不是潜袭者）获得1信用点。",true);
	  },
    },
    {
	  //Approaching server
      str: "Run 4.3",
      action: function () {
		TutorialCommandMessage = {}
		TutorialWhitelist = null; //not using whitelist
        TutorialMessage("你现在正要*侵入*服务器。如果你此时改主意，还有最后一次机会*退出*（结束本次潜袭），让我们继续。");
        TutorialReplacer = function (input) {
          if (input == "jack")
            TutorialMessage(
              "我们想要进入服务器看看已推进卡牌是不是一个议案，所以选择*继续*。"
            );
          else return false;
          return true;
        };
      },
    },
	{
		str: "Run 4.5",
		action: function () {
			TutorialMessage("你正要读取的卡牌有一个*附载*的指示物。\n\n卡牌上可以附载各种东西，包括信用点甚至是其他卡牌。",true);
		},
	},
	{
		str: "Accessed",
		action: function () {
			TutorialMessage("该卡牌是一个*伏击*。\n\n公司可以推进它，从而唬骗潜袭者以为这是一张议案。\n\n当潜袭者读取它的时候，就会受到伤害！");
			TutorialReplacer = function (input) {
			  if (input == "trash")
				TutorialMessage(
				  "没有必要销毁伏击。\n\n现在我们知道这里有伏击，所以不会再次潜袭这里。\n\n如果这张牌在研发中心或者总部，我们可能会考虑销毁它以防止公司使用它。"
				);
			  else return false;
			  return true;
			};
		},
	},
	{
		str: "Accessed",
		action: function () {
			TutorialReplacer = function (input) {
			  if (input == "trash")
				TutorialMessage(
				  "没有必要销毁伏击。\n\n现在我们知道这里有伏击，所以不会再次潜袭这里。\n\n如果这张牌在研发中心或者总部，我们可能会考虑销毁它以防止公司使用它。"
				);
			  else return false;
			  return true;
			};
		},
	},
	{
		str: "Accessed",
		action: function () {
			TutorialReplacer = function (input) {
			  if (input == "trash")
				TutorialMessage(
				  "没有必要销毁伏击。\n\n现在我们知道这里有伏击，所以不会再次潜袭这里。\n\n如果这张牌在研发中心或者总部，我们可能会考虑销毁它以防止公司使用它。"
				);
			  else return false;
			  return true;
			};
		},
	},
	{
		str: "Runner 1.3",
		action: function () {
			currentPhase.requireHumanInput=true;
			TutorialMessage("操控器卡牌过少可能会很危险。\n\n抽一张卡牌。");
			TutorialBlacklist = ['gain','play','install','run'];
		},
	},
	{
		str: "Runner 1.3*",
		action: function () {
			TutorialMessage("你已经安装了[口才再塑]资源，会让你每回合第一次抽2张卡牌而不是1张。\n\n该卡牌名称前面的小菱形图标代表这是一张*独有*卡牌，你同一时间只能安装一张。",true,function(){
				TutorialMessage("你已经学习了推进、计分和伤害。\n\n现在可以前往教程的最后部分了。",true);
				TutorialReplacer = function (input) {
				  window.location.href = 'engine.html?p=c&mentor=5';
				  return true;
				};
			});
		},
	},
  ],
  Tutorial: SharedTutorialFunction,
};
tutorial[3] = {
  title: "Tutorial",
  imageFile: "30076.png",
  player: runner,
  link: 0,
  cardType: "identity",
  subTypes: ["Natural"],
  hideTags: true,
  hideCredits: false,
  hideClicks: false,
  hideMU: false,
  hideCoreDamage: true,
  hideHandSize: false,
  hideBadPublicity: true,
  tutorialIncrementer: 0,
  //each step has a triggering phase identifier string and a function action to take
  tutorialSteps: [
    {
      //Welcome to Netrunner
      str: "",
      action: function () {
        //blank string means start-of-game init
        skipShuffleAndDraw = true;
        Math.seedrandom(0);
        corp.creditPool = 5;
        runner.creditPool = 5;
		//set up field
		RunnerTestField(30076, //identity
			[], //heapCards
			[30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30028,30029], //stackCards
			[30018,30028,30028,30029,30029], //gripCards
			[], //installed
			[], //stolen
			cardBackTexturesRunner,glowTextures,strengthTextures);
		CorpTestField(30077, //identity
			[], //archivesCards
			[30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30075,30071,30071], //rndCards
			[30071,30071,30071,30071,30071], //hqCards
			[], //archivesInstalled
			[], //rndInstalled
			[], //hqInstalled
			[], //remotes (array of arrays)
			[], //scored
			cardBackTexturesCorp,glowTextures,strengthTextures);
		corp.identityCard.faceUp=true; //not sure why this is needed but it is
        ChangePhase(phases.runnerMulligan);
		runner.clickTracker=0;
        TutorialMessage("在正常游戏中，两位玩家开局都有5信用点、5张手牌，并且没有已安装的卡牌。\n\n每位玩家的*特性*卡牌都牌面朝上，并且可以有能力（这2张是白板）。",true,function(){
			TutorialMessage("在正常游戏开始时，每位玩家有一次机会进行*调度*（将5张卡牌全部洗回牌组并重抽5张。）\n\n现在，选择保留初始手牌。");
			TutorialReplacer = function (input) {
			  if (input == "m") {
				TutorialMessage("在教程中我们需要用到这些卡牌，所以这次选择保留。");
				return true;
			  }
			  //return false to use normal action
			  return false;
			};
		});
      },
    },
    {
      //Corp start
      str: "Corp 1.2",
      action: function () {
        TutorialMessage("");
      },
    },
    {
      //Corp action
      str: "Corp 2.2",
      action: function () {
		TutorialWhitelist = ["draw"];
      },
    },
    {
      //Corp post-action
      str: "Corp 2.2*",
      action: function () {
		TutorialCommandMessage = {}
		TutorialWhitelist = null; //not using whitelist
		Render();
        TutorialMessage("公司使用其第一个时点抽另一张卡牌。\n\n和潜袭者一样，公司可以用基础行动抽一张卡牌。",true);
      },
    },
    {
      //Corp action
      str: "Corp 2.2",
      action: function () {
		TutorialCommandMessage = {}
		TutorialWhitelist = null; //not using whitelist
		TutorialBlacklist = ["draw","gain"];
        TutorialMessage("");
      },
    },
    {
      //Corp post-action
      str: "Corp 2.2*",
      action: function () {
		TutorialCommandMessage = {}
		TutorialWhitelist = null; //not using whitelist
		Render();
        TutorialMessage("公司使用期第二个时点安装一个卡牌到一台新的远程服务器中。",true);
      },
    },
    {
      //Corp action
      str: "Corp 2.2",
      action: function () {
		TutorialCommandMessage = {}
		TutorialWhitelist = null; //not using whitelist
		TutorialBlacklist = ["install"];
        TutorialMessage("公司通过支付激活费用（在这个例子中，是2信用点）以*激活*卡牌（将其翻至牌面朝上，使其生效）。\n\n激活并不需要花费时点，并且可以在几乎任意时间激活（防火墙只能在接驳时激活）。",true,function() {
			TutorialMessage("[表岩屑开采许可]是一个*资产*。资产只能被安装到远程服务器中。\n\n每台远程服务器同一时间只能容纳一个资产或一个议案。",true,function() {
				if (!corp.remoteServers[0].root[0].renderer.zoomed) corp.remoteServers[0].root[0].renderer.ToggleZoom();
				TutorialMessage("资产和其他一些卡牌有*销毁费用*，显示于卡牌的右下角。\n\n如果潜袭者读取它，则可以支付该费用以让公司将其弃除。",true,function() {
					if (corp.remoteServers[0].root[0].renderer.zoomed) corp.remoteServers[0].root[0].renderer.ToggleZoom();
				});
			});
		});
      },
    },
    {
      //Corp post-action
      str: "Corp 2.2*",
      action: function () {
		TutorialCommandMessage = {}
		TutorialWhitelist = null; //not using whitelist
		TutorialBlacklist = null; //not using blacklist
        TutorialMessage("最后一个时点，公司使用了[表岩屑开采许可]上的行动以从其上拿取3信用点。",true);
      },
    },
    {
      //Corp discard phase
      str: "Corp 3.1",
      action: function () {
        TutorialMessage("玩家手牌上限通常为5张。\n\n其回合结束时需要弃除多余的卡牌。",true);
      },
    },
    {
      //Corp EOT
      str: "Corp 3.2",
      action: function () {
		TutorialMessage("弃牌堆也有名字。\n\n公司的弃牌堆称为*档案库*，潜袭者的弃牌堆则称为*堆阵*。\n\n双方均可在任意时刻查看双方弃牌堆的面朝上的卡牌（现在还没有）。",true);
      },
    },
    {
      //Runner turn
      str: "Runner 1.3",
      action: function () {
		currentPhase.requireHumanInput=true;
		TutorialMessage("使用基础行动潜袭并不是潜袭的唯一方式。例如，你可以打出一个潜袭事件以发起一次带有特殊效果的潜袭。\n\n使用事件和/或卡牌能力潜袭。");
		TutorialWhitelist = null; //not using whitelist
		TutorialBlacklist = ['draw','gain','run'];
      },
    },
    {
      //Turn ended
      str: "Runner 2.3",
      action: function () {
        currentPhase.requireHumanInput=true;
		TutorialCommandMessage = {}
		TutorialWhitelist = null; //not using whitelist
        TutorialMessage("你已经学习了资产、销毁费用和不同方式进行潜袭。\n\n现在可以前往教程的下一部分了。");
        TutorialReplacer = function (input) {
		  window.location.href = 'engine.html?p=r&mentor=4';
          return true;
        };
      },
    },
  ],
  Tutorial: SharedTutorialFunction,
  hedgeFundAlreadySeen:false,
  automaticOnAccess: {
    Resolve: function () {
      if ((accessingCard.cardType == 'operation')&&!this.hedgeFundAlreadySeen) {
		  this.hedgeFundAlreadySeen=true;
		  TutorialMessage("这是一张*事务*卡牌。公司打出这张卡牌，如同潜袭者打出事件卡牌。",true);
	  }
    },
    automatic: true,
  },
  responseOnRunEnds: {
    Resolve: function () {
      TutorialMessage("使用事件和/或卡牌能力进行潜袭。.");
    },
    automatic: true,
  },
};
tutorial[2] = {
  title: "Tutorial",
  imageFile: "30076.png",
  player: runner,
  link: 0,
  cardType: "identity",
  subTypes: ["Natural"],
  hideTags: true,
  hideCredits: false,
  hideClicks: false,
  hideMU: true,
  hideCoreDamage: true,
  hideHandSize: true,
  hideBadPublicity: true,
  tutorialIncrementer: 0,
  //each step has a triggering phase identifier string and a function action to take
  tutorialSteps: [
    {
      //Welcome to Netrunner
      str: "",
      action: function () {
        //blank string means start-of-game init
        skipShuffleAndDraw = true;
        Math.seedrandom(0);
        corp.creditPool = 5;
        runner.creditPool = 8;
		//set up field
		RunnerTestField(30076, //identity
			[], //heapCards
			[30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026,30026], //stackCards
			[], //gripCards
			[], //installed
			[], //stolen
			cardBackTexturesRunner,glowTextures,strengthTextures);
		CorpTestField(30077, //identity
			[], //archivesCards
			[30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074,30074], //rndCards
			[30074,30074,30074,30074,30074], //hqCards
			[], //archivesInstalled
			[], //rndInstalled
			[], //hqInstalled
			[], //remotes (array of arrays)
			[], //scored
			cardBackTexturesCorp,glowTextures,strengthTextures);
		corp.identityCard.faceUp=true; //not sure why this is needed but it is
        ChangePhase(phases.corpStartDraw);
        TutorialMessage("在正常游戏中，总是由公司先开始游戏。\n\n公司必须在其回合开始抽一张卡牌，然后有3个时点供其回合内使用。",true);
      },
    },
    {
      //Corp action
      str: "Corp 2.2",
      action: function () {
		TutorialCommandMessage = {}
		TutorialWhitelist = null; //not using whitelist
        TutorialMessage("");
      },
    },
    {
      //Corp post-action
      str: "Corp 2.2*",
      action: function () {
		TutorialCommandMessage = {}
		TutorialWhitelist = null; //not using whitelist
		Render();
        TutorialMessage("公司使用1时点*安装*一张卡牌。\n\n和潜袭者卡牌不同，公司卡牌都是牌面朝下安装。\n\n现在，公司在研发中心前面安装了一张卡牌。",true);
      },
    },
    {
      //Corp action
      str: "Corp 2.2",
      action: function () {
		TutorialCommandMessage = {}
		TutorialWhitelist = null; //not using whitelist
        TutorialMessage("");
      },
    },
    {
      //Corp post-action
      str: "Corp 2.2*",
      action: function () {
		TutorialCommandMessage = {}
		TutorialWhitelist = null; //not using whitelist
		Render();
        TutorialMessage("公司安装的第二张卡牌创建了一台新的服务器。\n\n总部、研发中心和档案库之外的服务器都称为*远程服务器*。\n目前这台远程服务器里还没有东西。",true);
      },
    },
    {
      //Corp action
      str: "Corp 2.2",
      action: function () {
		TutorialCommandMessage = {}
		TutorialWhitelist = null; //not using whitelist
        TutorialMessage("");
      },
    },
    {
      //Corp post-action
      str: "Corp 2.2*",
      action: function () {
		TutorialCommandMessage = {}
		TutorialWhitelist = null; //not using whitelist
		Render();
        TutorialMessage("安装在服务器前面的卡牌可以在潜袭中保护该服务器。\n这些卡牌就是*防火墙*。\n\n公司使用其最后一个时点安装一层防火墙保护总部。",true);
      },
    },
    {
      //Runner turn
      str: "Runner 1.3",
      action: function () {
		currentPhase.requireHumanInput=true;
		TutorialMessage("现在到你的回合了。\n\n试着潜袭总部或研发中心。");
		TutorialWhitelist = null; //not using whitelist
		TutorialBlacklist = ['draw','gain',corp.archives,corp.remoteServers[0]];
      },
    },
    {
      //Corp opportunity to rez
      str: "Run 2.1",
      action: function () {
		TutorialCommandMessage = {}
		TutorialWhitelist = null; //not using whitelist
        TutorialMessage("当你*接驳*一层防火墙时，公司有机会将其*激活*（翻至牌面朝上）。\n\n要这么做，公司需要支付其激活费用。",true);
      },
    },
    {
      //Encountering ice
      str: "Run 3.1",
      action: function () {
		TutorialCommandMessage = {}
		TutorialWhitelist = null; //not using whitelist
		if (attackedServer.ice[approachIce].renderer.zoomed) attackedServer.ice[approachIce].renderer.ToggleZoom(); //don't cover tutorial text with zoomed card
        TutorialMessage("现在你将*遭遇*该防火墙，并且其上的*子进程*将会触发。\n\n据此，你会失去3信用点，然后，因为你只有6信用点或更少，潜袭将结束。",true);
		/*
		if (!GetApproachEncounterIce().renderer.zoomed) GetApproachEncounterIce().renderer.ToggleZoom();
        TutorialReplacer = function (input) {
		  if (GetApproachEncounterIce().renderer.zoomed) GetApproachEncounterIce().renderer.ToggleZoom();
          //return false to use normal action
          return false;
        };
		*/
      },
    },
    {
      //Draw a card
      str: "Runner 1.3",
      action: function () {
		currentPhase.requireHumanInput=true;
		TutorialMessage("你的另一个基础行动是可以花费1时点以*抽*一张卡牌。\n\n将你的*存储栈*顶端卡牌拖至屏幕下方以抽一张卡牌。\n\n");
		TutorialWhitelist = ['draw','n'];
		TutorialBlacklist = null; //not using blacklist
        TutorialReplacer = function (input) {
          //return false to use normal action
          return false;
        };
      },
    },
    {
      //Explain card types
      str: "Runner 1.3*",
      action: function () {
		TutorialCommandMessage = {}
		TutorialWhitelist = null; //not using whitelist
        TutorialMessage("潜袭者卡牌类型一共有4种。\n\n*事件*卡牌在使用后就会被弃除。\n\n*硬件*、*程序*和*资源*卡牌会留在场上，除非有其他效果将其移除。",true);
      },
    },
	//In order to get through this ice, we will need to find a PROGRAM.
    {
      //Install icebreaker
      str: "Runner 1.3",
      action: function () {
		currentPhase.requireHumanInput=true;
		TutorialMessage("要*安装*这个[团结]程序，将其从手牌拖到上面并松开。\n\n在花费1时点的同时，你也需要支付3信用点的安装费用。");
		TutorialWhitelist = null; //not using whitelist
		TutorialBlacklist = ['draw','run','gain'];
      },
    },
    {
      //Explain mu
      str: "Runner 1.3*",
      action: function () {
		this.hideMU = false;
		TutorialCommandMessage = {}
		TutorialWhitelist = null; //not using whitelist
        TutorialMessage("和其他卡牌不同，程序需占用*内存单元*，潜袭者一开始有4个内存单元。\n\n[团结]需占用1个内存单元，所以你还剩3个。\n\n如果因为某些原因导致该程序被卸载，可用的内存单元将恢复到4个。",true);
		Render();
      },
    },
    {
      //Run again
      str: "Runner 1.3",
      action: function () {
		currentPhase.requireHumanInput=true;
		TutorialMessage("[团结]是一个*破解器-解码模块*。其可以破解*门禁*防火墙上的子进程，这正是我们所要的。\n\n试着再对总部或者研发中心发起一次潜袭吧。");
		TutorialWhitelist = null; //not using whitelist
		TutorialBlacklist = ['draw','gain',corp.archives,corp.remoteServers[0]];
      },
    },
    {
      //Explain interface
      str: "Run 2.1",
      action: function () {
		TutorialCommandMessage = {}
		TutorialWhitelist = null; //not using whitelist
		TutorialBlacklist = null; //not using blacklist
        TutorialMessage("破解器只有在能够和防火墙*对接*时才有用，这需要其*强度*等于或高于防火墙的强度。\n\n现在，[团结]的强度为1而[空白]的强度为0，所以[团结]可以直接对接。",true);
      },
    },
    {
      //Use icebreaker
      str: "Run 3.1",
      action: function () {
		currentPhase.preventCancel=true;
		TutorialMessage("点击[团结]，随后点击一条子进程以*破解*（现在还不行）。\n\n破解会防止子进程在遭遇时结算，但是下次遭遇时所有的子进程又会发动。");
		TutorialWhitelist = null; //not using whitelist
        TutorialReplacer = function (input) {
		  if (attackedServer.ice[0].subroutines[1].broken) {
			this.tutorialIncrementer++;      
		  }
		  else if (input == "n") {
            TutorialMessage("如果我们让子进程发动，我们就进不了服务器。\n\n使用[团结]以破解一条子进程。");
			return true;
		  }
		  
          //return false to use normal action
          return false;
        };
      },
    },
    {
      //Possibly use icebreaker again
      str: "Run 3.1",
      action: function () {
		if (!attackedServer.ice[0].subroutines[1].broken) {
			this.tutorialIncrementer--;
			this.tutorialSteps[this.tutorialIncrementer - 1].action.call(this);      
		}
	  },
    },
    {
	  //Need to do this once before the real one
      str: "Run 4.3",
      action: function () {
      },
    },
    {
	  //Approaching server
      str: "Run 4.3",
      action: function () {
		TutorialCommandMessage = {}
		TutorialWhitelist = null; //not using whitelist
        TutorialMessage("你现在正要*侵入*服务器。如果你此时改主意，还有最后一次机会*退出*（结束本次潜袭），让我们继续。");
        TutorialReplacer = function (input) {
          if (input == "jack") {
            TutorialMessage("我们想要进入服务器，现在退出没有任何好处，所以选择*继续*。");
			return true;
		  }
          //return false to use normal action
          return false;
        };
      },
    },
    {
      str: "Run Accessing",
      action: function () {
		TutorialCommandMessage = {}
		TutorialWhitelist = null; //not using whitelist
        TutorialMessage("当你读取大多数卡牌时，你查看他们并放回原位。\n\n现在你读取了一张防火墙卡牌。\n\n点击下方的按钮以将其放回去并结束潜袭。");
      },
    },
    {
      //Turn ended
      str: "Runner 2.3",
      action: function () {
        currentPhase.requireHumanInput=true;
		TutorialCommandMessage = {}
		TutorialWhitelist = null; //not using whitelist
        TutorialMessage("你已经学会了防火墙和破解器。\n\n现在可以前往教程的下一部分了。");
        TutorialReplacer = function (input) {
		  window.location.href = 'engine.html?p=r&mentor=3';
          return true;
        };
      },
    },
  ],
  Tutorial: SharedTutorialFunction,
};
tutorial[1] = {
  title: "Tutorial",
  imageFile: "30076.png",
  player: runner,
  link: 0,
  cardType: "identity",
  subTypes: ["Natural"],
  hideTags: true,
  hideCredits: false,
  hideClicks: false,
  hideMU: true,
  hideCoreDamage: true,
  hideHandSize: true,
  hideBadPublicity: true,
  tutorialIncrementer: 0,
  //each step has a triggering phase identifier string and a function action to take
  tutorialSteps: [
    {
      //Welcome to Netrunner
      str: "",
      action: function () {
        //blank string means start-of-game init
        skipShuffleAndDraw = true;
        Math.seedrandom(0);
        corp.creditPool = 5;
        runner.creditPool = 1;
		//set up field
		RunnerTestField(30076, //identity
			[], //heapCards
			[30014,30014,30014,30014,30014,30014,30014,30014,30014,30014,30014,30014,30014,30014,30014,30014,30014,30014,30014,30014,30014,30014,30014,30014,30014,30014,30014,30014,30014], //stackCards
			[30030,30020], //gripCards
			[30027], //installed
			[], //stolen
			cardBackTexturesRunner,glowTextures,strengthTextures);
		CorpTestField(30077, //identity
			[], //archivesCards
			[30067,30067,30067,30067,30067,30067,30067,30067,30067,30067,30067,30067,30067,30067,30067,30067,30067,30067,30067,30067,30067,30067,30067,30067,30067,30067,30067,30067,30067,30067], //rndCards
			[30067,30067,30067,30067,30067], //hqCards
			[], //archivesInstalled
			[], //rndInstalled
			[], //hqInstalled
			[], //remotes (array of arrays)
			[], //scored
			cardBackTexturesCorp,glowTextures,strengthTextures);
		corp.identityCard.faceUp=true; //not sure why this is needed but it is
		runner.rig.resources[0].credits=3;
        ChangePhase(phases.runnerStartResponse);
		corp.clickTracker=0;
        TutorialMessage("卡牌有多种颜色。\n\n这代表其隶属于不同的*派系*，但在游戏过程中没有影响（同派系的卡牌功能会比较类似）。",true,function() {
			TutorialMessage("在一局游戏中，双方玩家都会经常获得和花费*信用点*。\n\n现在，你（潜袭者）的*信用池*（见下方）中有1信用点，而公司则有5信用点。",true);
		});
      },
    },
    {
      //Make money
      str: "Runner 1.3",
      action: function () {
		TutorialMessage(
		 "除了进行潜袭，你的回合可以执行的其他行动包括：\n• 获得1信用点（点击信用点图标）\n• 打出一张事件卡牌（将牌从手牌拖到上面后松开）\n• 触发一个能力（点击在场的卡牌）\n\n使用这些行动以让你回合结束时有13信用点。"
        );
		TutorialWhitelist = null; //not using whitelist
		TutorialBlacklist = ['run','draw'];
        TutorialReplacer = function (input) {
          //return false to use normal action
          return false;
        };
      },
    },
    {
      //Turn ended
      str: "Runner 2.3",
      action: function () {
		TutorialCommandMessage = {}
        currentPhase.requireHumanInput=true;
		TutorialWhitelist = null; //not using whitelist
        if (runner.creditPool >= 13) {
			TutorialMessage("干得好！\n\n现在可以前往教程的下一部分了。");
		}
		else {
			TutorialMessage("你可以做得更好！\n\n点击*继续*以再次尝试。");
		}
        TutorialReplacer = function (input) {
		  if (runner.creditPool >= 13) window.location.href = 'engine.html?p=r&mentor=2';
		  else {
			  //reset
			  runner.creditPool = 1;
			  for (var i=runner.heap.length-1; i>-1; i--) {
				  if (runner.heap[i].cardType == 'resource') MoveCard(runner.heap[i],runner.rig.resources);
				  else MoveCard(runner.heap[i],runner.grip);
			  }
			  runner.rig.resources[0].credits=3;
			  this.tutorialIncrementer-=2;
			  ChangePhase(phases.runnerStartResponse);
			  Render();
			  Execute("n");
			  return true;
		  }
          //return false to use normal action
          return true;
        };
      },
    },
  ],
  Tutorial: SharedTutorialFunction,
};
tutorial[0] = {
  title: "Tutorial",
  imageFile: "30076.png",
  player: runner,
  link: 0,
  cardType: "identity",
  subTypes: ["Natural"],
  hideTags: true,
  hideCredits: true,
  hideClicks: true,
  hideMU: true,
  hideCoreDamage: true,
  hideHandSize: true,
  hideBadPublicity: true,
  tutorialIncrementer: 0,
  //each step has a triggering phase identifier string and a function action to take
  tutorialSteps: [
    {
      //Welcome to Netrunner
      str: "",
      action: function () {
        //blank string means start-of-game init
        skipShuffleAndDraw = true;
        Math.seedrandom(0);
        corp.creditPool = 5;
        runner.creditPool = 5;
		//set up field
		RunnerTestField(30076, //identity
			[], //heapCards
			[30014,30014,30014,30014,30014,30014,30014,30014,30014,30014,30014,30014,30014,30014,30014,30014,30014,30014,30014,30014,30014,30014,30014,30014,30014,30014,30014,30014,30014], //stackCards
			[], //gripCards
			[], //installed
			[], //stolen
			cardBackTexturesRunner,glowTextures,strengthTextures);
		CorpTestField(30077, //identity
			[], //archivesCards
			[30067,30067,30067,30067,30067,30067,30067,30067,30067,30067,30067,30067,30067,30067,30067,30067,30067,30067,30067,30067,30067,30067,30067,30067,30067,30067,30067,30067,30067,30067], //rndCards
			[30067,30067,30067,30067,30067], //hqCards
			[], //archivesInstalled
			[], //rndInstalled
			[], //hqInstalled
			[], //remotes (array of arrays)
			[], //scored
			cardBackTexturesCorp,glowTextures,strengthTextures);
		corp.identityCard.faceUp=true; //not sure why this is needed but it is
        ChangePhase(phases.runnerStartResponse);
		corp.clickTracker=0;
        TutorialMessage("欢迎来到矩阵潜袭!\n\n你是一名潜袭者 (你的卡牌拥有红色牌背), 而你的对手是一家公司 (蓝色牌背卡牌).",true);
      },
    },
    {
      //Try a run
      str: "Runner 1.3",
      action: function () {
        currentPhase.requireHumanInput=true;
		TutorialMessage(
		 "潜袭是针对*服务器*（屏幕最上方的那些卡牌）进行的攻击。\n\n每回合你有4个*时点*（行动）供使用（见下方）。公司目前有0时点。\n\n点击下方按钮以使用你的第一个时点进行一次潜袭。"
        );
		runner.identityCard.hideClicks = false;
		Render();
		TutorialCommandMessage.run = "公司在游戏开始时有3个初始服务器：*档案库*（弃牌堆）、*总部*（手牌）和*研发中心*（牌组）。\n\n由于档案库是空的，选择研发中心或总部。";
		TutorialWhitelist = null; //not using whitelist
		TutorialBlacklist = ['gain','draw',corp.archives];
        TutorialReplacer = function (input) {
          //return false to use normal action
          return false;
        };
      },
    },
    {
	  //Approaching server
      str: "Run 4.3",
      action: function () {
		TutorialCommandMessage = {}
		TutorialWhitelist = null; //not using whitelist
        TutorialMessage("你现在正要*侵入*服务器。如果你此时改主意，还有最后一次机会*退出*（结束本次潜袭），让我们继续。");
        TutorialReplacer = function (input) {
          if (input == "jack")
            TutorialMessage(
              "我们想要进入服务器，现在退出没有任何好处，所以选择*继续*。"
            );
          else return false;
          return true;
        };
      },
    },
	{
		str: "Run 4.5",
		action: function () {
			TutorialMessage("");
		},
	},
    {
      //Run successful
      str: "Run 5.1",
      action: function () {
		currentPhase.requireHumanInput=true;
		TutorialCommandMessage = {}
		TutorialWhitelist = null; //not using whitelist
        TutorialMessage("你的潜袭成功了。\n\n现在你将*侵入*服务器并可以*读取*一张卡牌。");
      },
    },
    {
      str: "Run Accessing",
      action: function () {
		TutorialCommandMessage = {}
		TutorialWhitelist = null; //not using whitelist
		//if (accessingCard.renderer.zoomed) accessingCard.renderer.ToggleZoom(); //don't cover tutorial text with zoomed card
        TutorialMessage("通常你会将卡牌放回去，但这次你读取到一张*议案*。",true,function(){TutorialMessage("点击下方按钮以*窃取*该议案。\n\n忽视上面的‘当你计分时’效果，因为你是窃取该议案，而不是将其计分。")});
      },
    },
    {
      str: "Run 6.4",
      action: function () {
		currentPhase.requireHumanInput=true;
		TutorialCommandMessage = {}
		TutorialWhitelist = null; //not using whitelist
        TutorialMessage("你刚窃取的议案价值2点议案分数。\n\n一旦从公司窃取合计7点议案分数，你就会获胜（使用起始牌组时只要6点即可）。\n\n点击*继续*以前往教程的下一部分。");
        TutorialReplacer = function (input) {
		  window.location.href = 'engine.html?p=r&mentor=1';
          return true;
        };
      },
    },
  ],
  Tutorial: SharedTutorialFunction,
};
