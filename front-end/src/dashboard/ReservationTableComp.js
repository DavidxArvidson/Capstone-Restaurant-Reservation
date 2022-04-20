import React from "react";
import { Link } from "react-router-dom";
import { updateReservationStatus } from "../utils/api";

export default function ReservationTableComp({ reservation, loadDashboard }) {
	if (!reservation || reservation.status === "finished") {
		return null;
	}

	function handleCancel() {
		if (window.confirm("Are you sure you want to cancel this reservation?")) {
			const abortController = new AbortController();

			updateReservationStatus(reservation.reservation_id, "cancelled", abortController.status)
				.then(loadDashboard);

			return () => abortController.abort();
		}
	}

	return (
		<tr>
			<th scope="row">{reservation.reservation_id}</th>
			
			<td>{reservation.first_name}</td>
			<td>{reservation.last_name}</td>
			<td>{reservation.mobile_number}</td>
			<td>{reservation.reservation_date.substr(0, 10)}</td>
			<td>{reservation.reservation_time.substr(0, 5)}</td>
			<td>{reservation.people}</td>
			<td data-reservation-id-status={reservation.reservation_id}>{reservation.status}</td>
			
			{reservation.status === "booked" &&
				<>
					<td>
						<Link to={`/reservations/${reservation.reservation_id}/edit`}>
							<button type="button">Edit</button>
						</Link>
					</td>

					<td>
						<button type="button" onClick={handleCancel} data-reservation-id-cancel={reservation.reservation_id}>
							Cancel
						</button>
					</td>

					<td>
						<a href={`/reservations/${reservation.reservation_id}/seat`}>
							<button type="button">Seat</button>
						</a>
					</td>
				</>
			}
		</tr>
	);
}