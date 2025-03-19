import { invoices, plays } from "./constants";
import type {
  GetPerformancesInfo,
  GetResult,
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

function statement(invoice: Invoice, plays: Plays): string {
  let totalAmount: number = 0;
  let volumeCredits: number = 0;

  for (let perf of invoice.performances) {
    const play: any = plays[perf.playID];
    let thisAmount: number = 0;

    volumeCredits += Math.max(perf.audience - 30, 0);

    if ("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);

    totalAmount += thisAmount;
  }

  return getResult({
    customer: invoice.customer,
    performancesInfo: getPerformancesInfo({ invoice, plays }),
    totalAmount,
    volumeCredits,
  });
}

console.log(statement(invoices[0], plays));
