export interface Filter {
  range: 50 | 100 | 150 | 200;
  initDay: number;
  adults: number;
  source: "booking" | "airbnb";
}
