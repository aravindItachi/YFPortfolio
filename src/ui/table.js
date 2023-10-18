import { addSpanNodeUtil } from "../utils/utils";

const theadData = {
  "1": ["Symbol", "tcol"],
  "2": ["Last Price", "tcol"],
  "3": ["Change %", "tcol"]
};

const tableClass = "table";

export const generateTable = (tbodyData, quotes) => {
  let t;
  const table = document.createElement("table");
  table.setAttribute("class", tableClass);
  const thead = document.createElement("thead");
  const theadTr = document.createElement("tr");

  for (t = 1; t <= Object.keys(theadData).length; t++) {
    const td = document.createElement("td");
    td.className = "val";
    td.innerText = theadData[t][0];
    td.setAttribute("class", theadData[t][1]);
    theadTr.appendChild(td);
  }
  thead.appendChild(theadTr);

  const tbody = document.createElement("tbody");
  let tbodyTd = {};

  for (t = 0; t < tbodyData.length; t++) {
    const tbodyTr = document.createElement("tr");
    const symbol = tbodyData[t][0];
    const fullName = quotes.getQuote(symbol).shortName;

    for (let a = 0; a < tbodyData[t].length; a++) {
      tbodyTd[a] = document.createElement("td");
      //tbodyTd[a].innerText = tbodyData[t][a];
      if (a == 0) {
        tbodyTd[a].className = "val symbol";
        tbodyTd[a].appendChild(addSpanNodeUtil(tbodyData[t][a], "span-data"));
        fullName &&
          tbodyTd[a].appendChild(addSpanNodeUtil(fullName, "span-fullname"));
      } else {
        if (tbodyData[t][a].includes("+")) {
          tbodyTd[a].className = "val positive";
        } else {
          tbodyTd[a].className = "val negative";
        }
        if (a == 2) {
          tbodyTd[a].setAttribute("data-symbol", symbol);
        }

        tbodyTd[a].appendChild(addSpanNodeUtil(tbodyData[t][a], "span-data"));
      }

      //append single table data to table row
      tbodyTr.appendChild(tbodyTd[a]);
    }
    tbody.appendChild(tbodyTr);
  }
  table.appendChild(thead);
  table.appendChild(tbody);
  document.querySelector("#table").appendChild(table);
};
