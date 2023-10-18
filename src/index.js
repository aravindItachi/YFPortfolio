import "./styles.css";
import getData from "./api/utils/getData";
import { Quotes } from "./quotes";
import { PortFolios } from "./portfolio";
import {
  NumberFormatter,
  addSpanNodeUtil,
  addSpanColorClass,
  NumberPercantageFormatter,
  NumberValFormatter,
  symbolValidator
} from "./utils/utils";
import { generateTable } from "./ui/table";

let quotes = new Quotes();
let portfolios = new PortFolios();
const decimalPlaces = 2;
let tbodyData = [];
let pfIds = [];
let toggle = false;

getData("https://7w9k9.wiremockapi.cloud/portfolios")
  .then((result) => {
    portfolios.setPortFolioData(result);
    console.log("portfolios", portfolios.getBasePortFolio());
    console.log("pf", portfolios.getPortFolioMeta());
    // update data Store.
    // Update UI.
    getQuotes();
  })
  .catch((error) => {
    console.error(error);
    // Update UI
  });

const updateBasePortFolioData = () => {
  const pdata = portfolios.getBasePortFolio();
  const currMarkValue = pdata.currentMarketValue;
  const dailyGain = NumberFormatter(pdata.dailyGain, decimalPlaces);
  const dGPerct = NumberPercantageFormatter(
    pdata.dailyPercentGain,
    decimalPlaces
  );
  const totalGain = NumberFormatter(pdata.totalGain, decimalPlaces);
  const totalPerct = NumberPercantageFormatter(
    pdata.totalPercentGain,
    decimalPlaces
  );
  const marketNode = document.getElementById("market");
  const spanNodeM = document.createElement("span");
  spanNodeM.className = "m-val";
  marketNode.appendChild(spanNodeM);
  spanNodeM.appendChild(
    document.createTextNode(NumberFormatter(currMarkValue, decimalPlaces))
  );

  marketNode.appendChild(addSpanNodeUtil("Market Value", "n-val"));

  const dailyGainNode = document.querySelector("#gain .dailygain");

  dailyGainNode.appendChild(
    addSpanNodeUtil(dailyGain, "n-val " + addSpanColorClass(pdata.dailyGain))
  );
  dailyGainNode.appendChild(
    addSpanNodeUtil(
      dGPerct,
      "n-val " + addSpanColorClass(pdata.dailyPercentGain)
    )
  );
  dailyGainNode.appendChild(addSpanNodeUtil("Daily Gain", "k-val"));

  const totalGainNode = document.querySelector("#gain .totalgain");

  totalGainNode.appendChild(
    addSpanNodeUtil(totalGain, "n-val " + addSpanColorClass(pdata.totalGain))
  );
  totalGainNode.appendChild(
    addSpanNodeUtil(
      totalPerct,
      "n-val " + addSpanColorClass(pdata.totalPercentGain)
    )
  );
  totalGainNode.appendChild(addSpanNodeUtil("Total Gain", "k-val"));
};

const generateSymBolTable = () => {
  const tableBodyData = constructTBodyData();
  generateTable(tableBodyData, quotes);
  setInterval(simulateStreaming, 8000);
};

const constructTBodyData = () => {
  const quotesList = quotes.getAllQuotes().values();

  for (const quote of quotesList) {
    let trow = [];
    const { symbol, regularMarketPrice, regularMarketChangePercent } = quote;
    trow.push(
      symbol,
      NumberValFormatter(regularMarketPrice, decimalPlaces),
      NumberPercantageFormatter(regularMarketChangePercent, decimalPlaces)
    );
    tbodyData.push(trow);
  }

  return tbodyData;
};

const simulateStreaming = (isNegative) => {
  // the same number as the index
  removeAnimation();
  const randomNumber = Math.floor((Math.random() * tbodyData.length) / 2);
  const changeRandomNumber = Math.floor(Math.random() * 10) + 1;
  const symbol = tbodyData[randomNumber][0];
  const priceChangePercent = quotes.getQuote(symbol).regularMarketChangePercent;
  if (priceChangePercent) {
    console.log("price", priceChangePercent);
    console.log("randome", changeRandomNumber);
    const changeRandom = toggle
      ? priceChangePercent + changeRandomNumber / 100
      : priceChangePercent - changeRandomNumber / 100;
    quotes.setQuoteChangePerc(symbol, changeRandom);
    const isPosChange = changeRandom > priceChangePercent ? true : false;
    console.log("change", changeRandom);
    const changeNode = document.querySelector(
      `#table .val[data-symbol=${symbol}] .span-data`
    );
    changeNode.innerText = NumberPercantageFormatter(
      changeRandom,
      decimalPlaces
    );
    if (changeRandom > 0) {
      changeNode.parentNode.classList.add("positive");
      changeNode.parentNode.classList.remove("negative");
    } else {
      changeNode.parentNode.classList.add("negative");
      changeNode.parentNode.classList.remove("positive");
    }
    changeNode.classList.add("animate");
    isPosChange
      ? changeNode.classList.add("animate-pos")
      : changeNode.classList.add("animate-neg");
    toggle = !toggle;
  }
};

const removeAnimation = () => {
  const spanNodes = document.querySelectorAll("#table .val .span-data");
  spanNodes.forEach((node) => {
    node.classList.remove("animate-pos");
    node.classList.remove("animate-neg");
  });
};

const addPortFolio = () => {
  const portfoliosMeta = portfolios.getPortFolioMeta();
  const selectNode = document.getElementById("pf");
  portfoliosMeta.forEach((meta) => {
    const option = document.createElement("option");
    const metaInfo = meta.split("::");
    option.value = metaInfo[0];
    pfIds.push(metaInfo[0]);
    option.innerText = metaInfo[1];
    selectNode.appendChild(option);
  });
};

const addDistincSymbols = (pfId) => {
  const portfolioSymbols = portfolios.getPortFolioSymbols(pfId);
  console.log("debug2", portfolioSymbols);
  portfolioSymbols.forEach((pos) => {
    const symbol = symbolValidator(pos);
    if (!quotes.hasQuote(symbol)) {
      quotes.setQuote(symbol);
    }
  });
};

const getQuotes = () => {
  getData("https://7w9k9.wiremockapi.cloud/quote")
    .then((result) => {
      quotes.setQuotesData(result);
      console.log("quotes", quotes.getAllQuotes());
      // update data Store.
      // Update UI.
      addPortFolio();
      console.log("pfIDS", pfIds);
      pfIds.forEach((pfId) => {
        addDistincSymbols(pfId);
      });
      updateBasePortFolioData();
      generateSymBolTable();
    })
    .catch((error) => {
      console.error(error);
      // Update UI
    });
};
console.log("hi");
