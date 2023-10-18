import { symbolValidator } from "./utils/utils";

export class Quotes {
  constructor() {
    this.quotes = new Map();
  }
  getAllQuotes() {
    return this.quotes;
  }
  getQuote(symbol) {
    return this.quotes.get(symbol);
  }
  hasQuote(symbol) {
    return this.quotes.has(symbol);
  }
  setQuotesData(quotes) {
    if (!quotes || !quotes.quoteResponse) {
      return;
    }

    quotes.quoteResponse.result.forEach((element) => {
      const symbolModifier = symbolValidator(element.symbol);
      element.symbol = symbolModifier;
      this.quotes.set(symbolModifier, element);
    });
  }
  setQuoteChangePerc(symbol, change) {
    this.quotes.get(symbol).regularMarketChangePercent = change;
  }
  setQuote(symbol) {
    this.quotes.set(symbol, { symbol });
  }
}
