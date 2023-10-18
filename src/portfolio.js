export class PortFolios {
  constructor() {
    this.basePortFolio = {};
    this.portfolios = [];
  }

  getBasePortFolio() {
    return this.basePortFolio;
  }

  getPortFolio(pfId) {
    return this.portfolios.find((portfolio) => {
      return portfolio.pfId == pfId;
    });
  }

  getPortFolioMeta() {
    return this.portfolios.map((portfolio) => {
      return portfolio.pfId + "::" + portfolio.pfName;
    });
  }

  setPortFolioData(portfolioResponse) {
    if (!portfolioResponse && !portfolioResponse.finance.result) {
      return;
    }

    const {
      portfolios,
      ...basePortFolioData
    } = portfolioResponse.finance.result[0];
    this.portfolios = portfolios;
    this.basePortFolio = basePortFolioData;
  }

  getPortFolioSymbols(pfId) {
    const portFolio = this.getPortFolio(pfId);
    return portFolio.positions.map((pos) => {
      return pos.symbol;
    });
  }
}
