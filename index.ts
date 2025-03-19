import { invoices, plays } from "./constants";
import type { GetResult } from "./types.ts";

const format: (value: number) => string = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
}).format;

const getResult: GetResult = ({
  customer,
  performances,
  totalAmount,
  volumeCredits,
}) => {
  let result: string = `Statement for ${customer}\n`;

  performances.forEach((performance) => {
    result += ` ${performance.playName}: ${format(performance.amount / 100)} (${
      performance.audience
    } seats)\n`;
  });

  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits\n`;

  return result;
};

function statement(invoice: any, plays: any): string {
  let totalAmount: number = 0;
  let volumeCredits: number = 0;
  let result: string = `Statement for ${invoice.customer}\n`;

  for (let perf of invoice.performances) {
    const play: any = plays[perf.playID];
    let thisAmount: number = 0;

    switch (play.type) {
      case "tragedy":
        thisAmount = 40000;
        if (perf.audience > 30) {
          thisAmount += 1000 * (perf.audience - 30);
        }
        break;
      case "comedy":
        thisAmount = 30000;
        if (perf.audience > 20) {
          thisAmount += 10000 + 500 * (perf.audience - 20);
        }
        thisAmount += 300 * perf.audience;
        break;
      default:
        throw new Error(`unknown type: ${play.type}`);
    }

    volumeCredits += Math.max(perf.audience - 30, 0);

    if ("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);

    totalAmount += thisAmount;
  }

  return getResult({
    customer: invoice.customer,
    performances: invoice.performances,
    totalAmount,
    volumeCredits,
  });
}

console.log(statement(invoices[0], plays));
