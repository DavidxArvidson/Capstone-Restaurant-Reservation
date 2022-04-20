import React from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, today, next } from "../utils/date-time";
import { useHistory } from "react-router-dom";
import ReservationTableComp from "./ReservationTableComp";
import TableTableComp from "./TableTableComp";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, reservations, reservationsError, tables, tablesError, loadDashboard }) {
	const history = useHistory();

	const reservationsRow = () => {
    	return reservations.map((reservation) => 
      		<ReservationTableComp key={reservation.reservation_id} reservation={reservation} loadDashboard={loadDashboard} />);
  	};
  
  	const tablesRow = () => {
    	return tables.map((table) => 
      		<TableTableComp key={table.table_id} table={table} loadDashboard={loadDashboard} />);
  	};

	function handleClick({ target }) {
		let newDate;
		let useDate;

		if (!date) {
			useDate = today();
		} else {
			useDate = date;
		}

		if (target.name === "previous") {
			newDate = previous(useDate);
		} else if (target.name === "next") {
			newDate = next(useDate);
		} else {
			newDate = today();
		}

		history.push(`/dashboard?date=${newDate}`);
	}


  	return (
    	<main>
      		<h1>Dashboard</h1>
        	<h4 className="mb-0">Reservations for {date}</h4>
      			<ErrorAlert error={reservationsError} />

				<table className="table">
					<thead>
						<tr>
							<th scope="col">ID</th>
							<th scope="col">First Name</th>
							<th scope="col">Last Name</th>
							<th scope="col">Mobile Number</th>
							<th scope="col">Date</th>
							<th scope="col">Time</th>
							<th scope="col">People</th>
							<th scope="col">Status</th>
							<th scope="col">Edit</th>
							<th scope="col">Cancel</th>
							<th scope="col">Seat</th>
						</tr>
					</thead>
			
					<tbody>
          				{reservationsRow()}
					</tbody>
				</table>
      
			<h4 className="mb-0">Tables</h4>

			<ErrorAlert error={tablesError} />

			<table className="table">
				<thead>
					<tr>
						<th scope="col">Table ID</th>
						<th scope="col">Table Name</th>
						<th scope="col">Capacity</th>
						<th scope="col">Status</th>
						<th scope="col">Reservation ID</th>
						<th scope="col">Finish</th>
					</tr>
				</thead>
				
				<tbody>
					{tablesRow()}
				</tbody>
			</table>
	  
			<button type="button" name="previous" onClick={handleClick}>Previous</button>
			<button type="button" name="today" onClick={handleClick}>Today</button>
			<button type="button" name="next" onClick={handleClick}>Next</button>
    	</main>
  	);
}

export default Dashboard;