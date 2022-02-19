import { viewPage } from "./controllers/booking";
import dotenv from "dotenv";
dotenv.config();

/**
 * This is main function
 */

function init():void{
    const URL_50 = 'https://www.booking.com/searchresults.es.html?label=gog235jc-1DCAEoggI46AdIClgDaEaIAQGYAQq4ARfIAQzYAQPoAQH4AQKIAgGoAgO4ApaWv5AGwAIB0gIkZTI4ZThlYjctNDBjZC00ZmJlLWIxNDQtNzhmMjg5ZmU5NjM52AIE4AIB&sid=8351c6c1d0a7dd8d6247543ef8eebca9&aid=397594&sb_lp=1&src=index&error_url=https%3A%2F%2Fwww.booking.com%2Findex.es.html%3Faid%3D397594%3Blabel%3Dgog235jc-1DCAEoggI46AdIClgDaEaIAQGYAQq4ARfIAQzYAQPoAQH4AQKIAgGoAgO4ApaWv5AGwAIB0gIkZTI4ZThlYjctNDBjZC00ZmJlLWIxNDQtNzhmMjg5ZmU5NjM52AIE4AIB%3Bsid%3D8351c6c1d0a7dd8d6247543ef8eebca9%3Bsb_price_type%3Dtotal%26%3B&ss=Madrid%2C+Comunidad+de+Madrid%2C+Espa%C3%B1a&is_ski_area=&checkin_year=2022&checkin_month=3&checkin_monthday=1&checkout_year=2022&checkout_month=3&checkout_monthday=5&group_adults=1&group_children=0&no_rooms=1&b_h4u_keep_filters=&from_sf=1&search_pageview_id=e21174cb2fe401b9&ac_suggestion_list_length=5&ac_suggestion_theme_list_length=0&ac_position=1&ac_langcode=es&ac_click_type=b&dest_id=-390625&dest_type=city&iata=MAD&place_id_lat=40.4167&place_id_lon=-3.70342&search_pageview_id=e21174cb2fe401b9&search_selected=true&ss_raw=madrid&nflt=ht_id%3D201%3Bpri%3D2'
    viewPage(URL_50)
}

init();
