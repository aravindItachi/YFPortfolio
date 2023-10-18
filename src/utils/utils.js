export const NumberFormatter = (value, decimal) => {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimal,
    maximumFractionDigits: decimal,
    style: "currency",
    currency: "USD"
  });
  //return value;
};

export const NumberValFormatter = (value, decimal) => {
  if (!value) {
    return "-";
  }

  const valnum = Number.parseFloat(value).toFixed(decimal);
  return valnum > 0 ? "+" + valnum : valnum;
};

export const NumberPercantageFormatter = (value, decimal) => {
  if (!value) {
    return "-";
  }

  const valnum = Number.parseFloat(value).toFixed(decimal);
  return valnum > 0 ? "+" + valnum + "%" : valnum + "%";
};

export const addSpanNodeUtil = (value, cl) => {
  const spanNode = document.createElement("span");
  spanNode.className = cl;
  spanNode.appendChild(document.createTextNode(value));

  return spanNode;
};

export const addSpanColorClass = (number) => {
  return number > 0 ? "positive" : "negative";
};

export const symbolValidator = (symbol) => {
  console.log("symbol", symbol);
  //console.log(symbol.replace("=", " "));
  return symbol.replace("=", "");
};
