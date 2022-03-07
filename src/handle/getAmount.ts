function getAmount(amountText: string): Array<any> {
  const exp = /[0-9]+/g;
  const match = amountText.match(exp);
  const cleanAmount = match.filter((a) => Number(a));
  const orderAmount = cleanAmount.sort((a, b) => Number(a) - Number(b));
  return orderAmount
}

export default getAmount;
