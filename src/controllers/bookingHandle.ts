import { datesCheckInOut } from "../types/checkInOut.type";
import { parseUrl } from "../services/proxy";
import { add, format } from "date-fns";

/**
 *
 * @param checkDates
 * @param adults
 * @param type
 * @returns
 */
function builderUrlBooking(
  checkDates: datesCheckInOut,
  adults: number,
  type: number
): string {
  const { checkIn, checkOut } = checkDates;

  const privacyType = {
    50: "privacy_type%3D3%3Bpri%3D1",
    100: "privacy_type%3D3%3Bpri%3D2",
    150: "privacy_type%3D3%3Bpri%3D3",
    200: "privacy_type%3D3%3Bpri%3D4",
  };

  const originaUrl = [
    `https://www.booking.com/searchresults.es.html?`,
    `label=gen173nr-1FCAQoggI4-gNIClgEaEaIAQGYAQq4ARfIAQzYAQHoAQH4AQOIAgGoAgO4Aq_5xJAGwAIB0gIkNGM5OGIwZGYtOTljOC00OTZmLTg3YWYtZmI2ZjUzYTkwMDE12AIF4AIB&`,
    `sid=c164a2a21ede1af159b039e5574a0a20&aid=304142&src=searchresults&`,
    `error_url=https%3A%2F%2Fwww.booking.com%2Fsearchresults.es.html%3Faid%3D304142%3Blabel%`,
    `3Dgen173nr-1FCAQoggI4-gNIClgEaEaIAQGYAQq4ARfIAQzYAQHoAQH4AQOIAgGoAgO4Aq_5xJAGwAIB0gIkNGM5OGIwZGYtOTljOC00OTZmLTg3YWYtZmI2ZjUzYTkwMDE12AIF4AIB`,
    `%3Bsid%3Dc164a2a21ede1af159b039e5574a0a20%3Btmpl%3Dsearchresults%3Bcheckin_month%3D${checkIn.month}%`,
    `3Bcheckin_monthday%3D${checkIn.day}%3Bcheckin_year%3D${checkIn.year}%3Bcheckout_month%3D${checkOut.month}%3Bcheckout_monthday`,
    `%3D2%3Bcheckout_year%3D${checkOut.year}%3Bcity%3D-390625%3Bclass_interval%3D1%3Bdest_id%3D-390625%3Bdest_type`,
    `%3Dcity%3Bdtdisc%3D0%3Bfrom_sf%3D1%3Bgroup_adults%3D${adults}%3Bgroup_children%3D0%3Binac%3D0%3Bindex_postcard`,
    `%3D0%3Blabel_click%3Dundef%3Bno_rooms%3D1%3Boffset%3D0%3Bpostcard%3D0%3Broom1%3DA%252CA%3Bsb_entire_place`,
    `%3D1%3Bsb_price_type%3Dtotal%3Bshw_aparth%3D1%3Bslp_r_match%3D0%3Bsrc%3Dsearchresults%3Bsrpvid%3Dbb75853ddab40044%3Bss%3DMadrid`,
    `%3Bss_all%3D0%3Bssb%3Dempty%3Bsshis%3D0%3Bssne%3DMadrid%3Bssne_untouched%3DMadrid%26%3B&ss=Madrid&is_ski_area=0`,
    `&ssne=Madrid&ssne_untouched=Madrid&city=-390625&checkin_year=${checkIn.year}&checkin_month=${checkIn.month}&checkin_monthday=${checkIn.day}&checkout_year=${checkOut.year}`,
    `&checkout_month=${checkOut.month}&checkout_monthday=${checkOut.day}&group_adults=${adults}&group_children=0&no_rooms=1&sb_entire_place=1&from_sf=1`,
    `&nflt=${privacyType[type]}`,
  ].join("");

  return originaUrl;
}

/**
 *
 * @param checkDates
 * @param adults
 * @param type
 * @returns
 */
function builderUrlAirbnb(
  checkDates: datesCheckInOut,
  adults: number,
  type: number
): string {
  const { checkIn, checkOut } = checkDates;

  const room_types = {
    entery: "Entire%20home%2Fapt",
    100: "privacy_type%3D3%3Bpri%3D2",
    150: "privacy_type%3D3%3Bpri%3D3",
    200: "privacy_type%3D3%3Bpri%3D4",
  };

  const originaUrl = [
    `https://www.airbnb.es/s/Madrid/homes`,
    `?date_picker_type=calendar&query=Madrid`,
    `&place_id=ChIJgTwKgJcpQg0RaSKMYcHeNsQ&`,
    `checkin=${checkIn.year}-${checkIn.month}-${checkIn.day}&checkout=${checkOut.year}-${checkOut.month}-${checkOut.day}`,
    `&adults=${adults}&price_max=300&property_type_id%5B%5D=1`,
    `&room_types%5B%5D=Entire%20home%2Fapt&search_type=filter_change`,
  ].join("");

  return originaUrl;
}

/**
 *
 * @param type
 * @param adults
 * @param initDay
 * @returns
 */
function builderUrl(
  type: 50 | 100 | 150 | 200,
  adults: number,
  initDay: number,
  source: "booking" | "airbnb"
): { url: string; dates: datesCheckInOut } {
  const checkInDate = format(add(new Date(), { days: initDay }), "d/L/y").split(
    "/"
  );
  const checkOutDate = format(
    add(new Date(), { days: initDay + 1 }),
    "d/L/y"
  ).split("/");

  const checkDates: datesCheckInOut = {
    checkIn: {
      day: checkInDate[0],
      month: checkInDate[1],
      year: checkInDate[2],
    },
    checkOut: {
      day: checkOutDate[0],
      month: checkOutDate[1],
      year: checkOutDate[2],
    },
  };

  let originaUrl = "";

  if (source === "booking") {
    originaUrl = builderUrlBooking(checkDates, adults, type);
  }
  if (source === "airbnb") {
    originaUrl = builderUrlAirbnb(checkDates, adults, type);
  }

  const url = originaUrl;
  return {
    url,
    dates: checkDates,
  };
}

export { builderUrl };
