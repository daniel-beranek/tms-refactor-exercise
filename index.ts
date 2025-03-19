import { invoices, plays } from "./constants";
import type {
  GetPerformancesInfo,
  GetResult,
  GetTotalAmount,
  GetVolumeCredits,
  Invoice,
  Plays,
} from "./types.ts";

const format: (value: number) => string = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
}).format;

const getResult: GetResult = ({
  customer,
  performancesInfo,
  totalAmount,
  volumeCredits,
}) => {
  let result: string = `Statement for ${customer}\n`;

  performancesInfo.forEach((pI) => {
    result += ` ${pI.playName}: ${format(pI.amount / 100)} (${
      pI.audience
    } seats)\n`;
  });

  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits\n`;

  return result;
};

const getPerformancesInfo: GetPerformancesInfo = ({ invoice, plays }) => {
  return invoice.performances.map((p) => {
    const playName = plays[p.playID].name;
    const audience = p.audience;
    let amount = 0;
    switch (plays[p.playID].type) {
      case "tragedy":
        amount = 40000;
        if (audience > 30) {
          amount += 1000 * (audience - 30);
        }
        break;
      case "comedy":
        amount = 30000;
        if (audience > 20) {
          amount += 10000 + 500 * (audience - 20);
        }
        amount += 300 * audience;
        break;
      default:
        throw new Error(`unknown type: ${plays[p.playID].type}`);
    }
    return { playName, audience, amount };
  });
};

const getTotalAmount: GetTotalAmount = (performancesInfo) => {
  return performancesInfo.reduce((acc, pI) => acc + pI.amount, 0);
};

const getVolumeCredits: GetVolumeCredits = ({ invoice, plays }) => {
  return invoice.performances.reduce((acc, p) => {
    const play = plays[p.playID];

    if (play.type === "comedy") {
      return acc + Math.floor(p.audience / 5) + Math.max(p.audience - 30, 0);
    }

    return acc + Math.max(p.audience - 30, 0);
  }, 0);
};

function statement(invoice: Invoice, plays: Plays): string {
  const performancesInfo = getPerformancesInfo({ invoice, plays });
  const volumeCredits = getVolumeCredits({ invoice, plays });

  return getResult({
    customer: invoice.customer,
    performancesInfo,
    totalAmount: getTotalAmount(performancesInfo),
    volumeCredits,
  });
}

console.log(statement(invoices[0], plays));
