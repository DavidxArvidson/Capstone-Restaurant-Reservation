import React, { useState, useEffect } from "react";
import { listReservations } from "../utils/api";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import NewReservation from "../reservations/NewReservation";
import ReservationSeat from "../reservations/ReservationSeat";
import NewTable from "../tables/NewTable";
import useQuery from "../utils/useQuery";
import Search from "../reservations/Search";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
	const [tablesError, setTablesError] = useState(null);
  const query = useQuery();
	const date = query.get("date");

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  useEffect(loadDashboard, [date]);

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
				<Dashboard 
					date={date}
					reservations={reservations}
					reservationsError={reservationsError}
					tables={tables}
					tablesError={tablesError}
					loadDashboard={loadDashboard}
				/>
			</Route>
      <Route exact={true} path="/reservations/new">
	      <NewReservation />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/seat">
        <ReservationSeat 
          tables={tables}
					loadDashboard={loadDashboard}
        />
      </Route>
      <Route path="/search">
	      <Search />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
